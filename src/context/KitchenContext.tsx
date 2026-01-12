import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";
import { KitchenZone, InventoryItem, KitchenPresetKey, AISuggestion, ZoneCapacityInfo, DragItem } from "@/types/kitchen";
import { kitchenPresets } from "@/data/kitchenPresets";
import { sampleInventory } from "@/data/sampleInventory";
import { calculateZoneCapacity } from "@/utils/itemShapeUtils";

interface KitchenContextType {
  zones: KitchenZone[];
  items: InventoryItem[];
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  suggestions: AISuggestion[];
  currentPreset: KitchenPresetKey | null;
  isLoadingAI: boolean;
  highlightedZoneIds: string[];
  dragItem: DragItem | null;
  isMobileView: boolean;
  
  // Zone actions
  setZones: (zones: KitchenZone[]) => void;
  addZone: (zone: KitchenZone) => void;
  updateZone: (id: string, updates: Partial<KitchenZone>) => void;
  removeZone: (id: string) => void;
  selectZone: (id: string | null) => void;
  hoverZone: (id: string | null) => void;
  loadPreset: (preset: KitchenPresetKey) => void;
  highlightZones: (ids: string[]) => void;
  
  // Item actions
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  moveItemToZone: (itemId: string, zoneId: string) => void;
  startDrag: (item: DragItem) => void;
  endDrag: () => void;
  
  // AI actions
  generateSuggestions: () => void;
  generateAISuggestions: () => Promise<void>;
  dismissSuggestion: (id: string) => void;
  applySuggestion: (suggestion: AISuggestion) => void;
  setSuggestions: (suggestions: AISuggestion[]) => void;
  
  // Helpers
  getItemsInZone: (zoneId: string) => InventoryItem[];
  getItemCountInZone: (zoneId: string) => number;
  getZoneCapacity: (zoneId: string) => ZoneCapacityInfo | null;
  getAllCapacities: () => ZoneCapacityInfo[];
  isValidDropZone: (zoneId: string, item: InventoryItem) => boolean;
  
  // View mode
  setMobileView: (isMobile: boolean) => void;
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
  const [highlightedZoneIds, setHighlightedZoneIds] = useState<string[]>([]);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

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

  const highlightZones = useCallback((ids: string[]) => {
    setHighlightedZoneIds(ids);
    // Auto-clear highlight after 5 seconds
    if (ids.length > 0) {
      setTimeout(() => setHighlightedZoneIds([]), 5000);
    }
  }, []);

  const loadPreset = useCallback((preset: KitchenPresetKey) => {
    const presetZones = kitchenPresets[preset].map((zone) => ({
      ...zone,
      id: Math.random().toString(36).substring(2, 11),
      maxItems: calculateZoneCapacity(zone.dimensions.width, zone.dimensions.height, zone.dimensions.depth),
      capacityWarning: 80,
    }));
    setZones(presetZones);
    setCurrentPreset(preset);
    setSelectedZoneId(null);
    
    // Auto-assign items to zones based on type
    const newItems = [...items];
    const refrigerator = presetZones.find((z) => z.zone_type === "refrigerator" || z.zone_type === "fridge_door" || z.zone_type === "fridge_drawer");
    const pantryShelf = presetZones.find((z) => z.zone_type === "pantry_shelf");
    const pantry = presetZones.find((z) => z.zone_type === "pantry");
    const drawer = presetZones.find((z) => z.zone_type === "drawer");
    const cabinet = presetZones.find((z) => z.zone_type === "lower_cabinet" || z.zone_type === "upper_cabinet");
    
    newItems.forEach((item, idx) => {
      if (item.category === "beverages" || (item.category === "food" && item.expiry_date)) {
        if (refrigerator) newItems[idx] = { ...item, zone_id: refrigerator.id };
      } else if (item.category === "food" || item.category === "spices") {
        if (pantryShelf) newItems[idx] = { ...item, zone_id: pantryShelf.id };
        else if (pantry) newItems[idx] = { ...item, zone_id: pantry.id };
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

  const startDrag = useCallback((item: DragItem) => {
    setDragItem(item);
  }, []);

  const endDrag = useCallback(() => {
    setDragItem(null);
  }, []);

  const getItemsInZone = useCallback(
    (zoneId: string) => items.filter((i) => i.zone_id === zoneId),
    [items]
  );

  const getItemCountInZone = useCallback(
    (zoneId: string) => items.filter((i) => i.zone_id === zoneId).length,
    [items]
  );

  const getZoneCapacity = useCallback((zoneId: string): ZoneCapacityInfo | null => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return null;
    
    const itemCount = getItemCountInZone(zoneId);
    const maxItems = zone.maxItems || calculateZoneCapacity(
      zone.dimensions.width, 
      zone.dimensions.height, 
      zone.dimensions.depth
    );
    const usagePercent = Math.round((itemCount / maxItems) * 100);
    
    let status: "ok" | "warning" | "full" = "ok";
    if (usagePercent >= 100) status = "full";
    else if (usagePercent >= (zone.capacityWarning || 80)) status = "warning";
    
    return {
      zoneId,
      zoneName: zone.name,
      itemCount,
      maxItems,
      usagePercent,
      status,
    };
  }, [zones, getItemCountInZone]);

  const getAllCapacities = useCallback((): ZoneCapacityInfo[] => {
    return zones
      .filter(z => !["countertop", "window", "sink", "stove"].includes(z.zone_type))
      .map(z => getZoneCapacity(z.id))
      .filter((c): c is ZoneCapacityInfo => c !== null);
  }, [zones, getZoneCapacity]);

  // Check if a zone is valid for dropping an item
  const isValidDropZone = useCallback((zoneId: string, item: InventoryItem): boolean => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return false;
    
    // Invalid zone types for items
    const invalidTypes = ["countertop", "window", "sink", "stove", "dishwasher", "microwave"];
    if (invalidTypes.includes(zone.zone_type)) return false;
    
    // Check capacity
    const capacity = getZoneCapacity(zoneId);
    if (capacity && capacity.status === "full") return false;
    
    // Category-based validation
    if (item.category === "cleaning" && zone.zone_type === "pantry_shelf") return false;
    if (item.category === "food" && item.expiry_date && zone.zone_type === "pantry_shelf") {
      // Perishables should go in fridge
      return false;
    }
    
    return true;
  }, [zones, getZoneCapacity]);

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
        description: `${expiringItems.map((i) => i.name).join(", ")} will expire within a week. Move them to the front of your fridge.`,
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
        description: `${unassignedItems.length} items haven't been placed in any zone. Drag them to organize your kitchen.`,
        item_ids: unassignedItems.map((i) => i.id),
        priority: "medium",
      });
    }
    
    // Capacity warnings
    const capacities = getAllCapacities();
    capacities.forEach(cap => {
      if (cap.status === "warning" || cap.status === "full") {
        newSuggestions.push({
          id: `capacity-${cap.zoneId}`,
          type: "capacity",
          title: `${cap.zoneName} is ${cap.status === "full" ? "full" : "nearly full"}`,
          description: `${cap.usagePercent}% capacity used. Consider redistributing items to nearby zones.`,
          zone_id: cap.zoneId,
          priority: cap.status === "full" ? "high" : "medium",
        });
      }
    });
    
    // Category consolidation
    const spices = items.filter((i) => i.category === "spices" && i.zone_id);
    const spiceZones = new Set(spices.map((i) => i.zone_id));
    if (spiceZones.size > 1) {
      newSuggestions.push({
        id: "spice-1",
        type: "organization",
        title: "Group your spices",
        description: "Your spices are spread across multiple zones. Consolidating them will make cooking easier.",
        item_ids: spices.map((i) => i.id),
        priority: "low",
        action: {
          type: "consolidate",
          itemIds: spices.map(i => i.id),
        },
      });
    }
    
    setSuggestions(newSuggestions);
  }, [items, zones, getAllCapacities]);

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
      generateSuggestions();
    } finally {
      setIsLoadingAI(false);
    }
  }, [zones, items, generateSuggestions]);

  const dismissSuggestion = useCallback((id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const applySuggestion = useCallback((suggestion: AISuggestion) => {
    if (!suggestion.action) {
      dismissSuggestion(suggestion.id);
      return;
    }
    
    const { action } = suggestion;
    
    switch (action.type) {
      case "move_items":
        if (action.targetZoneId && action.itemIds) {
          action.itemIds.forEach(itemId => {
            moveItemToZone(itemId, action.targetZoneId!);
          });
        }
        break;
        
      case "consolidate":
        // Find best zone for consolidation
        if (action.itemIds) {
          const firstItem = items.find(i => i.id === action.itemIds![0]);
          if (firstItem?.zone_id) {
            action.itemIds.forEach(itemId => {
              moveItemToZone(itemId, firstItem.zone_id);
            });
          }
        }
        break;
    }
    
    dismissSuggestion(suggestion.id);
  }, [items, moveItemToZone, dismissSuggestion]);

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
        highlightedZoneIds,
        dragItem,
        isMobileView,
        setZones,
        addZone,
        updateZone,
        removeZone,
        selectZone,
        hoverZone,
        loadPreset,
        highlightZones,
        addItem,
        updateItem,
        removeItem,
        moveItemToZone,
        startDrag,
        endDrag,
        generateSuggestions,
        generateAISuggestions,
        dismissSuggestion,
        applySuggestion,
        setSuggestions,
        getItemsInZone,
        getItemCountInZone,
        getZoneCapacity,
        getAllCapacities,
        isValidDropZone,
        setMobileView: setIsMobileView,
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
