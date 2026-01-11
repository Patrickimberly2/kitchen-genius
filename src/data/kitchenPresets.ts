import { KitchenZone, KitchenPreset } from "@/types/kitchen";

const generateId = () => Math.random().toString(36).substring(2, 11);

// ─────────────────────────────────────────────────────────────
// Standard cabinet dimensions (meters)
// ─────────────────────────────────────────────────────────────
const CABINET_WIDTH = 0.6;
const UPPER_HEIGHT = 0.72;
const UPPER_DEPTH = 0.35;
const LOWER_HEIGHT = 0.85;
const LOWER_DEPTH = 0.6;

const COUNTERTOP_HEIGHT = 0.04;
const LOWER_Y = LOWER_HEIGHT / 2;
const COUNTERTOP_Y = LOWER_HEIGHT + COUNTERTOP_HEIGHT / 2;
const UPPER_Y = 1.5 + UPPER_HEIGHT / 2;

// ─────────────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────────────
export const kitchenPresets: Record<KitchenPreset, KitchenZone[]> = {
  "l-shaped": [
    {
      id: generateId(),
      name: "Upper Cabinet 1",
      zone_type: "upper_cabinet",
      position: { x: -2, y: UPPER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.7, depth: 0.35 },
    },
    {
      id: generateId(),
      name: "Upper Cabinet 2",
      zone_type: "upper_cabinet",
      position: { x: -1, y: UPPER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.7, depth: 0.35 },
    },
    {
      id: generateId(),
      name: "Upper Cabinet 3",
      zone_type: "upper_cabinet",
      position: { x: 0, y: UPPER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.7, depth: 0.35 },
    },
    {
      id: generateId(),
      name: "Countertop",
      zone_type: "countertop",
      position: { x: -1, y: COUNTERTOP_Y, z: -2 },
      dimensions: { width: 3, height: COUNTERTOP_HEIGHT, depth: 0.6 },
    },
    {
      id: generateId(),
      name: "Lower Cabinet 1",
      zone_type: "lower_cabinet",
      position: { x: -2, y: LOWER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.8, depth: 0.6 },
    },
    {
      id: generateId(),
      name: "Drawer Unit",
      zone_type: "drawer",
      position: { x: -1, y: LOWER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.8, depth: 0.6 },
    },
    {
      id: generateId(),
      name: "Lower Cabinet 2",
      zone_type: "lower_cabinet",
      position: { x: 0, y: LOWER_Y, z: -2 },
      dimensions: { width: 0.8, height: 0.8, depth: 0.6 },
    },
  ],

  galley: [],
  "u-shaped": [],
  island: [],
  "empty-room": [],

  /* ============================================================
   * CUSTOM U-SHAPED — DIGITAL TWIN (My Kitchen)
   * Wings with cabinets side by side, doors facing kitchen center
   * ============================================================ */
  "custom-u-shaped": [
    /* =========================================================
     * LEFT WING — 3 cabinets side by side, facing RIGHT (toward center)
     * Rotation: Math.PI / 2 makes door face +X direction
     * ========================================================= */
    {
      id: generateId(),
      name: "Left Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: -2.2, y: LOWER_Y, z: -0.6 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Drawer 1",
      zone_type: "drawer",
      position: { x: -2.2, y: LOWER_HEIGHT - 0.1, z: -0.6 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    /* 3-Drawer Stack — Front-left corner connects to front-right corner of Left Wing Base 1
     * Left Wing Base 1 (rotated 90°): front-right corner at x=-1.9, z=-0.9
     * Drawer stack positioned forward so both fronts are fully visible */
    {
      id: generateId(),
      name: "Drawer Stack 1",
      zone_type: "drawer",
      position: { x: -1.6, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },

    /* =========================================================
     * SINK WALL — Left to Right: Drawer Stack > Sink (2 cabinets) > Dishwasher > Oven
     * All facing forward (no rotation), connected side by side
     * Drawer Stack right edge at x = -1.6 + 0.3 = -1.3
     * ========================================================= */
    
    /* Sink Base Left Cabinet — connects to Drawer Stack 1 */
    {
      id: generateId(),
      name: "Sink Base Left",
      zone_type: "lower_cabinet",
      position: { x: -1.0, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Sink Base Right Cabinet */
    {
      id: generateId(),
      name: "Sink Base Right",
      zone_type: "lower_cabinet",
      position: { x: -0.4, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Double-bowl Sink — sits on top of the two sink base cabinets */
    {
      id: generateId(),
      name: "Double-Bowl Sink",
      zone_type: "sink",
      position: { x: -0.7, y: LOWER_HEIGHT + 0.05, z: -1.2 },
      dimensions: { width: 1.2, height: 0.1, depth: 0.55 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Sink Wall Countertop — spans drawer stack through Sink Wall Cabinet 3 */
    {
      id: generateId(),
      name: "Sink Wall Countertop",
      zone_type: "countertop",
      position: { x: 0.54, y: COUNTERTOP_Y, z: -1.2 },
      dimensions: { width: 4.88, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Dishwasher — connects to right side of sink cabinets */
    {
      id: generateId(),
      name: "Dishwasher",
      zone_type: "appliance",
      position: { x: 0.2, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Oven/Range — connects to right side of dishwasher */
    {
      id: generateId(),
      name: "Oven",
      zone_type: "stove",
      position: { x: 0.8, y: LOWER_Y, z: -1.2 },
      dimensions: { width: 0.76, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Sink Wall Cabinet 1 — connects to right side of oven */
    {
      id: generateId(),
      name: "Sink Wall Cabinet 1",
      zone_type: "lower_cabinet",
      position: { x: 1.48, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Sink Wall Drawer 1",
      zone_type: "drawer",
      position: { x: 1.48, y: LOWER_HEIGHT - 0.1, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Sink Wall Cabinet 2 */
    {
      id: generateId(),
      name: "Sink Wall Cabinet 2",
      zone_type: "lower_cabinet",
      position: { x: 2.08, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Sink Wall Drawer 2",
      zone_type: "drawer",
      position: { x: 2.08, y: LOWER_HEIGHT - 0.1, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Sink Wall Cabinet 3 — front-right corner at (2.98, -1.5) connects to Right Wing Base 1 */
    {
      id: generateId(),
      name: "Sink Wall Cabinet 3",
      zone_type: "lower_cabinet",
      position: { x: 2.68, y: LOWER_Y, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Sink Wall Drawer 3",
      zone_type: "drawer",
      position: { x: 2.68, y: LOWER_HEIGHT - 0.1, z: -1.2 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: -2.2, y: LOWER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Drawer 2",
      zone_type: "drawer",
      position: { x: -2.2, y: LOWER_HEIGHT - 0.1, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: -2.2, y: LOWER_Y, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Drawer 3",
      zone_type: "drawer",
      position: { x: -2.2, y: LOWER_HEIGHT - 0.1, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Countertop",
      zone_type: "countertop",
      position: { x: -2.2, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 1.8 },
    },
    /* =========================================================
     * WINDOWS — Above sink and above Sink Wall Cabinet 1 & 2
     * ========================================================= */
    {
      id: generateId(),
      name: "Sink Window",
      zone_type: "window",
      position: { x: -0.7, y: UPPER_Y, z: -1.45 },
      dimensions: { width: 1.2, height: 0.8, depth: 0.1 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Cabinet Window",
      zone_type: "window",
      position: { x: 1.78, y: UPPER_Y, z: -1.45 },
      dimensions: { width: 1.2, height: 0.8, depth: 0.1 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Upper cabinets above Sink Wall Cabinet 3 — next to Cabinet Window */
    {
      id: generateId(),
      name: "Sink Wall Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 2.53, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Sink Wall Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 2.83, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },

    /* =========================================================
     * UPPER CABINETS ABOVE DRAWER STACK 1
     * Side by side skinny cabinets aligned with Drawer Stack 1 at x: -1.6, z: -1.2
     * Each cabinet is 0.3m wide (half of standard)
     * ========================================================= */
    {
      id: generateId(),
      name: "Drawer Stack Upper 1",
      zone_type: "upper_cabinet",
      position: { x: -1.75, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Drawer Stack Upper 2",
      zone_type: "upper_cabinet",
      position: { x: -1.45, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },

    /* =========================================================
     * SKINNY UPPER CABINETS ABOVE DISHWASHER
     * Aligned with Dishwasher at x: 0.2, z: -1.2
     * Each cabinet is 0.3m wide
     * ========================================================= */
    {
      id: generateId(),
      name: "Dishwasher Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 0.05, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Dishwasher Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 0.35, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },

    /* =========================================================
     * MICROWAVE ABOVE OVEN + HALF-SIZE SKINNY CABINETS ABOVE
     * Oven at x: 0.8, z: -1.2
     * ========================================================= */
    {
      id: generateId(),
      name: "Mounted Microwave",
      zone_type: "microwave",
      position: { x: 0.8, y: 1.3, z: -1.2 },
      dimensions: { width: 0.76, height: 0.35, depth: 0.4 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    /* Half-size skinny cabinets above microwave, next to dishwasher uppers */
    {
      id: generateId(),
      name: "Oven Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 0.65, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT / 2, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Oven Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 0.95, y: UPPER_Y, z: -1.2 },
      dimensions: { width: 0.3, height: UPPER_HEIGHT / 2, depth: UPPER_DEPTH },
      rotation: { x: 0, y: 0, z: 0 },
    },

    /* =========================================================
     * LEFT WING UPPER CABINETS — 4 cabinets aligned with Left Wing Base 1-3
     * Connected side by side, facing RIGHT (toward center)
     * ========================================================= */
    {
      id: generateId(),
      name: "Left Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: -2.2, y: UPPER_Y, z: -0.6 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: -2.2, y: UPPER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: -2.2, y: UPPER_Y, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 4",
      zone_type: "upper_cabinet",
      position: { x: -2.2, y: UPPER_Y, z: 1.2 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    /* =========================================================
     * RIGHT WING — 3 cabinets side by side, facing LEFT (toward center)
     * Base 1 back-left corner connects to Sink Wall Cabinet 3 front-right corner
     * Creating a true 90° L-shape with only corners touching
     * Rotation: -Math.PI / 2 makes door face -X direction
     * ========================================================= */
    {
      id: generateId(),
      name: "Right Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: 3.28, y: 0.425, z: -0.65 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Drawer 1",
      zone_type: "drawer",
      position: { x: 3.28, y: LOWER_HEIGHT - 0.1, z: -0.65 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: 3.28, y: 0.425, z: -0.05 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Drawer 2",
      zone_type: "drawer",
      position: { x: 3.28, y: LOWER_HEIGHT - 0.1, z: -0.05 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: 3.28, y: 0.425, z: 0.55 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Drawer 3",
      zone_type: "drawer",
      position: { x: 3.28, y: LOWER_HEIGHT - 0.1, z: 0.55 },
      dimensions: { width: CABINET_WIDTH, height: 0.2, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Countertop",
      zone_type: "countertop",
      position: { x: 3.28, y: 0.87, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 1.8 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────
export const presetLabels: Record<KitchenPreset, { name: string; description: string }> = {
  "l-shaped": { name: "L-Shaped", description: "Classic layout with two perpendicular walls" },
  galley: { name: "Galley", description: "Two parallel counters" },
  "u-shaped": { name: "U-Shaped", description: "Three-sided layout" },
  island: { name: "Island Kitchen", description: "Central island workspace" },
  "custom-u-shaped": { name: "My Kitchen", description: "Digital twin of your real kitchen" },
  "empty-room": { name: "Empty Room", description: "Start with an empty kitchen space" },
};
