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
   * CUSTOM U-SHAPED — DIGITAL TWIN (FRESH START)
   * Wings extend into kitchen center (positive Z direction)
   * ============================================================ */
  "custom-u-shaped": [
    /* =========================================================
     * LEFT WING — Facing right (+X direction)
     * Extends from back wall into kitchen center
     * ========================================================= */
    {
      id: generateId(),
      name: "Left Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: -2.5, y: LOWER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: -2.5, y: LOWER_Y, z: 0.65 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: -2.5, y: LOWER_Y, z: 1.3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Countertop",
      zone_type: "countertop",
      position: { x: -2.5, y: COUNTERTOP_Y, z: 0.65 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.1 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: -2.5, y: UPPER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: -2.5, y: UPPER_Y, z: 0.65 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: -2.5, y: UPPER_Y, z: 1.3 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },

    /* =========================================================
     * RIGHT WING — Facing left (-X direction)
     * Extends from back wall into kitchen center
     * ========================================================= */
    {
      id: generateId(),
      name: "Right Wing Base 1",
      zone_type: "lower_cabinet",
      position: { x: 2.5, y: LOWER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 2",
      zone_type: "lower_cabinet",
      position: { x: 2.5, y: LOWER_Y, z: 0.65 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Base 3",
      zone_type: "lower_cabinet",
      position: { x: 2.5, y: LOWER_Y, z: 1.3 },
      dimensions: { width: CABINET_WIDTH, height: LOWER_HEIGHT, depth: LOWER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Countertop",
      zone_type: "countertop",
      position: { x: 2.5, y: COUNTERTOP_Y, z: 0.65 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 2.1 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 1",
      zone_type: "upper_cabinet",
      position: { x: 2.5, y: UPPER_Y, z: 0 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 2",
      zone_type: "upper_cabinet",
      position: { x: 2.5, y: UPPER_Y, z: 0.65 },
      dimensions: { width: CABINET_WIDTH, height: UPPER_HEIGHT, depth: UPPER_DEPTH },
      rotation: { x: 0, y: -Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Upper 3",
      zone_type: "upper_cabinet",
      position: { x: 2.5, y: UPPER_Y, z: 1.3 },
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
