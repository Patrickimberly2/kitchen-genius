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
    /* 3-Drawer Stack — Front-left corner connects to front-right corner of Left Wing Base 1
     * Left Wing Base 1 center: x=-2.2, z=-0.6, rotated 90°, so front-right corner at x=-1.9, z=-0.9
     * Drawer stack (no rotation): center offset so front-left corner meets that point */
    {
      id: generateId(),
      name: "Drawer Stack 1",
      zone_type: "drawer",
      position: { x: -1.6, y: LOWER_Y, z: -0.9 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
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
      name: "Left Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: -2.2, y: LOWER_Y, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Countertop",
      zone_type: "countertop",
      position: { x: -2.2, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 1.8 },
    },
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

    /* =========================================================
     * RIGHT WING — 3 cabinets side by side, facing LEFT (toward center)
     * Rotation: -Math.PI / 2 makes door face -X direction
     * ========================================================= */
    {
      id: generateId(),
      name: "Right Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: 2.2, y: LOWER_Y, z: -0.6 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: 2.2, y: LOWER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: 2.2, y: LOWER_Y, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Countertop",
      zone_type: "countertop",
      position: { x: 2.2, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 1.8 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 2.2, y: UPPER_Y, z: -0.6 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 2.2, y: UPPER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: 2.2, y: UPPER_Y, z: 0.6 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
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
