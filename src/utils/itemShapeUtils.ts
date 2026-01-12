import { ItemCategory, ItemShape, ItemDimensions } from "@/types/kitchen";

// Get default shape for category
export function getDefaultShape(category: ItemCategory, unit?: string): ItemShape {
  const unitLower = unit?.toLowerCase() || "";
  
  // Unit-based detection
  if (unitLower.includes("bottle")) return "bottle";
  if (unitLower.includes("jar") || unitLower.includes("container")) return "jar";
  if (unitLower.includes("can")) return "can";
  if (unitLower.includes("bag") || unitLower.includes("pouch")) return "bag";
  if (unitLower.includes("carton") || unitLower.includes("gallon")) return "carton";
  if (unitLower.includes("box")) return "box";
  
  // Category-based defaults
  switch (category) {
    case "beverages":
      return "bottle";
    case "spices":
      return "jar";
    case "food":
      return "box";
    case "cookware":
      return "cylinder";
    case "utensils":
      return "cylinder";
    case "dishes":
      return "cylinder";
    case "storage":
      return "jar";
    case "cleaning":
      return "bottle";
    case "appliances":
      return "box";
    default:
      return "box";
  }
}

// Get default dimensions for shape (in meters)
export function getDefaultDimensions(shape: ItemShape, category: ItemCategory): ItemDimensions {
  switch (shape) {
    case "bottle":
      return { width: 0.08, height: 0.28, depth: 0.08 };
    case "jar":
      return category === "spices" 
        ? { width: 0.05, height: 0.10, depth: 0.05 }
        : { width: 0.10, height: 0.15, depth: 0.10 };
    case "can":
      return { width: 0.08, height: 0.12, depth: 0.08 };
    case "bag":
      return { width: 0.15, height: 0.25, depth: 0.08 };
    case "carton":
      return { width: 0.10, height: 0.25, depth: 0.08 };
    case "pouch":
      return { width: 0.12, height: 0.18, depth: 0.04 };
    case "cylinder":
      return category === "cookware" 
        ? { width: 0.25, height: 0.08, depth: 0.25 }
        : { width: 0.03, height: 0.25, depth: 0.03 };
    case "box":
    default:
      if (category === "appliances") {
        return { width: 0.30, height: 0.25, depth: 0.20 };
      }
      if (category === "dishes") {
        return { width: 0.25, height: 0.03, depth: 0.25 };
      }
      return { width: 0.15, height: 0.22, depth: 0.08 };
  }
}

// Get color for category
export function getCategoryColor(category: ItemCategory): string {
  switch (category) {
    case "food":
      return "#e8c170";
    case "beverages":
      return "#7eb8da";
    case "spices":
      return "#d4956a";
    case "cookware":
      return "#5a5a5a";
    case "utensils":
      return "#a0522d";
    case "dishes":
      return "#e0e0e0";
    case "storage":
      return "#88b4c4";
    case "cleaning":
      return "#6eb86e";
    case "appliances":
      return "#808080";
    default:
      return "#b0a090";
  }
}

// Simple packing algorithm - place items in a grid pattern within a zone
export function packItemsInZone(
  items: { id: string; dimensions: ItemDimensions }[],
  zoneWidth: number,
  zoneHeight: number,
  zoneDepth: number,
  padding: number = 0.02
): Map<string, { x: number; y: number; z: number }> {
  const positions = new Map<string, { x: number; y: number; z: number }>();
  
  if (items.length === 0) return positions;
  
  // Sort items by volume (largest first for better packing)
  const sortedItems = [...items].sort((a, b) => {
    const volA = a.dimensions.width * a.dimensions.height * a.dimensions.depth;
    const volB = b.dimensions.width * b.dimensions.height * b.dimensions.depth;
    return volB - volA;
  });
  
  let currentX = -zoneWidth / 2 + padding;
  let currentY = -zoneHeight / 2 + padding;
  let currentZ = -zoneDepth / 2 + padding;
  let rowMaxHeight = 0;
  let layerMaxDepth = 0;
  
  for (const item of sortedItems) {
    const { width, height, depth } = item.dimensions;
    
    // Check if item fits in current row
    if (currentX + width > zoneWidth / 2 - padding) {
      // Move to next row
      currentX = -zoneWidth / 2 + padding;
      currentZ += layerMaxDepth + padding;
      layerMaxDepth = 0;
    }
    
    // Check if we need a new layer (height)
    if (currentZ + depth > zoneDepth / 2 - padding) {
      currentZ = -zoneDepth / 2 + padding;
      currentY += rowMaxHeight + padding;
      rowMaxHeight = 0;
      currentX = -zoneWidth / 2 + padding;
    }
    
    // Check if item fits in zone at all
    if (currentY + height > zoneHeight / 2 - padding) {
      // Zone is full, place item at edge (overflow indicator)
      positions.set(item.id, {
        x: 0,
        y: zoneHeight / 2 - height / 2,
        z: zoneDepth / 2 - depth / 2,
      });
      continue;
    }
    
    // Place item
    positions.set(item.id, {
      x: currentX + width / 2,
      y: currentY + height / 2,
      z: currentZ + depth / 2,
    });
    
    // Update position for next item
    currentX += width + padding;
    rowMaxHeight = Math.max(rowMaxHeight, height);
    layerMaxDepth = Math.max(layerMaxDepth, depth);
  }
  
  return positions;
}

// Calculate zone capacity
export function calculateZoneCapacity(
  zoneWidth: number,
  zoneHeight: number,
  zoneDepth: number,
  avgItemSize: number = 0.015 // Average item volume in cubic meters
): number {
  const zoneVolume = zoneWidth * zoneHeight * zoneDepth;
  // Assume 60% packing efficiency
  return Math.floor((zoneVolume * 0.6) / avgItemSize);
}
