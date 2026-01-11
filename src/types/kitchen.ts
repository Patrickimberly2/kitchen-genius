export type ZoneType =
  | "upper_cabinet"
  | "lower_cabinet"
  | "drawer"
  | "pantry"
  | "refrigerator"
  | "freezer"
  | "island"
  | "peninsula"
  | "appliance"
  | "shelf"
  | "countertop";

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

export interface KitchenZone {
  id: string;
  name: string;
  zone_type: ZoneType;
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  rotation?: { x: number; y: number; z: number }; // Rotation in radians
  color?: string;
  notes?: string;
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
}

export type KitchenPreset = "l-shaped" | "galley" | "u-shaped" | "island" | "custom-u-shaped";

export interface AISuggestion {
  id: string;
  type: "organization" | "expiry" | "placement" | "optimization";
  title: string;
  description: string;
  zone_id?: string;
  item_ids?: string[];
  priority: "low" | "medium" | "high";
}
