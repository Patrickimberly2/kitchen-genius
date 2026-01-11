import { KitchenZone, KitchenPreset } from "@/types/kitchen";

const generateId = () => Math.random().toString(36).substring(2, 11);

export const kitchenPresets: Record<KitchenPreset, KitchenZone[]> = {
  "l-shaped": [
    // Back wall - upper cabinets
    { id: generateId(), name: "Upper Cabinet 1", zone_type: "upper_cabinet", position: { x: -2, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 2", zone_type: "upper_cabinet", position: { x: -1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 3", zone_type: "upper_cabinet", position: { x: 0, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    // Back wall - countertop
    { id: generateId(), name: "Countertop", zone_type: "countertop", position: { x: -1, y: 0.9, z: -2 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    // Back wall - lower cabinets
    { id: generateId(), name: "Lower Cabinet 1", zone_type: "lower_cabinet", position: { x: -2, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: -1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 2", zone_type: "lower_cabinet", position: { x: 0, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    // Left wall
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -3, y: 1, z: -1 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: -3, y: 1.2, z: 0.5 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
  ],
  "galley": [
    // Left side - upper cabinets
    { id: generateId(), name: "Upper Cabinet L1", zone_type: "upper_cabinet", position: { x: -1.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet L2", zone_type: "upper_cabinet", position: { x: -0.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet L3", zone_type: "upper_cabinet", position: { x: 0.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    // Left side - countertop & lower
    { id: generateId(), name: "Left Countertop", zone_type: "countertop", position: { x: -0.5, y: 0.9, z: -1.5 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet L1", zone_type: "lower_cabinet", position: { x: -1.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: -0.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet L2", zone_type: "lower_cabinet", position: { x: 0.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    // Right side
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -1.5, y: 1, z: 1.5 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Right Countertop", zone_type: "countertop", position: { x: 0.3, y: 0.9, z: 1.5 }, dimensions: { width: 2.5, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet R1", zone_type: "lower_cabinet", position: { x: -0.3, y: 0.4, z: 1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: 0.7, y: 1.2, z: 1.5 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
  ],
  "u-shaped": [
    // Back wall
    { id: generateId(), name: "Upper Cabinet B1", zone_type: "upper_cabinet", position: { x: -1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet B2", zone_type: "upper_cabinet", position: { x: 0, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet B3", zone_type: "upper_cabinet", position: { x: 1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Back Countertop", zone_type: "countertop", position: { x: 0, y: 0.9, z: -2 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet B1", zone_type: "lower_cabinet", position: { x: -1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: 0, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet B2", zone_type: "lower_cabinet", position: { x: 1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    // Left wall
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -2.2, y: 1, z: -1 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Left Countertop", zone_type: "countertop", position: { x: -2.2, y: 0.9, z: 0.5 }, dimensions: { width: 0.6, height: 0.04, depth: 2 } },
    { id: generateId(), name: "Lower Cabinet L1", zone_type: "lower_cabinet", position: { x: -2.2, y: 0.4, z: 0 }, dimensions: { width: 0.6, height: 0.8, depth: 0.8 } },
    // Right wall
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: 2.2, y: 1.2, z: -1 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
    { id: generateId(), name: "Right Countertop", zone_type: "countertop", position: { x: 2.2, y: 0.9, z: 0.5 }, dimensions: { width: 0.6, height: 0.04, depth: 2 } },
    { id: generateId(), name: "Lower Cabinet R1", zone_type: "lower_cabinet", position: { x: 2.2, y: 0.4, z: 0 }, dimensions: { width: 0.6, height: 0.8, depth: 0.8 } },
  ],
  "island": [
    // Back wall
    { id: generateId(), name: "Upper Cabinet 1", zone_type: "upper_cabinet", position: { x: -1.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 2", zone_type: "upper_cabinet", position: { x: -0.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 3", zone_type: "upper_cabinet", position: { x: 0.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 4", zone_type: "upper_cabinet", position: { x: 1.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Back Countertop", zone_type: "countertop", position: { x: 0, y: 0.9, z: -2.5 }, dimensions: { width: 4, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 1", zone_type: "lower_cabinet", position: { x: -1.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit 1", zone_type: "drawer", position: { x: -0.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 2", zone_type: "lower_cabinet", position: { x: 0.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit 2", zone_type: "drawer", position: { x: 1.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    // Left side
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -2.8, y: 1, z: -1.5 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: -2.8, y: 1.2, z: 0 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
    // Center island
    { id: generateId(), name: "Island", zone_type: "island", position: { x: 0, y: 0.5, z: 0.5 }, dimensions: { width: 2, height: 0.95, depth: 1 } },
    { id: generateId(), name: "Island Drawer 1", zone_type: "drawer", position: { x: -0.5, y: 0.3, z: 0.5 }, dimensions: { width: 0.6, height: 0.5, depth: 0.8 } },
    { id: generateId(), name: "Island Drawer 2", zone_type: "drawer", position: { x: 0.5, y: 0.3, z: 0.5 }, dimensions: { width: 0.6, height: 0.5, depth: 0.8 } },
  ],
};

export const presetLabels: Record<KitchenPreset, { name: string; description: string }> = {
  "l-shaped": { name: "L-Shaped", description: "Classic layout with two perpendicular walls" },
  "galley": { name: "Galley", description: "Two parallel counters, efficient for cooking" },
  "u-shaped": { name: "U-Shaped", description: "Three-sided layout with maximum counter space" },
  "island": { name: "Island Kitchen", description: "Open layout with a central island workspace" },
};
