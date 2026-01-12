import { useMemo } from "react";
import { useKitchen } from "@/context/KitchenContext";
import { KitchenZone, InventoryItem } from "@/types/kitchen";
import { Item3D } from "./Item3D";
import { getDefaultShape, getDefaultDimensions, packItemsInZone } from "@/utils/itemShapeUtils";

interface ZoneItems3DProps {
  zone: KitchenZone;
  isOpen?: boolean;
}

export function ZoneItems3D({ zone, isOpen = false }: ZoneItems3DProps) {
  const { getItemsInZone, suggestions } = useKitchen();
  
  const items = getItemsInZone(zone.id);
  
  // Get highlighted item IDs from suggestions
  const highlightedItemIds = useMemo(() => {
    const ids = new Set<string>();
    suggestions.forEach(s => {
      if (s.zone_id === zone.id && s.item_ids) {
        s.item_ids.forEach(id => ids.add(id));
      }
    });
    return ids;
  }, [suggestions, zone.id]);
  
  // Prepare items with dimensions for packing
  const itemsWithDimensions = useMemo(() => {
    return items.map(item => {
      const shape = item.shape || getDefaultShape(item.category, item.unit);
      const dimensions = item.dimensions || getDefaultDimensions(shape, item.category);
      return { id: item.id, dimensions, item };
    });
  }, [items]);
  
  // Calculate packed positions
  const packedPositions = useMemo(() => {
    // Reduce zone dimensions slightly to keep items inside
    const innerWidth = zone.dimensions.width * 0.85;
    const innerHeight = zone.dimensions.height * 0.85;
    const innerDepth = zone.dimensions.depth * 0.7;
    
    return packItemsInZone(
      itemsWithDimensions,
      innerWidth,
      innerHeight,
      innerDepth,
      0.015
    );
  }, [itemsWithDimensions, zone.dimensions]);
  
  // Only show items when zone is "open" (for cabinets/drawers) or always for shelves
  const shouldShowItems = useMemo(() => {
    const alwaysVisibleTypes = ["countertop", "pantry_shelf", "freezer_shelf", "shelf"];
    return alwaysVisibleTypes.includes(zone.zone_type) || isOpen;
  }, [zone.zone_type, isOpen]);
  
  if (items.length === 0 || !shouldShowItems) return null;
  
  return (
    <group>
      {itemsWithDimensions.map(({ id, item }) => {
        const position = packedPositions.get(id) || { x: 0, y: 0, z: 0 };
        const isHighlighted = highlightedItemIds.has(id);
        
        return (
          <Item3D
            key={id}
            item={item}
            position={position}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </group>
  );
}
