export type ZoneType =
  | "upper_cabinet"
  | "lower_cabinet"
  | "drawer"
  | "pantry"
  | "pantry_shelf"
  | "refrigerator"
  | "freezer"
  | "upright_freezer"
  | "freezer_shelf"
  | "fridge_door"
  | "fridge_drawer"
  | "island"
  | "peninsula"
  | "appliance"
  | "shelf"
  | "countertop"
  | "cabinet_upper"
  | "cabinet_lower"
  | "floor"
  | "sink"
  | "stove"
  | "dishwasher"
  | "window"
  | "microwave";

export type ItemCategory =
  | "food"
  | "cookware"
  | "utensils"
  | "appliances"
  | "dishes"
  | "storage"
  | "cleaning"
  | "spices"
  | "beverages"
  | "other";

// Item shape types for 3D rendering
export type ItemShape = "box" | "cylinder" | "bottle" | "jar" | "bag" | "can" | "carton" | "pouch";

// Item dimensions for realistic sizing
export interface ItemDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface KitchenZone {
  id: string;
  name: string;
  zone_type: ZoneType;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  rotation?: { x: number; y: number; z: number };
  color?: string;
  notes?: string;
  inventory?: any[];
  // Capacity tracking
  maxItems?: number;
  capacityWarning?: number; // Percentage threshold for warnings (e.g., 80)
}

export interface InventoryItem {
  id: string;
  name: string;
  zone_id: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  expiry_date?: string;
  purchase_date?: string;
  notes?: string;
  low_stock_threshold?: number | null;
  image_url?: string;
  barcode?: string;
  // 3D item properties
  shape?: ItemShape;
  dimensions?: ItemDimensions;
  color?: string;
  // Position within zone for 3D packing
  localPosition?: { x: number; y: number; z: number };
}

export type KitchenPresetKey = "l-shaped" | "galley" | "u-shaped" | "island" | "custom-u-shaped" | "empty-room";

// Alias for backward compatibility
export type KitchenPreset = KitchenPresetKey;

export interface KitchenPresetData {
  id: string;
  name: string;
  zones: KitchenZone[];
}

export interface PresetLabel {
  name: string;
  description: string;
}

export interface AISuggestion {
  id: string;
  type: "organization" | "expiry" | "placement" | "optimization" | "capacity";
  title: string;
  description: string;
  zone_id?: string;
  item_ids?: string[];
  priority: "low" | "medium" | "high";
  // New: Action data for apply functionality
  action?: {
    type: "move_items" | "redistribute" | "consolidate";
    targetZoneId?: string;
    sourceZoneId?: string;
    itemIds?: string[];
  };
}

// Capacity info for zones
export interface ZoneCapacityInfo {
  zoneId: string;
  zoneName: string;
  itemCount: number;
  maxItems: number;
  usagePercent: number;
  status: "ok" | "warning" | "full";
}

// Drag and drop context
export interface DragItem {
  itemId: string;
  item: InventoryItem;
}
