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
  
  // Custom U-Shaped Kitchen - User's actual layout
  // Sink wall with 90° wings on left and right, opposing wall with fridge/freezer
  "custom-u-shaped": [
    // ==================== SINK WALL (Back Wall) ====================
    // Left 90° Wing - Upper Cabinets (2 cabinets with inner shelf)
    { id: generateId(), name: "Left Wing Upper 1", zone_type: "upper_cabinet", position: { x: -3.5, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    { id: generateId(), name: "Left Wing Upper 2", zone_type: "upper_cabinet", position: { x: -2.7, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    
    // Left side of sink - Upper Cabinets (2 cabinets with inner shelf)
    { id: generateId(), name: "Upper Cabinet Left of Sink 1", zone_type: "upper_cabinet", position: { x: -1.8, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    { id: generateId(), name: "Upper Cabinet Left of Sink 2", zone_type: "upper_cabinet", position: { x: -1, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    
    // Above Stove - Half size upper cabinets
    { id: generateId(), name: "Half Upper Above Stove 1", zone_type: "upper_cabinet", position: { x: 0.2, y: 2.2, z: -2.8 }, dimensions: { width: 0.5, height: 0.5, depth: 0.35 }, notes: "Half size" },
    { id: generateId(), name: "Half Upper Above Stove 2", zone_type: "upper_cabinet", position: { x: 0.8, y: 2.2, z: -2.8 }, dimensions: { width: 0.5, height: 0.5, depth: 0.35 }, notes: "Half size" },
    
    // Right of stove - Upper Cabinets (2 with inner shelf)
    { id: generateId(), name: "Upper Cabinet Right of Stove 1", zone_type: "upper_cabinet", position: { x: 1.6, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    { id: generateId(), name: "Upper Cabinet Right of Stove 2", zone_type: "upper_cabinet", position: { x: 2.4, y: 2, z: -2.8 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    
    // Sink Wall - Countertop
    { id: generateId(), name: "Sink Wall Countertop", zone_type: "countertop", position: { x: -0.5, y: 0.9, z: -2.8 }, dimensions: { width: 5.5, height: 0.04, depth: 0.6 } },
    
    // Sink area (appliance type for the double sink)
    { id: generateId(), name: "Double Sink", zone_type: "appliance", position: { x: -0.3, y: 0.95, z: -2.8 }, dimensions: { width: 0.9, height: 0.15, depth: 0.55 } },
    
    // Stove/Cooktop
    { id: generateId(), name: "Stove & Oven", zone_type: "appliance", position: { x: 0.9, y: 0.9, z: -2.8 }, dimensions: { width: 0.75, height: 0.9, depth: 0.6 } },
    
    // Left wing - Lower cabinets (3 with drawers)
    { id: generateId(), name: "Left Wing Drawer Cabinet 1", zone_type: "drawer", position: { x: -3.5, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Left Wing Drawer Cabinet 2", zone_type: "drawer", position: { x: -2.7, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Left Wing Drawer Cabinet 3", zone_type: "drawer", position: { x: -1.9, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    
    // Under sink - Lower cabinets (2)
    { id: generateId(), name: "Lower Cabinet Under Sink 1", zone_type: "lower_cabinet", position: { x: -0.8, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet Under Sink 2", zone_type: "lower_cabinet", position: { x: 0, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 } },
    
    // Right of stove - Lower cabinets (2)
    { id: generateId(), name: "Lower Cabinet Right 1", zone_type: "lower_cabinet", position: { x: 1.6, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet Right 2", zone_type: "lower_cabinet", position: { x: 2.4, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 } },
    
    // Right wing - Lower cabinets (3 with drawers)
    { id: generateId(), name: "Right Wing Drawer Cabinet 1", zone_type: "drawer", position: { x: 3.2, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Right Wing Drawer Cabinet 2", zone_type: "drawer", position: { x: 4, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Right Wing Drawer Cabinet 3", zone_type: "drawer", position: { x: 4.8, y: 0.4, z: -2.8 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    
    // ==================== LEFT 90° WING (Dining #1 separator) ====================
    // Left wing extends perpendicular - Upper cabinets (2 with inner shelf)
    { id: generateId(), name: "Left Wing Side Upper 1", zone_type: "upper_cabinet", position: { x: -3.8, y: 2, z: -2 }, dimensions: { width: 0.35, height: 0.7, depth: 0.7 }, notes: "With inner shelf" },
    { id: generateId(), name: "Left Wing Side Upper 2", zone_type: "upper_cabinet", position: { x: -3.8, y: 2, z: -1.2 }, dimensions: { width: 0.35, height: 0.7, depth: 0.7 }, notes: "With inner shelf" },
    
    // Left wing side - Countertop
    { id: generateId(), name: "Left Wing Side Countertop", zone_type: "countertop", position: { x: -3.8, y: 0.9, z: -1.6 }, dimensions: { width: 0.6, height: 0.04, depth: 1.8 } },
    
    // Left wing side - Lower cabinets with drawers
    { id: generateId(), name: "Left Wing Side Drawer 1", zone_type: "drawer", position: { x: -3.8, y: 0.4, z: -2 }, dimensions: { width: 0.6, height: 0.8, depth: 0.7 }, notes: "With drawers" },
    { id: generateId(), name: "Left Wing Side Drawer 2", zone_type: "drawer", position: { x: -3.8, y: 0.4, z: -1.2 }, dimensions: { width: 0.6, height: 0.8, depth: 0.7 }, notes: "With drawers" },
    
    // ==================== RIGHT 90° WING (Dining #2 separator) ====================
    // Right wing extends perpendicular - Upper cabinets (2 with inner shelf)  
    { id: generateId(), name: "Right Wing Side Upper 1", zone_type: "upper_cabinet", position: { x: 5.2, y: 2, z: -2 }, dimensions: { width: 0.35, height: 0.7, depth: 0.7 }, notes: "With inner shelf" },
    { id: generateId(), name: "Right Wing Side Upper 2", zone_type: "upper_cabinet", position: { x: 5.2, y: 2, z: -1.2 }, dimensions: { width: 0.35, height: 0.7, depth: 0.7 }, notes: "With inner shelf" },
    
    // Right wing side - Countertop
    { id: generateId(), name: "Right Wing Side Countertop", zone_type: "countertop", position: { x: 5.2, y: 0.9, z: -1.6 }, dimensions: { width: 0.6, height: 0.04, depth: 1.8 } },
    
    // Right wing side - Lower cabinets with drawers
    { id: generateId(), name: "Right Wing Side Drawer 1", zone_type: "drawer", position: { x: 5.2, y: 0.4, z: -2 }, dimensions: { width: 0.6, height: 0.8, depth: 0.7 }, notes: "With drawers" },
    { id: generateId(), name: "Right Wing Side Drawer 2", zone_type: "drawer", position: { x: 5.2, y: 0.4, z: -1.2 }, dimensions: { width: 0.6, height: 0.8, depth: 0.7 }, notes: "With drawers" },
    
    // ==================== OPPOSITE WALL (Fridge/Freezer Wall) ====================
    // Half size upper cabinets (above fridge area)
    { id: generateId(), name: "Half Upper Above Fridge 1", zone_type: "upper_cabinet", position: { x: 2.2, y: 2.3, z: 2.5 }, dimensions: { width: 0.5, height: 0.4, depth: 0.35 }, notes: "Half size" },
    { id: generateId(), name: "Half Upper Above Fridge 2", zone_type: "upper_cabinet", position: { x: 2.8, y: 2.3, z: 2.5 }, dimensions: { width: 0.5, height: 0.4, depth: 0.35 }, notes: "Half size" },
    
    // Upper cabinets on fridge wall (3 with inner shelf)
    { id: generateId(), name: "Fridge Wall Upper 1", zone_type: "upper_cabinet", position: { x: 3.5, y: 2, z: 2.5 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    { id: generateId(), name: "Fridge Wall Upper 2", zone_type: "upper_cabinet", position: { x: 4.3, y: 2, z: 2.5 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    { id: generateId(), name: "Fridge Wall Upper 3", zone_type: "upper_cabinet", position: { x: 5.1, y: 2, z: 2.5 }, dimensions: { width: 0.7, height: 0.7, depth: 0.35 }, notes: "With inner shelf" },
    
    // French Doors Fridge (with 3 bins each door, deli drawer, freeze drawer)
    { id: generateId(), name: "French Door Fridge - Upper Section", zone_type: "refrigerator", position: { x: 2, y: 1.4, z: 2.5 }, dimensions: { width: 0.9, height: 1.2, depth: 0.75 }, notes: "French doors with 3 bins in each door" },
    { id: generateId(), name: "Fridge Deli Drawer", zone_type: "drawer", position: { x: 2, y: 0.6, z: 2.5 }, dimensions: { width: 0.85, height: 0.3, depth: 0.7 }, notes: "Deli drawer" },
    { id: generateId(), name: "Fridge Freeze Drawer", zone_type: "freezer", position: { x: 2, y: 0.2, z: 2.5 }, dimensions: { width: 0.85, height: 0.35, depth: 0.7 }, notes: "Freeze drawer with inner drawer" },
    
    // Fridge wall - Countertop
    { id: generateId(), name: "Fridge Wall Countertop", zone_type: "countertop", position: { x: 4.3, y: 0.9, z: 2.5 }, dimensions: { width: 2.5, height: 0.04, depth: 0.6 } },
    
    // Fridge wall - Lower cabinets (3 with drawers)
    { id: generateId(), name: "Fridge Wall Drawer Cabinet 1", zone_type: "drawer", position: { x: 3.5, y: 0.4, z: 2.5 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Fridge Wall Drawer Cabinet 2", zone_type: "drawer", position: { x: 4.3, y: 0.4, z: 2.5 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    { id: generateId(), name: "Fridge Wall Drawer Cabinet 3", zone_type: "drawer", position: { x: 5.1, y: 0.4, z: 2.5 }, dimensions: { width: 0.7, height: 0.8, depth: 0.6 }, notes: "With drawers" },
    
    // Upright Freezer (4 shelves, 6 bins in door)
    { id: generateId(), name: "Upright Freezer", zone_type: "freezer", position: { x: -2, y: 1, z: 2.5 }, dimensions: { width: 0.75, height: 2, depth: 0.7 }, notes: "4 shelves, 6 bins in door" },
    
    // Pantry (8 shelves)
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: -1, y: 1.2, z: 2.5 }, dimensions: { width: 0.7, height: 2.4, depth: 0.6 }, notes: "8 shelves" },
  ],
};

export const presetLabels: Record<KitchenPreset, { name: string; description: string }> = {
  "l-shaped": { name: "L-Shaped", description: "Classic layout with two perpendicular walls" },
  "galley": { name: "Galley", description: "Two parallel counters, efficient for cooking" },
  "u-shaped": { name: "U-Shaped", description: "Three-sided layout with maximum counter space" },
  "island": { name: "Island Kitchen", description: "Open layout with a central island workspace" },
  "custom-u-shaped": { name: "My Kitchen", description: "U-shaped with 90° wings, fridge wall opposite sink" },
};
