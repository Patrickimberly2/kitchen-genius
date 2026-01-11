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
const COUNTERTOP_Y = LOWER_HEIGHT + COUNTERTOP_HEIGHT / 2;
const LOWER_Y = LOWER_HEIGHT / 2;
const UPPER_Y = 1.5 + UPPER_HEIGHT / 2;

// ─────────────────────────────────────────────────────────────
// PRESETS
// ─────────────────────────────────────────────────────────────
export const kitchenPresets: Record<KitchenPreset, KitchenZone[]> = {
  /* ============================================================
   * BASIC PRESETS (UNCHANGED)
   * ============================================================ */
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

  /* ============================================================
   * CUSTOM U-SHAPED — DIGITAL TWIN
   * ============================================================ */
  "custom-u-shaped": [
    /* =========================================================
     * WALL 1 — SINK WALL (z = -3)
     * ========================================================= */
    {
      id: generateId(),
      name: "Left Corner Upper",
      zone_type: "upper_cabinet",
      position: { x: -3.3, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Upper A1",
      zone_type: "upper_cabinet",
      position: { x: -2.65, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Upper A2",
      zone_type: "upper_cabinet",
      position: { x: -2.0, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },

    // window gap intentionally empty

    {
      id: generateId(),
      name: "Upper C1",
      zone_type: "upper_cabinet",
      position: { x: -0.05, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Upper C2",
      zone_type: "upper_cabinet",
      position: { x: 0.6, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },

    {
      id: generateId(),
      name: "Half Upper Stove L",
      zone_type: "upper_cabinet",
      position: { x: 1.25, y: UPPER_Y + 0.15, z: -3 },
      dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Half Upper Stove R",
      zone_type: "upper_cabinet",
      position: { x: 1.7, y: UPPER_Y + 0.15, z: -3 },
      dimensions: { width: 0.45, height: 0.45, depth: UPPER_DEPTH },
    },

    {
      id: generateId(),
      name: "Upper D1",
      zone_type: "upper_cabinet",
      position: { x: 2.15, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Upper D2",
      zone_type: "upper_cabinet",
      position: { x: 2.8, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Right Corner Upper",
      zone_type: "upper_cabinet",
      position: { x: 3.4, y: UPPER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
    },

    {
      id: generateId(),
      name: "Sink Wall Countertop",
      zone_type: "countertop",
      position: { x: 0.5, y: COUNTERTOP_Y, z: -3 },
      dimensions: { width: 8.2, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
    },

    {
      id: generateId(),
      name: "Left Corner Base",
      zone_type: "lower_cabinet",
      position: { x: -3.3, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "3-Drawer Stack",
      zone_type: "drawer",
      position: { x: -2.65, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Drawer Near Sink",
      zone_type: "drawer",
      position: { x: -2.0, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Sink Base L",
      zone_type: "lower_cabinet",
      position: { x: -1.35, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Sink Base R",
      zone_type: "lower_cabinet",
      position: { x: -0.7, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Dishwasher",
      zone_type: "appliance",
      position: { x: 0.2, y: LOWER_Y, z: -3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Stove",
      zone_type: "appliance",
      position: { x: 0.85, y: LOWER_Y, z: -3 },
      dimensions: { width: 0.75, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
    },

    /* =========================================================
     * LEFT WING — FIXED STACKING
     * ========================================================= */
    {
      id: generateId(),
      name: "Left Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: -3.6, y: LOWER_Y, z: -2.65 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: -3.6, y: LOWER_Y, z: -2.0 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: -3.6, y: LOWER_Y, z: -1.35 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },

    {
      id: generateId(),
      name: "Left Wing Countertop",
      zone_type: "countertop",
      position: { x: -3.6, y: COUNTERTOP_Y, z: -2.0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 },
    },

    {
      id: generateId(),
      name: "Left Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: -3.6, y: UPPER_Y, z: -2.65 },
      dimensions: {
        width: CABINET_WIDTH, // cabinet width along run
        height: UPPER_HEIGHT,
        depth: UPPER_DEPTH, // shallow upper depth
      },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: -3.6, y: UPPER_Y, z: -2.0 },
      dimensions: {
        width: CABINET_WIDTH,
        height: UPPER_HEIGHT,
        depth: UPPER_DEPTH,
      },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: -3.6, y: UPPER_Y, z: -1.35 },
      dimensions: {
        width: CABINET_WIDTH,
        height: UPPER_HEIGHT,
        depth: UPPER_DEPTH,
      },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },

    /* =========================================================
     * RIGHT WING — FIXED STACKING
     * ========================================================= */
    {
      id: generateId(),
      name: "Right Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: 4.6, y: LOWER_Y, z: -2.65 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: 4.6, y: LOWER_Y, z: -2.0 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: 4.6, y: LOWER_Y, z: -1.35 },
      dimensions: { width: LOWER_DEPTH, height: LOWER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    {
      id: generateId(),
      name: "Right Wing Countertop",
      zone_type: "countertop",
      position: { x: 4.6, y: COUNTERTOP_Y, z: -2.0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.0 },
    },

    {
      id: generateId(),
      name: "Right Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 4.6, y: UPPER_Y, z: -2.65 },
      dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 4.6, y: UPPER_Y, z: -2.0 },
      dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: 4.6, y: UPPER_Y, z: -1.35 },
      dimensions: { width: UPPER_DEPTH, height: UPPER_HEIGHT, depth: CABINET_WIDTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    /* =========================================================
     * CENTER ISLAND
     * ========================================================= */
    {
      id: generateId(),
      name: "Center Island",
      zone_type: "island",
      position: { x: 0.5, y: 0.475, z: 0 },
      dimensions: { width: 1.4, height: 0.95, depth: 0.9 },
    },
    {
      id: generateId(),
      name: "Island Drawer L",
      zone_type: "drawer",
      position: { x: 0.0, y: 0.3, z: 0 },
      dimensions: { width: 0.5, height: 0.5, depth: 0.7 },
    },
    {
      id: generateId(),
      name: "Island Drawer R",
      zone_type: "drawer",
      position: { x: 1.0, y: 0.3, z: 0 },
      dimensions: { width: 0.5, height: 0.5, depth: 0.7 },
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
};
