import { KitchenZone, KitchenPreset } from "@/types/kitchen";

const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard cabinet dimensions (in meters)
const CABINET_WIDTH = 0.6; // 60cm standard cabinet
const UPPER_HEIGHT = 0.72;
const UPPER_DEPTH = 0.35;
const LOWER_HEIGHT = 0.85;
const LOWER_DEPTH = 0.6;
const COUNTERTOP_HEIGHT = 0.04;
const COUNTERTOP_Y = 0.87; // Lower cabinet height + countertop
const UPPER_Y = 1.5 + UPPER_HEIGHT / 2; // 150cm from floor to bottom of upper
const LOWER_Y = LOWER_HEIGHT / 2;

export const kitchenPresets: Record<KitchenPreset, KitchenZone[]> = {
  "l-shaped": [
    { id: generateId(), name: "Upper Cabinet 1", zone_type: "upper_cabinet", position: { x: -2, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 2", zone_type: "upper_cabinet", position: { x: -1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 3", zone_type: "upper_cabinet", position: { x: 0, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Countertop", zone_type: "countertop", position: { x: -1, y: 0.9, z: -2 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 1", zone_type: "lower_cabinet", position: { x: -2, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: -1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 2", zone_type: "lower_cabinet", position: { x: 0, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -3, y: 1, z: -1 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: -3, y: 1.2, z: 0.5 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
  ],
  
  "galley": [
    { id: generateId(), name: "Upper Cabinet L1", zone_type: "upper_cabinet", position: { x: -1.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet L2", zone_type: "upper_cabinet", position: { x: -0.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet L3", zone_type: "upper_cabinet", position: { x: 0.5, y: 2, z: -1.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Left Countertop", zone_type: "countertop", position: { x: -0.5, y: 0.9, z: -1.5 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet L1", zone_type: "lower_cabinet", position: { x: -1.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: -0.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet L2", zone_type: "lower_cabinet", position: { x: 0.5, y: 0.4, z: -1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -1.5, y: 1, z: 1.5 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Right Countertop", zone_type: "countertop", position: { x: 0.3, y: 0.9, z: 1.5 }, dimensions: { width: 2.5, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet R1", zone_type: "lower_cabinet", position: { x: -0.3, y: 0.4, z: 1.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: 0.7, y: 1.2, z: 1.5 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
  ],
  
  "u-shaped": [
    { id: generateId(), name: "Upper Cabinet B1", zone_type: "upper_cabinet", position: { x: -1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet B2", zone_type: "upper_cabinet", position: { x: 0, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet B3", zone_type: "upper_cabinet", position: { x: 1, y: 2, z: -2 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Back Countertop", zone_type: "countertop", position: { x: 0, y: 0.9, z: -2 }, dimensions: { width: 3, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet B1", zone_type: "lower_cabinet", position: { x: -1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit", zone_type: "drawer", position: { x: 0, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet B2", zone_type: "lower_cabinet", position: { x: 1, y: 0.4, z: -2 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -2.2, y: 1, z: -1 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Left Countertop", zone_type: "countertop", position: { x: -2.2, y: 0.9, z: 0.5 }, dimensions: { width: 0.6, height: 0.04, depth: 2 } },
    { id: generateId(), name: "Lower Cabinet L1", zone_type: "lower_cabinet", position: { x: -2.2, y: 0.4, z: 0 }, dimensions: { width: 0.6, height: 0.8, depth: 0.8 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: 2.2, y: 1.2, z: -1 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
    { id: generateId(), name: "Right Countertop", zone_type: "countertop", position: { x: 2.2, y: 0.9, z: 0.5 }, dimensions: { width: 0.6, height: 0.04, depth: 2 } },
    { id: generateId(), name: "Lower Cabinet R1", zone_type: "lower_cabinet", position: { x: 2.2, y: 0.4, z: 0 }, dimensions: { width: 0.6, height: 0.8, depth: 0.8 } },
  ],
  
  "island": [
    { id: generateId(), name: "Upper Cabinet 1", zone_type: "upper_cabinet", position: { x: -1.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 2", zone_type: "upper_cabinet", position: { x: -0.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 3", zone_type: "upper_cabinet", position: { x: 0.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Upper Cabinet 4", zone_type: "upper_cabinet", position: { x: 1.5, y: 2, z: -2.5 }, dimensions: { width: 0.8, height: 0.7, depth: 0.35 } },
    { id: generateId(), name: "Back Countertop", zone_type: "countertop", position: { x: 0, y: 0.9, z: -2.5 }, dimensions: { width: 4, height: 0.04, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 1", zone_type: "lower_cabinet", position: { x: -1.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit 1", zone_type: "drawer", position: { x: -0.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Lower Cabinet 2", zone_type: "lower_cabinet", position: { x: 0.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Drawer Unit 2", zone_type: "drawer", position: { x: 1.5, y: 0.4, z: -2.5 }, dimensions: { width: 0.8, height: 0.8, depth: 0.6 } },
    { id: generateId(), name: "Refrigerator", zone_type: "refrigerator", position: { x: -2.8, y: 1, z: -1.5 }, dimensions: { width: 0.9, height: 2, depth: 0.7 } },
    { id: generateId(), name: "Pantry", zone_type: "pantry", position: { x: -2.8, y: 1.2, z: 0 }, dimensions: { width: 0.8, height: 2.4, depth: 0.6 } },
    { id: generateId(), name: "Island", zone_type: "island", position: { x: 0, y: 0.5, z: 0.5 }, dimensions: { width: 2, height: 0.95, depth: 1 } },
    { id: generateId(), name: "Island Drawer 1", zone_type: "drawer", position: { x: -0.5, y: 0.3, z: 0.5 }, dimensions: { width: 0.6, height: 0.5, depth: 0.8 } },
    { id: generateId(), name: "Island Drawer 2", zone_type: "drawer", position: { x: 0.5, y: 0.3, z: 0.5 }, dimensions: { width: 0.6, height: 0.5, depth: 0.8 } },
  ],
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CUSTOM U-SHAPED KITCHEN - Digital Twin of User's Real Kitchen
  // ═══════════════════════════════════════════════════════════════════════════
  // Layout: U-shape with sink wall, left 90° wing (dining #1), right 90° wing,
  // and opposing parallel wall with fridge/freezer/pantry. Center island.
  // ═══════════════════════════════════════════════════════════════════════════
  
  "custom-u-shaped": [
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 1: SINK WALL (Primary Work Wall) - Back wall at z = -3
    // ═══════════════════════════════════════════════════════════════════════
    
    // --- UPPER CABINETS (Sink Wall) ---
    // Far left (part of left wing transition) - 2 upper cabinets with inner shelf
    { id: generateId(), name: "Upper Cabinet A1", zone_type: "upper_cabinet", position: { x: -3.0, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Upper Cabinet A2", zone_type: "upper_cabinet", position: { x: -2.35, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // Left of sink - 2 upper cabinets with inner shelf
    { id: generateId(), name: "Upper Cabinet B1", zone_type: "upper_cabinet", position: { x: -1.7, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Upper Cabinet B2", zone_type: "upper_cabinet", position: { x: -1.05, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // Above stove - 2 half-size upper cabinets (microwave/vent hood area)
    { id: generateId(), name: "Half Upper Above Stove 1", zone_type: "upper_cabinet", position: { x: 0.55, y: UPPER_Y + 0.15, z: -3 }, dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH }, notes: "Half size - above range" },
    { id: generateId(), name: "Half Upper Above Stove 2", zone_type: "upper_cabinet", position: { x: 1.05, y: UPPER_Y + 0.15, z: -3 }, dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH }, notes: "Half size - above range" },
    
    // Right of stove - 2 upper cabinets with inner shelf
    { id: generateId(), name: "Upper Cabinet C1", zone_type: "upper_cabinet", position: { x: 1.7, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Upper Cabinet C2", zone_type: "upper_cabinet", position: { x: 2.35, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // --- SINK WALL COUNTERTOP ---
    { id: generateId(), name: "Sink Wall Countertop", zone_type: "countertop", position: { x: -0.3, y: COUNTERTOP_Y, z: -3 }, dimensions: { width: 6.0, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH } },
    
    // --- APPLIANCES ON SINK WALL ---
    // Double sink (centered between cabinets)
    { id: generateId(), name: "Double Sink", zone_type: "appliance", position: { x: -0.4, y: COUNTERTOP_Y + 0.05, z: -3 }, dimensions: { width: 0.85, height: 0.12, depth: 0.55 }, notes: "Double bowl sink" },
    
    // Stove/Cooktop with oven below
    { id: generateId(), name: "Stove & Oven", zone_type: "appliance", position: { x: 0.8, y: LOWER_Y, z: -3 }, dimensions: { width: 0.75, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Range with cooktop" },
    
    // --- LOWER CABINETS (Sink Wall) ---
    // Left section - 3 lower cabinets with drawers
    { id: generateId(), name: "Drawer Cabinet L1", zone_type: "drawer", position: { x: -3.0, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    { id: generateId(), name: "Drawer Cabinet L2", zone_type: "drawer", position: { x: -2.35, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    { id: generateId(), name: "Drawer Cabinet L3", zone_type: "drawer", position: { x: -1.7, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    
    // Under sink - 2 lower cabinets
    { id: generateId(), name: "Sink Base Cabinet 1", zone_type: "lower_cabinet", position: { x: -0.8, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Under sink left" },
    { id: generateId(), name: "Sink Base Cabinet 2", zone_type: "lower_cabinet", position: { x: -0.15, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Under sink right" },
    
    // Right of stove - 2 lower cabinets
    { id: generateId(), name: "Lower Cabinet R1", zone_type: "lower_cabinet", position: { x: 1.5, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH } },
    { id: generateId(), name: "Lower Cabinet R2", zone_type: "lower_cabinet", position: { x: 2.15, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH } },
    
    // Far right - 3 lower cabinets with drawers
    { id: generateId(), name: "Drawer Cabinet R1", zone_type: "drawer", position: { x: 2.8, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    { id: generateId(), name: "Drawer Cabinet R2", zone_type: "drawer", position: { x: 3.45, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    { id: generateId(), name: "Drawer Cabinet R3", zone_type: "drawer", position: { x: 4.1, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 drawers" },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 2: LEFT 90° WING (Dining Area #1 Separator) - Left wall at x = -3.5
    // ═══════════════════════════════════════════════════════════════════════
    
    // Corner transition cabinet (blind corner)
    { id: generateId(), name: "Left Corner Upper", zone_type: "upper_cabinet", position: { x: -3.5, y: UPPER_Y, z: -2.65 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner cabinet with inner shelf" },
    
    // Left wing - 2 upper cabinets with inner shelf (perpendicular to sink wall)
    { id: generateId(), name: "Left Wing Upper 1", zone_type: "upper_cabinet", position: { x: -3.5, y: UPPER_Y, z: -2.0 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Left Wing Upper 2", zone_type: "upper_cabinet", position: { x: -3.5, y: UPPER_Y, z: -1.35 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    
    // Left wing countertop (perpendicular)
    { id: generateId(), name: "Left Wing Countertop", zone_type: "countertop", position: { x: -3.5, y: COUNTERTOP_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 } },
    
    // Left wing - 3 lower cabinets with drawers
    { id: generateId(), name: "Left Wing Drawer 1", zone_type: "drawer", position: { x: -3.5, y: LOWER_Y, z: -2.65 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner base with drawers" },
    { id: generateId(), name: "Left Wing Drawer 2", zone_type: "drawer", position: { x: -3.5, y: LOWER_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "With drawers" },
    { id: generateId(), name: "Left Wing Drawer 3", zone_type: "drawer", position: { x: -3.5, y: LOWER_Y, z: -1.35 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "With drawers" },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 3: RIGHT 90° WING (Dining Area #2 Separator) - Right wall at x = 4.5
    // ═══════════════════════════════════════════════════════════════════════
    
    // Corner transition cabinet (blind corner)
    { id: generateId(), name: "Right Corner Upper", zone_type: "upper_cabinet", position: { x: 4.5, y: UPPER_Y, z: -2.65 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner cabinet with inner shelf" },
    
    // Right wing - 2 upper cabinets with inner shelf (perpendicular)
    { id: generateId(), name: "Right Wing Upper 1", zone_type: "upper_cabinet", position: { x: 4.5, y: UPPER_Y, z: -2.0 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Right Wing Upper 2", zone_type: "upper_cabinet", position: { x: 4.5, y: UPPER_Y, z: -1.35 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    
    // Right wing countertop
    { id: generateId(), name: "Right Wing Countertop", zone_type: "countertop", position: { x: 4.5, y: COUNTERTOP_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 } },
    
    // Right wing - 3 lower cabinets with drawers
    { id: generateId(), name: "Right Wing Drawer 1", zone_type: "drawer", position: { x: 4.5, y: LOWER_Y, z: -2.65 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner base with drawers" },
    { id: generateId(), name: "Right Wing Drawer 2", zone_type: "drawer", position: { x: 4.5, y: LOWER_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "With drawers" },
    { id: generateId(), name: "Right Wing Drawer 3", zone_type: "drawer", position: { x: 4.5, y: LOWER_Y, z: -1.35 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "With drawers" },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 4: PARALLEL APPLIANCE WALL (Opposite Sink Wall) - Front wall at z = 3
    // ═══════════════════════════════════════════════════════════════════════
    
    // --- TALL APPLIANCES (Left Section) ---
    // Upright Freezer (4 shelves, 6 door bins)
    { id: generateId(), name: "Upright Freezer", zone_type: "freezer", position: { x: -2.5, y: 1.0, z: 3 }, dimensions: { width: 0.7, height: 2.0, depth: 0.7 }, color: "#1a1a1a", notes: "4 internal shelves, 6 door bins" },
    
    // Pantry with 8 shelves
    { id: generateId(), name: "Pantry Cabinet", zone_type: "pantry", position: { x: -1.6, y: 1.2, z: 3 }, dimensions: { width: 0.7, height: 2.4, depth: 0.6 }, notes: "8 shelves" },
    
    // --- FRENCH DOOR REFRIGERATOR (Center-Right) ---
    // Upper section (French doors with 3 bins each)
    { id: generateId(), name: "Fridge - Upper Section", zone_type: "refrigerator", position: { x: 0.5, y: 1.35, z: 3 }, dimensions: { width: 0.9, height: 1.1, depth: 0.75 }, color: "#1a1a1a", notes: "French doors, 3 bins in each door" },
    
    // Deli drawer
    { id: generateId(), name: "Fridge - Deli Drawer", zone_type: "drawer", position: { x: 0.5, y: 0.6, z: 3 }, dimensions: { width: 0.85, height: 0.25, depth: 0.7 }, color: "#2a2a2a", notes: "Deli/produce drawer" },
    
    // Freeze drawer with inner drawer
    { id: generateId(), name: "Fridge - Freezer Drawer", zone_type: "freezer", position: { x: 0.5, y: 0.2, z: 3 }, dimensions: { width: 0.85, height: 0.35, depth: 0.7 }, color: "#1a1a1a", notes: "Freezer drawer with inner drawer" },
    
    // --- CABINETS ON FRIDGE WALL ---
    // Half-size upper cabinets (above fridge area)
    { id: generateId(), name: "Half Upper Above Fridge 1", zone_type: "upper_cabinet", position: { x: 1.6, y: UPPER_Y + 0.3, z: 3 }, dimensions: { width: 0.5, height: 0.4, depth: UPPER_DEPTH }, notes: "Half size" },
    { id: generateId(), name: "Half Upper Above Fridge 2", zone_type: "upper_cabinet", position: { x: 2.15, y: UPPER_Y + 0.3, z: 3 }, dimensions: { width: 0.5, height: 0.4, depth: UPPER_DEPTH }, notes: "Half size" },
    
    // 3 upper cabinets with inner shelf
    { id: generateId(), name: "Fridge Wall Upper 1", zone_type: "upper_cabinet", position: { x: 2.8, y: UPPER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Fridge Wall Upper 2", zone_type: "upper_cabinet", position: { x: 3.45, y: UPPER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Fridge Wall Upper 3", zone_type: "upper_cabinet", position: { x: 4.1, y: UPPER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // Fridge wall countertop
    { id: generateId(), name: "Fridge Wall Countertop", zone_type: "countertop", position: { x: 3.45, y: COUNTERTOP_Y, z: 3 }, dimensions: { width: 2.5, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH } },
    
    // 3 lower cabinets with drawers
    { id: generateId(), name: "Fridge Wall Drawer 1", zone_type: "drawer", position: { x: 2.8, y: LOWER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "With drawers" },
    { id: generateId(), name: "Fridge Wall Drawer 2", zone_type: "drawer", position: { x: 3.45, y: LOWER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "With drawers" },
    { id: generateId(), name: "Fridge Wall Drawer 3", zone_type: "drawer", position: { x: 4.1, y: LOWER_Y, z: 3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "With drawers" },
    
    // ═══════════════════════════════════════════════════════════════════════
    // CENTER ISLAND
    // ═══════════════════════════════════════════════════════════════════════
    { id: generateId(), name: "Center Island", zone_type: "island", position: { x: 0.5, y: 0.475, z: 0 }, dimensions: { width: 1.4, height: 0.95, depth: 0.9 }, notes: "Central island workspace" },
    { id: generateId(), name: "Island Drawer Left", zone_type: "drawer", position: { x: 0.0, y: 0.3, z: 0 }, dimensions: { width: 0.5, height: 0.5, depth: 0.7 } },
    { id: generateId(), name: "Island Drawer Right", zone_type: "drawer", position: { x: 1.0, y: 0.3, z: 0 }, dimensions: { width: 0.5, height: 0.5, depth: 0.7 } },
  ],
};

export const presetLabels: Record<KitchenPreset, { name: string; description: string }> = {
  "l-shaped": { name: "L-Shaped", description: "Classic layout with two perpendicular walls" },
  "galley": { name: "Galley", description: "Two parallel counters, efficient for cooking" },
  "u-shaped": { name: "U-Shaped", description: "Three-sided layout with maximum counter space" },
  "island": { name: "Island Kitchen", description: "Open layout with a central island workspace" },
  "custom-u-shaped": { name: "My Kitchen", description: "U-shaped with 90° wings, appliance wall, center island" },
};
