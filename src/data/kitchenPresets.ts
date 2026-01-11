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
    // Left → Right layout per user specification
    // ═══════════════════════════════════════════════════════════════════════
    
    // --- UPPER CABINETS (Sink Wall) ---
    // 1️⃣ Left corner upper (aligns with corner base)
    { id: generateId(), name: "Left Corner Upper", zone_type: "upper_cabinet", position: { x: -3.3, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "Corner upper, with inner shelf" },
    
    // 2️⃣ Upper cabinet left of 3-drawer stack
    { id: generateId(), name: "Upper Cabinet A1", zone_type: "upper_cabinet", position: { x: -2.65, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // 3️⃣ Upper cabinet above 3-drawer cabinet (left of sink)
    { id: generateId(), name: "Upper Cabinet A2", zone_type: "upper_cabinet", position: { x: -2.0, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    
    // ⚠️ NO UPPERS ABOVE SINK WINDOWS - Gap from x:-1.35 to x:0.15
    
    // 4️⃣ Upper cabinets left of stove (C1 and C2 connected to half uppers)
    { id: generateId(), name: "Upper Cabinet C1", zone_type: "upper_cabinet", position: { x: -0.05, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf - left of half uppers" },
    { id: generateId(), name: "Upper Cabinet C2", zone_type: "upper_cabinet", position: { x: 0.6, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf - connected to C1" },
    
    // 5️⃣ Above stove - 2 half-size upper cabinets (vent hood area) - connected
    { id: generateId(), name: "Half Upper Above Stove L", zone_type: "upper_cabinet", position: { x: 1.25, y: UPPER_Y + 0.15, z: -3 }, dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH }, notes: "Half size - left of hood" },
    { id: generateId(), name: "Half Upper Above Stove R", zone_type: "upper_cabinet", position: { x: 1.7, y: UPPER_Y + 0.15, z: -3 }, dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH }, notes: "Half size - right of hood - connected" },
    
    // 6️⃣ Far right uppers (before right corner)
    { id: generateId(), name: "Upper Cabinet D1", zone_type: "upper_cabinet", position: { x: 2.15, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf" },
    // D2 and Right Corner Upper connected
    { id: generateId(), name: "Upper Cabinet D2", zone_type: "upper_cabinet", position: { x: 2.8, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "With inner shelf - connected to corner" },
    { id: generateId(), name: "Right Corner Upper", zone_type: "upper_cabinet", position: { x: 3.4, y: UPPER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH }, notes: "Corner upper - connected to D2" },
    
    // --- SINK WALL COUNTERTOP (continuous) ---
    { id: generateId(), name: "Sink Wall Countertop", zone_type: "countertop", position: { x: 0.5, y: COUNTERTOP_Y, z: -3 }, dimensions: { width: 8.2, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH } },
    
    // --- APPLIANCES ON SINK WALL ---
    // Double sink (centered under windows)
    { id: generateId(), name: "Double Sink", zone_type: "appliance", position: { x: -0.75, y: COUNTERTOP_Y + 0.05, z: -3 }, dimensions: { width: 0.85, height: 0.12, depth: 0.55 }, notes: "Double bowl sink - centered under windows" },
    
    // Stove/Cooktop with oven below (centered)
    { id: generateId(), name: "Stove & Oven", zone_type: "appliance", position: { x: 0.85, y: LOWER_Y, z: -3 }, dimensions: { width: 0.75, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Range with cooktop" },
    
    // --- LOWER CABINETS (Sink Wall) - Left → Right ---
    
    // 1️⃣ Left Corner Base Cabinet (facing kitchen, not corner style)
    { id: generateId(), name: "Left Corner Base", zone_type: "lower_cabinet", position: { x: -3.3, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Base cabinet facing kitchen - no corner" },
    
    // 2️⃣ ⚠️ CRITICAL: 3-Drawer Stack Cabinet LEFT of Sink - connected to Sink Base L
    { id: generateId(), name: "3-Drawer Stack (Left of Sink)", zone_type: "drawer", position: { x: -2.65, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "3 vertical drawers - CRITICAL - connected to sink base" },
    
    // Additional drawer cabinet next to 3-drawer
    { id: generateId(), name: "Drawer Cabinet Near Sink", zone_type: "drawer", position: { x: -2.0, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "With drawers" },
    
    // 3️⃣ Sink Base Cabinet (two-door under sink) - L and R connected
    { id: generateId(), name: "Sink Base Cabinet L", zone_type: "lower_cabinet", position: { x: -1.35, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Under sink left - connected to 3-drawer" },
    { id: generateId(), name: "Sink Base Cabinet R", zone_type: "lower_cabinet", position: { x: -0.7, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Under sink right - connected to L" },
    
    // Dishwasher (right side of sink)
    { id: generateId(), name: "Dishwasher", zone_type: "appliance", position: { x: 0.2, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Dishwasher" },
    
    // 4️⃣ Base Cabinet Right of Sink (doors only, no drawers)
    // Note: Stove sits here at x: 0.85, so this base is to the right of dishwasher
    
    // 5️⃣ Stove/Range sits at base level (already defined above)
    
    // 6️⃣ Right-side base cabinets (before corner) - 3 cabinets (not drawers) - all connected
    { id: generateId(), name: "Base Cabinet R1", zone_type: "lower_cabinet", position: { x: 1.5, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Cabinet - connected to R2" },
    { id: generateId(), name: "Base Cabinet R2", zone_type: "lower_cabinet", position: { x: 2.15, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Cabinet - connected to R1 and R3" },
    { id: generateId(), name: "Base Cabinet R3", zone_type: "lower_cabinet", position: { x: 2.8, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH }, notes: "Cabinet - connected to R2" },
    
    // Additional base cabinet continuing right
    { id: generateId(), name: "Lower Cabinet R4", zone_type: "lower_cabinet", position: { x: 3.45, y: LOWER_Y, z: -3 }, dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH } },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 2: LEFT 90° WING (Dining Area #1 Separator) - Left wall at x = -3.6
    // Perpendicular to sink wall, wraps corner cleanly
    // ═══════════════════════════════════════════════════════════════════════
    
    // Corner transition upper (wraps from sink wall)
    { id: generateId(), name: "Left Wing Corner Upper", zone_type: "upper_cabinet", position: { x: -3.6, y: UPPER_Y, z: -2.65 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner wrap - with inner shelf" },
    
    // Left wing - 2 upper cabinets with inner shelf (perpendicular to sink wall)
    { id: generateId(), name: "Left Wing Upper 1", zone_type: "upper_cabinet", position: { x: -3.6, y: UPPER_Y, z: -2.0 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Left Wing Upper 2", zone_type: "upper_cabinet", position: { x: -3.6, y: UPPER_Y, z: -1.35 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    
    // Left wing countertop (perpendicular, wraps corner)
    { id: generateId(), name: "Left Wing Countertop", zone_type: "countertop", position: { x: -3.6, y: COUNTERTOP_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 } },
    
    // Left wing - corner base (facing kitchen, not corner style)
    { id: generateId(), name: "Left Wing Corner Base", zone_type: "lower_cabinet", position: { x: -3.6, y: LOWER_Y, z: -2.65 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Cabinet facing kitchen" },
    
    // Left wing - lower cabinets (not drawers)
    { id: generateId(), name: "Left Wing Cabinet 1", zone_type: "lower_cabinet", position: { x: -3.6, y: LOWER_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Cabinet facing kitchen" },
    { id: generateId(), name: "Left Wing Drawer 2", zone_type: "drawer", position: { x: -3.6, y: LOWER_Y, z: -1.35 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "With drawers" },
    
    // ═══════════════════════════════════════════════════════════════════════
    // WALL 3: RIGHT 90° WING (Dining Area #2 Separator) - Right wall at x = 4.6
    // Asymmetric from left - matches real-world layout
    // ═══════════════════════════════════════════════════════════════════════
    
    // Corner transition upper (wraps from sink wall)
    { id: generateId(), name: "Right Wing Corner Upper", zone_type: "upper_cabinet", position: { x: 4.6, y: UPPER_Y, z: -2.65 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "Corner wrap - with inner shelf" },
    
    // Right wing - 2 upper cabinets with inner shelf (perpendicular)
    { id: generateId(), name: "Right Wing Upper 1", zone_type: "upper_cabinet", position: { x: 4.6, y: UPPER_Y, z: -2.0 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    { id: generateId(), name: "Right Wing Upper 2", zone_type: "upper_cabinet", position: { x: 4.6, y: UPPER_Y, z: -1.35 }, dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH }, notes: "With inner shelf" },
    
    // Right wing countertop
    { id: generateId(), name: "Right Wing Countertop", zone_type: "countertop", position: { x: 4.6, y: COUNTERTOP_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 } },
    
    // Right wing - corner base (facing kitchen, not corner style)
    { id: generateId(), name: "Right Wing Corner Base", zone_type: "lower_cabinet", position: { x: 4.6, y: LOWER_Y, z: -2.65 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Cabinet facing kitchen" },
    
    // Right wing - lower cabinets (not drawers, facing kitchen)
    { id: generateId(), name: "Right Wing Cabinet 1", zone_type: "lower_cabinet", position: { x: 4.6, y: LOWER_Y, z: -2.0 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Cabinet facing kitchen" },
    { id: generateId(), name: "Right Wing Cabinet 2", zone_type: "lower_cabinet", position: { x: 4.6, y: LOWER_Y, z: -1.35 }, dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH }, notes: "Cabinet facing kitchen" },
    
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
