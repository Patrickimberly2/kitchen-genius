import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const DimensionsSchema = z.object({
  width: z.number().positive().max(100),
  height: z.number().positive().max(100),
  depth: z.number().positive().max(100),
});

const ZoneSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  zone_type: z.string().max(50),
  dimensions: DimensionsSchema,
});

const ItemSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  category: z.string().max(50),
  zone_id: z.string().max(100),
  quantity: z.number().nonnegative().max(10000),
  unit: z.string().max(20),
  expiry_date: z.string().max(50).optional(),
});

const RequestSchema = z.object({
  zones: z.array(ZoneSchema).max(50),
  items: z.array(ItemSchema).max(500),
});

type Zone = z.infer<typeof ZoneSchema>;
type Item = z.infer<typeof ItemSchema>;

// Sanitize string to prevent prompt injection
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
    .trim()
    .substring(0, 500); // Limit length
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ==========================================
    // AUTHENTICATION CHECK
    // ==========================================
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - No valid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Authentication failed:", claimsError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated request from user: ${userId}`);

    // ==========================================
    // INPUT VALIDATION
    // ==========================================
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validationResult = RequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.issues);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data", 
          details: validationResult.error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { zones, items } = validationResult.data;

    // ==========================================
    // PROCESS REQUEST
    // ==========================================
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context for the AI with sanitized inputs
    const zonesSummary = zones
      .map(z => `- ${sanitizeString(z.name)} (${sanitizeString(z.zone_type)}): ${z.dimensions.width}x${z.dimensions.height}x${z.dimensions.depth}m`)
      .join("\n");
    
    const itemsByZone = new Map<string, Item[]>();
    items.forEach(item => {
      const zoneItems = itemsByZone.get(item.zone_id) || [];
      zoneItems.push(item);
      itemsByZone.set(item.zone_id, zoneItems);
    });

    const itemsSummary = zones.map(zone => {
      const zoneItems = itemsByZone.get(zone.id) || [];
      if (zoneItems.length === 0) return `${sanitizeString(zone.name)}: empty`;
      return `${sanitizeString(zone.name)} (${zoneItems.length} items): ${zoneItems.map(i => 
        `${sanitizeString(i.name)} (${sanitizeString(i.category)}${i.expiry_date ? `, expires: ${sanitizeString(i.expiry_date)}` : ""})`
      ).join(", ")}`;
    }).join("\n");

    const unassignedItems = items.filter(i => !i.zone_id);
    const unassignedSummary = unassignedItems.length > 0 
      ? `Unassigned items: ${unassignedItems.map(i => sanitizeString(i.name)).join(", ")}`
      : "All items are assigned to zones.";

    const systemPrompt = `You are a kitchen organization expert AI assistant. Analyze the kitchen layout and inventory to provide actionable suggestions for better organization, storage optimization, and food management.

Focus on:
1. Items that will expire soon and need to be used
2. Overcrowded storage zones that need redistribution
3. Items placed in suboptimal locations (e.g., spices far from stove, frequently used items in hard-to-reach places)
4. Grouping similar items together for efficiency
5. Safety concerns (cleaning supplies near food, heavy items on high shelves)

Provide 3-5 specific, actionable suggestions. Each suggestion should have a clear priority (high, medium, low) based on urgency and impact.`;

    const userPrompt = `Here's the current kitchen setup:

ZONES:
${zonesSummary}

ITEMS BY ZONE:
${itemsSummary}

${unassignedSummary}

Please analyze this kitchen and provide organization suggestions.`;

    console.log(`Processing request for user ${userId}: ${zones.length} zones, ${items.length} items`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_suggestions",
              description: "Provide kitchen organization suggestions based on the analysis",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Unique identifier for the suggestion" },
                        type: { 
                          type: "string", 
                          enum: ["organization", "expiry", "placement", "optimization"],
                          description: "Type of suggestion"
                        },
                        title: { type: "string", description: "Short title for the suggestion" },
                        description: { type: "string", description: "Detailed actionable description" },
                        priority: { 
                          type: "string", 
                          enum: ["low", "medium", "high"],
                          description: "Priority level based on urgency"
                        },
                        zone_id: { type: "string", description: "Related zone ID if applicable" },
                        item_ids: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "Related item IDs if applicable"
                        },
                      },
                      required: ["id", "type", "title", "description", "priority"],
                    },
                  },
                },
                required: ["suggestions"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_suggestions" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      console.log(`Successfully generated ${parsed.suggestions?.length || 0} suggestions for user ${userId}`);
      return new Response(
        JSON.stringify({ suggestions: parsed.suggestions }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("No suggestions returned from AI");
  } catch (error) {
    console.error("Kitchen assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
