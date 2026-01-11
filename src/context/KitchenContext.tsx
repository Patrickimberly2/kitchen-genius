import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { KitchenZone, InventoryItem, KitchenPresetKey, AISuggestion } from "@/types/kitchen";
import { kitchenPresets } from "@/data/kitchenPresets";
import { sampleInventory } from "@/data/sampleInventory";

interface KitchenContextType {
  zones: KitchenZone[];
  items: InventoryItem[];
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  suggestions: AISuggestion[];
  currentPreset: KitchenPresetKey | null;
  isLoadingAI: boolean;
  
  // Zone actions
  setZones: (zones: KitchenZone[]) => void;
  addZone: (zone: KitchenZone) => void;
  updateZone: (id: string, updates: Partial<KitchenZone>) => void;
  removeZone: (id: string) => void;
  selectZone: (id: string | null) => void;
  hoverZone: (id: string | null) => void;
  loadPreset: (preset: KitchenPresetKey) => void;
  
  // Item actions
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  moveItemToZone: (itemId: string, zoneId: string) => void;
  
  // AI actions
  generateSuggestions: () => void;
  generateAISuggestions: () => Promise<void>;
  dismissSuggestion: (id: string) => void;
  setSuggestions: (suggestions: AISuggestion[]) => void;
  
  // Helpers
  getItemsInZone: (zoneId: string) => InventoryItem[];
  getItemCountInZone: (zoneId: string) => number;
}

const KitchenContext = createContext<KitchenContextType | null>(null);

export function KitchenProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<KitchenZone[]>([]);
  const [items, setItems] = useState<InventoryItem[]>(sampleInventory);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [currentPreset, setCurrentPreset] = useState<KitchenPresetKey | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const addZone = useCallback((zone: KitchenZone) => {
    setZones((prev) => [...prev, zone]);
  }, []);

  const updateZone = useCallback((id: string, updates: Partial<KitchenZone>) => {
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, ...updates } : z)));
  }, []);

  const removeZone = useCallback((id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    setItems((prev) => prev.map((item) => (item.zone_id === id ? { ...item, zone_id: "" } : item)));
  }, []);

  const selectZone = useCallback((id: string | null) => {
    setSelectedZoneId(id);
  }, []);

  const hoverZone = useCallback((id: string | null) => {
    setHoveredZoneId(id);
  }, []);

  const loadPreset = useCallback((preset: KitchenPresetKey) => {
    const presetZones = kitchenPresets[preset].map((zone) => ({
      ...zone,
      id: Math.random().toString(36).substring(2, 11),
    }));
    setZones(presetZones);
    setCurrentPreset(preset);
    setSelectedZoneId(null);
    
    const newItems = [...items];
    const refrigerator = presetZones.find((z) => z.zone_type === "refrigerator");
    const pantry = presetZones.find((z) => z.zone_type === "pantry");
    const drawer = presetZones.find((z) => z.zone_type === "drawer");
    const cabinet = presetZones.find((z) => z.zone_type === "lower_cabinet" || z.zone_type === "upper_cabinet" || z.zone_type === "cabinet_lower" || z.zone_type === "cabinet_upper");
    
    newItems.forEach((item, idx) => {
      if (item.category === "beverages" || (item.category === "food" && item.expiry_date)) {
        if (refrigerator) newItems[idx] = { ...item, zone_id: refrigerator.id };
      } else if (item.category === "food" || item.category === "spices") {
        if (pantry) newItems[idx] = { ...item, zone_id: pantry.id };
      } else if (item.category === "utensils") {
        if (drawer) newItems[idx] = { ...item, zone_id: drawer.id };
      } else if (cabinet) {
        newItems[idx] = { ...item, zone_id: cabinet.id };
      }
    });
    
    setItems(newItems);
  }, [items]);

  const addItem = useCallback((item: InventoryItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const moveItemToZone = useCallback((itemId: string, zoneId: string) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, zone_id: zoneId } : i)));
  }, []);

  const getItemsInZone = useCallback(
    (zoneId: string) => items.filter((i) => i.zone_id === zoneId),
    [items]
  );

  const getItemCountInZone = useCallback(
    (zoneId: string) => items.filter((i) => i.zone_id === zoneId).length,
    [items]
  );

  const generateSuggestions = useCallback(() => {
    const newSuggestions: AISuggestion[] = [];
    
    const today = new Date();
    const expiringItems = items.filter((item) => {
      if (!item.expiry_date) return false;
      const expiry = new Date(item.expiry_date);
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    });
    
    if (expiringItems.length > 0) {
      newSuggestions.push({
        id: "exp-1",
        type: "expiry",
        title: "Items expiring soon",
        description: `${expiringItems.map((i) => i.name).join(", ")} will expire within a week. Consider using them first.`,
        item_ids: expiringItems.map((i) => i.id),
        priority: "high",
      });
    }
    
    const unassignedItems = items.filter((i) => !i.zone_id);
    if (unassignedItems.length > 0) {
      newSuggestions.push({
        id: "unassigned-1",
        type: "placement",
        title: "Unassigned items",
        description: `${unassignedItems.length} items haven't been placed in any zone.`,
        item_ids: unassignedItems.map((i) => i.id),
        priority: "medium",
      });
    }
    
    zones.forEach((zone) => {
      const zoneItems = getItemsInZone(zone.id);
      const volume = zone.dimensions.width * zone.dimensions.height * zone.dimensions.depth;
      if (zoneItems.length > volume * 8) {
        newSuggestions.push({
          id: `crowd-${zone.id}`,
          type: "optimization",
          title: `${zone.name} is overcrowded`,
          description: `Consider redistributing items from ${zone.name} to nearby zones.`,
          zone_id: zone.id,
          priority: "medium",
        });
      }
    });
    
    const spices = items.filter((i) => i.category === "spices");
    const spiceZones = new Set(spices.map((i) => i.zone_id).filter(Boolean));
    if (spiceZones.size > 1) {
      newSuggestions.push({
        id: "spice-1",
        type: "organization",
        title: "Group your spices",
        description: "Your spices are spread across multiple zones. Consider consolidating them.",
        item_ids: spices.map((i) => i.id),
        priority: "low",
      });
    }
    
    setSuggestions(newSuggestions);
  }, [items, zones, getItemsInZone]);

  const generateAISuggestions = useCallback(async () => {
    setIsLoadingAI(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kitchen-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          zones: zones.map(z => ({
            id: z.id,
            name: z.name,
            zone_type: z.zone_type,
            dimensions: z.dimensions,
          })),
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            category: i.category,
            zone_id: i.zone_id,
            quantity: i.quantity,
            unit: i.unit,
            expiry_date: i.expiry_date,
          })),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Usage limit reached. Please add credits.");
        }
        throw new Error("Failed to get AI suggestions");
      }

      const data = await response.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      // Fall back to local suggestions
      generateSuggestions();
    } finally {
      setIsLoadingAI(false);
    }
  }, [zones, items, generateSuggestions]);

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <KitchenContext.Provider
      value={{
        zones,
        items,
        selectedZoneId,
        hoveredZoneId,
        suggestions,
        currentPreset,
        isLoadingAI,
        setZones,
        addZone,
        updateZone,
        removeZone,
        selectZone,
        hoverZone,
        loadPreset,
        addItem,
        updateItem,
        removeItem,
        moveItemToZone,
        generateSuggestions,
        generateAISuggestions,
        dismissSuggestion,
        setSuggestions,
        getItemsInZone,
        getItemCountInZone,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error("useKitchen must be used within a KitchenProvider");
  }
  return context;
}
