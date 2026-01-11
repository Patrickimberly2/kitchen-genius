import { KitchenPreset, Zone } from "../types/kitchen";
import { v4 as uuidv4 } from "uuid";

// Helper for generating IDs
const generateId = () => uuidv4();

// Standard Dimensions
const COUNTERTOP_HEIGHT = 0.04;
const COUNTERTOP_Y = 0.87; // Height of the countertop surface
const LOWER_CABINET_HEIGHT = 0.87;
const LOWER_DEPTH = 0.6;
const UPPER_DEPTH = 0.35;
const UPPER_START_Y = 1.4; // Bottom of upper cabinets
const FULL_UPPER_HEIGHT = 0.9; // Standard upper height
const SHORT_UPPER_HEIGHT = 0.45; // Above stove/fridge

export const kitchenPresets: Record<string, KitchenPreset> = {
  "custom-u-shaped": {
    id: "custom-u-shaped",
    name: "My Custom Kitchen",
    zones: [
      // --- FLOOR / BASE ---
      {
        id: generateId(),
        name: "Main Floor",
        zone_type: "floor",
        position: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10, height: 0.1, depth: 10 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      },

      // --- SINK WALL (Back Wall, Z = -3) ---

      // Countertop
      {
        id: generateId(),
        name: "Sink Wall Countertop",
        zone_type: "countertop",
        position: { x: 0.5, y: COUNTERTOP_Y, z: -3 },
        dimensions: { width: 8.2, height: COUNTERTOP_HEIGHT, depth: LOWER_DEPTH },
      },

      // Upper Cabinet B1 (Moved Next to Stove)
      {
        id: generateId(),
        name: "Upper Cabinet B1",
        zone_type: "cabinet_upper",
        position: { x: -0.2, y: 1.859, z: -3 }, // UPDATED COORDINATES
        dimensions: { width: 0.75, height: 0.72, depth: UPPER_DEPTH },
        inventory: [],
      },

      // Half Upper Above Stove 1
      {
        id: generateId(),
        name: "Half Upper Above Stove 1",
        zone_type: "cabinet_upper",
        position: { x: 0.55, y: 2.01, z: -3 },
        dimensions: { width: 0.75, height: SHORT_UPPER_HEIGHT, depth: UPPER_DEPTH },
        inventory: [],
      },

      // Upper Cabinet B2 (Right of Stove)
      {
        id: generateId(),
        name: "Upper Cabinet B2",
        zone_type: "cabinet_upper",
        position: { x: 1.3, y: 1.859, z: -3 },
        dimensions: { width: 0.75, height: 0.72, depth: UPPER_DEPTH },
        inventory: [],
      },

      // Lower Cabinet (Under B1)
      {
        id: generateId(),
        name: "Lower Cabinet 1",
        zone_type: "cabinet_lower",
        position: { x: -0.2, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
        dimensions: { width: 0.75, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
        inventory: [],
      },

      // Stove (Under Half Upper)
      {
        id: generateId(),
        name: "Stove",
        zone_type: "appliance",
        position: { x: 0.55, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
        dimensions: { width: 0.76, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
        inventory: [],
      },

      // Lower Cabinet (Under B2)
      {
        id: generateId(),
        name: "Lower Cabinet 2",
        zone_type: "cabinet_lower",
        position: { x: 1.3, y: LOWER_CABINET_HEIGHT / 2, z: -3 },
        dimensions: { width: 0.75, height: LOWER_CABINET_HEIGHT, depth: LOWER_DEPTH },
        inventory: [],
      },

      // Fridge (Far Left example)
      {
        id: generateId(),
        name: "Fridge",
        zone_type: "appliance",
        position: { x: -1.7, y: 0.9, z: -3 },
        dimensions: { width: 0.9, height: 1.8, depth: 0.7 },
        inventory: [],
      },

      // --- LEFT WING (Z Axis oriented) ---
      {
        id: generateId(),
        name: "Left Wing Countertop",
        zone_type: "countertop",
        position: { x: -3.5, y: COUNTERTOP_Y, z: -1 },
        dimensions: { width: 0.6, height: COUNTERTOP_HEIGHT, depth: 4 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 }, // Rotated 90 degrees
      },

      // --- RIGHT WING (Z Axis oriented) ---
      {
        id: generateId(),
        name: "Right Wing Countertop",
        zone_type: "countertop",
        position: { x: 4.5, y: COUNTERTOP_Y, z: -1 },
        dimensions: { width: 0.6, height: COUNTERTOP_HEIGHT, depth: 4 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
      },
    ],
  },

  // Empty preset for starting fresh
  "empty-room": {
    id: "empty-room",
    name: "Empty Room",
    zones: [
      {
        id: generateId(),
        name: "Floor",
        zone_type: "floor",
        position: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10, height: 0.1, depth: 10 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      },
    ],
  },
};
