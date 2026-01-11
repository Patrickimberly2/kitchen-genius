import { KitchenPresetData, PresetLabel, KitchenPresetKey, KitchenZone } from "../types/kitchen";

// Helper for generating IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Standard Dimensions
const COUNTERTOP_HEIGHT = 0.04;
const COUNTERTOP_Y = 0.87;
const LOWER_CABINET_HEIGHT = 0.87;
const LOWER_DEPTH = 0.6;
const UPPER_DEPTH = 0.35;
const SHORT_UPPER_HEIGHT = 0.45;

export const presetLabels: Record<KitchenPresetKey, PresetLabel> = {
  "custom-u-shaped": {
    name: "Custom U-Shaped",
    description: "A spacious U-shaped layout with plenty of counter space",
  },
  "l-shaped": {
    name: "L-Shaped",
    description: "Classic L-shaped corner kitchen layout",
  },
  "galley": {
    name: "Galley",
    description: "Efficient parallel counters for compact spaces",
  },
  "u-shaped": {
    name: "U-Shaped",
    description: "Wraparound design with maximum storage",
  },
  "island": {
    name: "Island",
    description: "Open layout with central island workspace",
  },
  "empty-room": {
    name: "Empty Room",
    description: "Start from scratch with an empty space",
  },
};

export const kitchenPresets: Record<KitchenPresetKey, KitchenZone[]> = {
  "custom-u-shaped": [
    {
      id: generateId(),
      name: "Main Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 10, height: 0.1, depth: 10 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
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
      name: "Upper Cabinet B1",
      zone_type: "cabinet_upper",
      position: { x: -0.2, y: 1.859, z: -3 },
      dimensions: { width: 0.75, height: 0.72, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Half Upper Above Stove",
      zone_type: "cabinet_upper",
      position: { x: 0.55, y: 2.01, z: -3 },
      dimensions: { width: 0.75, height: SHORT_UPPER_HEIGHT, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Upper Cabinet B2",
      zone_type: "cabinet_upper",
      position: { x: 1.3, y: 1.859, z: -3 },
      dimensions: { width: 0.75, height: 0.72, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Lower Cabinet 1",
      zone_type: "cabinet_lower",
      position: { x: -0.2, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
      dimensions: { width: 0.75, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Stove",
      zone_type: "appliance",
      position: { x: 0.55, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
      dimensions: { width: 0.76, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Lower Cabinet 2",
      zone_type: "cabinet_lower",
      position: { x: 1.3, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
      dimensions: { width: 0.75, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Refrigerator",
      zone_type: "refrigerator",
      position: { x: -1.7, y: 0.9, z: -3 },
      dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
    },
    {
      id: generateId(),
      name: "Left Wing Countertop",
      zone_type: "countertop",
      position: { x: -3.5, y: COUNTERTOP_Y, z: -1 },
      dimensions: { width: 0.6, height: COUNTERTOP_HEIGHT, depth: 4 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
    {
      id: generateId(),
      name: "Right Wing Countertop",
      zone_type: "countertop",
      position: { x: 4.5, y: COUNTERTOP_Y, z: -1 },
      dimensions: { width: 0.6, height: COUNTERTOP_HEIGHT, depth: 4 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
    },
  ],
  "l-shaped": [
    {
      id: generateId(),
      name: "Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 8, height: 0.1, depth: 8 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Main Countertop",
      zone_type: "countertop",
      position: { x: 0, y: COUNTERTOP_Y, z: -2.5 },
      dimensions: { width: 4, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Side Countertop",
      zone_type: "countertop",
      position: { x: -2.3, y: COUNTERTOP_Y, z: -1 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 3 },
    },
    {
      id: generateId(),
      name: "Upper Cabinet",
      zone_type: "upper_cabinet",
      position: { x: 0, y: 1.8, z: -2.5 },
      dimensions: { width: 3, height: 0.7, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Lower Cabinet",
      zone_type: "lower_cabinet",
      position: { x: 0, y: LOWER_CABINET_HEIGHT / 2, z: -2.5 },
      dimensions: { width: 2, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Refrigerator",
      zone_type: "refrigerator",
      position: { x: 2.5, y: 0.9, z: -2.5 },
      dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
    },
  ],
  "galley": [
    {
      id: generateId(),
      name: "Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 6, height: 0.1, depth: 10 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Left Countertop",
      zone_type: "countertop",
      position: { x: -1.5, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 5 },
    },
    {
      id: generateId(),
      name: "Right Countertop",
      zone_type: "countertop",
      position: { x: 1.5, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 5 },
    },
    {
      id: generateId(),
      name: "Left Upper Cabinet",
      zone_type: "upper_cabinet",
      position: { x: -1.5, y: 1.8, z: -1 },
      dimensions: { width: UPPER_DEPTH, height: 0.7, depth: 2 },
    },
    {
      id: generateId(),
      name: "Right Upper Cabinet",
      zone_type: "upper_cabinet",
      position: { x: 1.5, y: 1.8, z: -1 },
      dimensions: { width: UPPER_DEPTH, height: 0.7, depth: 2 },
    },
  ],
  "u-shaped": [
    {
      id: generateId(),
      name: "Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 8, height: 0.1, depth: 8 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Back Countertop",
      zone_type: "countertop",
      position: { x: 0, y: COUNTERTOP_Y, z: -2.5 },
      dimensions: { width: 5, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Left Countertop",
      zone_type: "countertop",
      position: { x: -2.8, y: COUNTERTOP_Y, z: -0.5 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 4 },
    },
    {
      id: generateId(),
      name: "Right Countertop",
      zone_type: "countertop",
      position: { x: 2.8, y: COUNTERTOP_Y, z: -0.5 },
      dimensions: { width: LOWER_DEPTH, height: COUNTERTOP_HEIGHT, depth: 4 },
    },
    {
      id: generateId(),
      name: "Upper Cabinet",
      zone_type: "upper_cabinet",
      position: { x: 0, y: 1.8, z: -2.5 },
      dimensions: { width: 4, height: 0.7, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Pantry",
      zone_type: "pantry",
      position: { x: -2.8, y: 1, z: 1 },
      dimensions: { width: 0.6, height: 2, depth: 0.6 },
    },
    {
      id: generateId(),
      name: "Refrigerator",
      zone_type: "refrigerator",
      position: { x: 2.8, y: 0.9, z: 1 },
      dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
    },
  ],
  "island": [
    {
      id: generateId(),
      name: "Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 10, height: 0.1, depth: 10 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    },
    {
      id: generateId(),
      name: "Back Countertop",
      zone_type: "countertop",
      position: { x: 0, y: COUNTERTOP_Y, z: -3 },
      dimensions: { width: 6, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Island",
      zone_type: "island",
      position: { x: 0, y: COUNTERTOP_Y, z: 0 },
      dimensions: { width: 2.5, height: 0.9, depth: 1.2 },
    },
    {
      id: generateId(),
      name: "Upper Cabinet",
      zone_type: "upper_cabinet",
      position: { x: -1.5, y: 1.8, z: -3 },
      dimensions: { width: 2.5, height: 0.7, depth: UPPER_DEPTH },
    },
    {
      id: generateId(),
      name: "Stove",
      zone_type: "appliance",
      position: { x: 1, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
      dimensions: { width: 0.76, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
    },
    {
      id: generateId(),
      name: "Refrigerator",
      zone_type: "refrigerator",
      position: { x: 3.5, y: 0.9, z: -3 },
      dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
    },
  ],
  "empty-room": [
    {
      id: generateId(),
      name: "Floor",
      zone_type: "floor",
      position: { x: 0, y: 0, z: 0 },
      dimensions: { width: 10, height: 0.1, depth: 10 },
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    },
  ],
};
