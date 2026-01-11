import { ZoneType } from "@/types/kitchen";

export function getZoneColor(zoneType: ZoneType): string {
  const colors: Record<ZoneType, string> = {
    upper_cabinet: "#c4a77d",
    lower_cabinet: "#b89b6a",
    drawer: "#a88b5a",
    pantry: "#d4b896",
    refrigerator: "#b8c8d4",
    freezer: "#a0b8c8",
    island: "#a89070",
    peninsula: "#a89070",
    appliance: "#9ca3af",
    shelf: "#c09870",
    countertop: "#e8ddd0",
  };
  return colors[zoneType] || "#b89b6a";
}

export function getZoneLabel(zoneType: ZoneType): string {
  const labels: Record<ZoneType, string> = {
    upper_cabinet: "Upper Cabinet",
    lower_cabinet: "Lower Cabinet",
    drawer: "Drawer",
    pantry: "Pantry",
    refrigerator: "Refrigerator",
    freezer: "Freezer",
    island: "Island",
    peninsula: "Peninsula",
    appliance: "Appliance",
    shelf: "Shelf",
    countertop: "Countertop",
  };
  return labels[zoneType] || "Zone";
}

export function getZoneIcon(zoneType: ZoneType): string {
  const icons: Record<ZoneType, string> = {
    upper_cabinet: "🗄️",
    lower_cabinet: "🗄️",
    drawer: "📦",
    pantry: "🚪",
    refrigerator: "🧊",
    freezer: "❄️",
    island: "🏝️",
    peninsula: "🏝️",
    appliance: "🔌",
    shelf: "📚",
    countertop: "📐",
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
