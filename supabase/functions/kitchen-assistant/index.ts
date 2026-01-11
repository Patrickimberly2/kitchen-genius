import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  dimensions: { width: number; height: number; depth: number };
}

interface Item {
  id: string;
  name: string;
  category: string;
  zone_id: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zones, items } = await req.json() as { zones: Zone[]; items: Item[] };
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context for the AI
    const zonesSummary = zones.map(z => `- ${z.name} (${z.zone_type}): ${z.dimensions.width}x${z.dimensions.height}x${z.dimensions.depth}m`).join("\n");
    
    const itemsByZone = new Map<string, Item[]>();
    items.forEach(item => {
      const zoneItems = itemsByZone.get(item.zone_id) || [];
      zoneItems.push(item);
      itemsByZone.set(item.zone_id, zoneItems);
    });

    const itemsSummary = zones.map(zone => {
      const zoneItems = itemsByZone.get(zone.id) || [];
      if (zoneItems.length === 0) return `${zone.name}: empty`;
      return `${zone.name} (${zoneItems.length} items): ${zoneItems.map(i => `${i.name} (${i.category}${i.expiry_date ? `, expires: ${i.expiry_date}` : ""})`).join(", ")}`;
    }).join("\n");

    const unassignedItems = items.filter(i => !i.zone_id);
    const unassignedSummary = unassignedItems.length > 0 
      ? `Unassigned items: ${unassignedItems.map(i => i.name).join(", ")}`
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
