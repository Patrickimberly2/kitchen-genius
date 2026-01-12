import { ZoneType } from "@/types/kitchen";

export function getZoneColor(zoneType: ZoneType): string {
  const colors: Record<ZoneType, string> = {
    upper_cabinet: "#c4a77d",
    lower_cabinet: "#b89b6a",
    cabinet_upper: "#c4a77d",
    cabinet_lower: "#b89b6a",
    drawer: "#a88b5a",
    pantry: "#d4b896",
    pantry_shelf: "#e8ddd0",
    refrigerator: "#b8c8d4",
    freezer: "#a0b8c8",
    upright_freezer: "#1a1a1a",
    freezer_shelf: "#2a3a4a",
    fridge_door: "#d0dce4",
    fridge_drawer: "#c0ccd4",
    island: "#a89070",
    peninsula: "#a89070",
    appliance: "#9ca3af",
    shelf: "#c09870",
    countertop: "#e8ddd0",
    floor: "#8b7355",
    sink: "#c0c0c0",
    stove: "#f5f5f5",
    dishwasher: "#d0d0d0",
    window: "#87ceeb",
    microwave: "#2a2a2a",
  };
  return colors[zoneType] || "#b89b6a";
}

export function getZoneLabel(zoneType: ZoneType): string {
  const labels: Record<ZoneType, string> = {
    upper_cabinet: "Upper Cabinet",
    lower_cabinet: "Lower Cabinet",
    cabinet_upper: "Upper Cabinet",
    cabinet_lower: "Lower Cabinet",
    drawer: "Drawer",
    pantry: "Pantry",
    pantry_shelf: "Pantry Shelf",
    refrigerator: "Refrigerator",
    freezer: "Freezer",
    upright_freezer: "Upright Freezer",
    freezer_shelf: "Freezer Shelf",
    fridge_door: "Fridge Door",
    fridge_drawer: "Fridge Drawer",
    island: "Island",
    peninsula: "Peninsula",
    appliance: "Appliance",
    shelf: "Shelf",
    countertop: "Countertop",
    floor: "Floor",
    sink: "Sink",
    stove: "Stove",
    dishwasher: "Dishwasher",
    window: "Window",
    microwave: "Microwave",
  };
  return labels[zoneType] || "Zone";
}

export function getZoneIcon(zoneType: ZoneType): string {
  const icons: Record<ZoneType, string> = {
    upper_cabinet: "🗄️",
    lower_cabinet: "🗄️",
    cabinet_upper: "🗄️",
    cabinet_lower: "🗄️",
    drawer: "📦",
    pantry: "🚪",
    pantry_shelf: "📚",
    refrigerator: "🧊",
    freezer: "❄️",
    upright_freezer: "🧊",
    freezer_shelf: "❄️",
    fridge_door: "🚪",
    fridge_drawer: "📦",
    island: "🏝️",
    peninsula: "🏝️",
    appliance: "🔌",
    shelf: "📚",
    countertop: "📐",
    floor: "🟫",
    sink: "🚰",
    stove: "🔥",
    dishwasher: "🍽️",
    window: "🪟",
    microwave: "📻",
  };
  return icons[zoneType] || "📦";
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: "🍎",
    cookware: "🍳",
    utensils: "🥄",
    appliances: "🔌",
    dishes: "🍽️",
    storage: "📦",
    cleaning: "🧹",
    spices: "🌶️",
    beverages: "🥤",
    other: "📋",
  };
  return icons[category] || "📋";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    food: "Food",
    cookware: "Cookware",
    utensils: "Utensils",
    appliances: "Appliances",
    dishes: "Dishes",
    storage: "Storage",
    cleaning: "Cleaning",
    spices: "Spices",
    beverages: "Beverages",
    other: "Other",
  };
  return labels[category] || category;
}
