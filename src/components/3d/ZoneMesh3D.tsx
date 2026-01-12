import { useRef, useState, useCallback, useMemo } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { KitchenZone } from "@/types/kitchen";
import { useKitchen } from "@/context/KitchenContext";
import { getZoneColor } from "@/utils/kitchenUtils";
import { ZoneItems3D } from "./ZoneItems3D";
import { useInteriorCallback } from "./KitchenScene3D";

interface ZoneMesh3DProps {
  zone: KitchenZone;
}

export function ZoneMesh3D({ zone }: ZoneMesh3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);
  const drawerRef = useRef<THREE.Mesh>(null);
  
  const { selectedZoneId, hoveredZoneId, selectZone, hoverZone, getItemCountInZone, updateZone } = useKitchen();
  const [hoverScale, setHoverScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<THREE.Vector3 | null>(null);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  
  const { camera, raycaster, gl } = useThree();
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  
  const isSelected = selectedZoneId === zone.id;
  const isHovered = hoveredZoneId === zone.id;
  const itemCount = getItemCountInZone(zone.id);
  
  const baseColor = zone.color || getZoneColor(zone.zone_type);
  
  // Determine if this zone can be opened
  const canOpen = ["upper_cabinet", "lower_cabinet", "drawer", "refrigerator", "freezer", "pantry", "dishwasher", "upright_freezer", "fridge_door", "fridge_drawer"].includes(zone.zone_type);
  const isDrawerType = zone.zone_type === "drawer";
  const isPantryType = zone.zone_type === "pantry";
  const isPantryShelfType = zone.zone_type === "pantry_shelf";
  const isFreezerShelfType = zone.zone_type === "freezer_shelf";
  const isFridgeDoorType = zone.zone_type === "fridge_door";
  const isFridgeDrawerType = zone.zone_type === "fridge_drawer";
  const isCabinetType = ["upper_cabinet", "lower_cabinet"].includes(zone.zone_type);
  const isApplianceType = ["refrigerator", "freezer"].includes(zone.zone_type);
  const isUprightFreezerType = zone.zone_type === "upright_freezer";
  const isSinkType = zone.zone_type === "sink";
  const isStoveType = zone.zone_type === "stove";
  const isDishwasherType = zone.zone_type === "dishwasher";
  const isWindowType = zone.zone_type === "window";
  const isMicrowaveType = zone.zone_type === "microwave";
  
  // Calculate number of shelves based on height
  const shelfCount = useMemo(() => {
    if (!isCabinetType) return 0;
    const h = zone.dimensions.height;
    if (h < 0.3) return 0;
    if (h < 0.5) return 1;
    if (h < 0.8) return 2;
    return 3;
  }, [isCabinetType, zone.dimensions.height]);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth scale transition for hover - more subtle
      const targetScale = isHovered ? 1.01 : 1;
      setHoverScale((prev) => THREE.MathUtils.lerp(prev, targetScale, delta * 10));
      meshRef.current.scale.setScalar(hoverScale);
      
      // Subtle floating animation for selected (relative to local origin)
      if (isSelected) {
        meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.01;
      } else {
        meshRef.current.position.y = 0;
      }
    }
    
    // Animate door/drawer opening with easing
    const targetProgress = isOpen ? 1 : 0;
    // Use smoother easing - slower at start and end
    const easeFactor = isOpen ? 8 : 6;
    const newProgress = THREE.MathUtils.lerp(openProgress, targetProgress, delta * easeFactor);
    if (Math.abs(newProgress - openProgress) > 0.0001) {
      setOpenProgress(newProgress);
    }
    
    // Apply door rotation for cabinets - opens past 90° slightly
    if (doorRef.current && isCabinetType) {
      doorRef.current.rotation.y = -openProgress * Math.PI * 0.52; // 93.6 degree swing
    }
    
    // Apply drawer translation (relative to local origin)
    if (drawerRef.current && isDrawerType) {
      drawerRef.current.position.z = zone.dimensions.depth / 2 + openProgress * zone.dimensions.depth * 0.65;
    }
  });

  // Snap to 0.25m grid
  const snapToGrid = useCallback((value: number) => Math.round(value * 4) / 4, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isSelected) return;
    e.stopPropagation();
    
    // Start dragging
    setIsDragging(true);
    setOriginalPosition({ ...zone.position });
    
    // Get the intersection point on the horizontal plane at the zone's Y position
    planeRef.current.constant = -zone.position.y;
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeRef.current, intersect);
    setDragStart(intersect);
    
    document.body.style.cursor = "grabbing";
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !dragStart || !originalPosition) return;
    e.stopPropagation();
    
    // Get current intersection point
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeRef.current, intersect);
    
    // Calculate delta
    const deltaX = intersect.x - dragStart.x;
    const deltaZ = intersect.z - dragStart.z;
    
    // Update zone position (snapped to grid)
    const newX = snapToGrid(originalPosition.x + deltaX);
    const newZ = snapToGrid(originalPosition.z + deltaZ);
    
    updateZone(zone.id, {
      position: { x: newX, y: zone.position.y, z: newZ },
    });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    setIsDragging(false);
    setDragStart(null);
    setOriginalPosition(null);
    document.body.style.cursor = "auto";
    gl.domElement.releasePointerCapture(e.pointerId);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isDragging) {
      selectZone(zone.id);
    }
  };
  
  // Get the interior callback from context
  const onOpenInterior = useInteriorCallback();
  
  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (canOpen) {
      setIsOpen(!isOpen);
      // Also open the interior modal if available
      if (onOpenInterior && !isOpen) {
        onOpenInterior(zone);
      }
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoverZone(zone.id);
    document.body.style.cursor = isSelected ? "grab" : "pointer";
  };

  const handlePointerOut = () => {
    if (!isDragging) {
      hoverZone(null);
      document.body.style.cursor = "auto";
    }
  };

  // Material based on zone type and state
  const getMaterial = (colorOverride?: string) => {
    const color = new THREE.Color(colorOverride || baseColor);
    
    if (isSelected) {
      color.multiplyScalar(1.12);
    } else if (isHovered) {
      color.multiplyScalar(1.06);
    }
    
    // Different materials for different zone types
    if (zone.zone_type === "countertop") {
      return (
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.05}
          envMapIntensity={0.7}
        />
      );
    }
    
    if (isApplianceType) {
      return (
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.5}
          envMapIntensity={0.8}
        />
      );
    }
    
    return (
      <meshStandardMaterial
        color={color}
        roughness={0.55}
        metalness={0.08}
        envMapIntensity={0.4}
      />
    );
  };

  // Determine handle color
  const handleColor = isApplianceType ? "#888888" : "#8b7355";
  const handleMetalness = isApplianceType ? 0.8 : 0.5;
  
  const { width, height, depth } = zone.dimensions;

  // Render different geometry based on zone type
  const renderZone = () => {
    // Common event handlers for all mesh types
    const commonProps = {
      onClick: handleClick,
      onDoubleClick: handleDoubleClick,
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    };

    // Countertops are simple slabs (no rotation needed for position)
    if (zone.zone_type === "countertop") {
      return (
        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          {...commonProps}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, height, depth]} />
          {getMaterial()}
        </mesh>
      );
    }
    
    // Islands are solid blocks with countertop
    if (zone.zone_type === "island") {
      return (
        <group>
          {/* Island base */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height - 0.04, depth]} />
            {getMaterial()}
          </mesh>
          {/* Island countertop */}
          <mesh
            position={[0, height / 2 - 0.02, 0]}
            castShadow
          >
            <boxGeometry args={[width + 0.05, 0.04, depth + 0.05]} />
            <meshStandardMaterial color="#e8ddd0" roughness={0.15} metalness={0.05} />
          </mesh>
        </group>
      );
    }
    
    // Sink - double bowl with faucet
    if (isSinkType) {
      return (
        <group>
          {/* Sink counter surface */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.6} />
          </mesh>
          
          {/* Left basin */}
          <mesh position={[-width / 4, height / 2 - 0.03, 0]}>
            <boxGeometry args={[width / 2.5, 0.06, depth * 0.7]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.1} metalness={0.7} />
          </mesh>
          {/* Right basin */}
          <mesh position={[width / 4, height / 2 - 0.03, 0]}>
            <boxGeometry args={[width / 2.5, 0.06, depth * 0.7]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.1} metalness={0.7} />
          </mesh>
          {/* Faucet base */}
          <mesh position={[0, height / 2 + 0.02, -depth / 3]}>
            <cylinderGeometry args={[0.02, 0.03, 0.04, 16]} />
            <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Faucet neck */}
          <mesh position={[0, height / 2 + 0.1, -depth / 3 + 0.05]} rotation={[Math.PI / 6, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
            <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      );
    }
    
    // Stove/Oven with burners
    if (isStoveType) {
      return (
        <group>
          {/* Stove body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} />
          </mesh>
          
          {/* Cooktop surface */}
          <mesh position={[0, height / 2 + 0.005, 0]}>
            <boxGeometry args={[width - 0.02, 0.01, depth - 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.3} />
          </mesh>
          
          {/* 4 burners */}
          {[[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]].map(([dx, dz], i) => (
            <group key={i} position={[dx, height / 2 + 0.02, dz]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.08, 0.015, 24]} />
                <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.2} />
              </mesh>
              {/* Grate */}
              <mesh position={[0, 0.015, 0]}>
                <cylinderGeometry args={[0.065, 0.065, 0.01, 6]} />
                <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.4} />
              </mesh>
            </group>
          ))}
          
          {/* Control panel */}
          <mesh position={[0, height / 2 + 0.005, -depth / 2 + 0.05]}>
            <boxGeometry args={[width - 0.1, 0.02, 0.08]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.2} />
          </mesh>
          
          {/* Oven door */}
          <mesh position={[0, -height / 4, depth / 2 + 0.01]}>
            <boxGeometry args={[width - 0.04, height / 2 - 0.04, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
          </mesh>
          {/* Oven handle */}
          <mesh position={[0, 0.05, depth / 2 + 0.03]}>
            <boxGeometry args={[width * 0.6, 0.02, 0.02]} />
            <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      );
    }
    
    // Dishwasher
    if (isDishwasherType) {
      return (
        <group>
          {/* Dishwasher body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.25} metalness={0.3} />
          </mesh>
          
          {/* Front panel */}
          <mesh position={[0, 0, depth / 2 + 0.005]}>
            <boxGeometry args={[width - 0.02, height - 0.02, 0.01]} />
            <meshStandardMaterial color="#e5e5e5" roughness={0.3} metalness={0.2} />
          </mesh>
          
          {/* Control panel at top */}
          <mesh position={[0, height / 2 - 0.05, depth / 2 + 0.015]}>
            <boxGeometry args={[width - 0.06, 0.06, 0.01]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.3} />
          </mesh>
          
          {/* Handle */}
          <mesh position={[0, height / 4, depth / 2 + 0.025]}>
            <boxGeometry args={[width * 0.7, 0.025, 0.02]} />
            <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
          </mesh>
          
          {/* Door seam line */}
          <mesh position={[0, -height / 6, depth / 2 + 0.012]}>
            <boxGeometry args={[width - 0.04, 0.003, 0.001]} />
            <meshBasicMaterial color="#999999" />
          </mesh>
        </group>
      );
    }
    
    // Window
    if (isWindowType) {
      return (
        <group>
          {/* Window frame */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.4} metalness={0.1} />
          </mesh>
          
          {/* Glass pane */}
          <mesh position={[0, 0, depth / 2 - 0.02]}>
            <boxGeometry args={[width - 0.08, height - 0.08, 0.02]} />
            <meshStandardMaterial 
              color="#87ceeb" 
              transparent 
              opacity={0.4} 
              roughness={0.1} 
              metalness={0.2} 
            />
          </mesh>
          
          {/* Window cross bars */}
          <mesh position={[0, 0, depth / 2 + 0.01]}>
            <boxGeometry args={[0.03, height - 0.04, 0.02]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, depth / 2 + 0.01]}>
            <boxGeometry args={[width - 0.04, 0.03, 0.02]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.4} metalness={0.1} />
          </mesh>
          
          {/* Light glow behind window */}
          <mesh position={[0, 0, -depth / 2 - 0.01]}>
            <boxGeometry args={[width - 0.1, height - 0.1, 0.01]} />
            <meshBasicMaterial color="#ffffd0" transparent opacity={0.6} />
          </mesh>
        </group>
      );
    }
    
    // Mounted Microwave
    if (isMicrowaveType) {
      return (
        <group>
          {/* Microwave body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.4} />
          </mesh>
          
          {/* Door with window */}
          <mesh position={[-width / 6, 0, depth / 2 + 0.005]}>
            <boxGeometry args={[width * 0.6, height - 0.04, 0.01]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
          </mesh>
          
          {/* Door window */}
          <mesh position={[-width / 6, 0, depth / 2 + 0.015]}>
            <boxGeometry args={[width * 0.5, height - 0.1, 0.005]} />
            <meshStandardMaterial 
              color="#333333" 
              transparent 
              opacity={0.7} 
              roughness={0.1} 
              metalness={0.5} 
            />
          </mesh>
          
          {/* Control panel */}
          <mesh position={[width / 3, 0, depth / 2 + 0.01]}>
            <boxGeometry args={[width * 0.25, height - 0.04, 0.01]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.2} />
          </mesh>
          
          {/* Control buttons */}
          {[0.08, 0.02, -0.04, -0.1].map((yOffset, i) => (
            <mesh key={i} position={[width / 3, yOffset, depth / 2 + 0.02]}>
              <boxGeometry args={[0.04, 0.03, 0.005]} />
              <meshStandardMaterial color="#555555" roughness={0.3} metalness={0.3} />
            </mesh>
          ))}
          
          {/* Handle */}
          <mesh position={[width / 8, 0, depth / 2 + 0.025]}>
            <boxGeometry args={[0.02, height * 0.5, 0.02]} />
            <meshStandardMaterial color="#888888" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      );
    }
    
    // Fridge Door (French door style - hinged)
    if (isFridgeDoorType) {
      const doorDepth = 0.03;
      const isLeftDoor = zone.name.includes("Left");
      
      return (
        <group>
          {/* Door panel */}
          <group
            ref={doorRef}
            position={[
              isLeftDoor ? width / 2 - 0.01 : -width / 2 + 0.01,
              0,
              depth / 2
            ]}
          >
            <mesh
              ref={meshRef}
              position={[isLeftDoor ? -width / 2 + 0.01 : width / 2 - 0.01, 0, doorDepth / 2]}
              {...commonProps}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[width - 0.02, height - 0.02, doorDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
            </mesh>
            
            {/* Vertical handle */}
            <mesh position={[isLeftDoor ? 0.03 : -0.03, 0, doorDepth + 0.02]}>
              <boxGeometry args={[0.025, height * 0.5, 0.035]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
            </mesh>
          </group>
        </group>
      );
    }
    
    // Fridge Drawer (pull-out drawer style)
    if (isFridgeDrawerType) {
      const drawerFrontDepth = 0.03;
      
      return (
        <group>
          {/* Drawer body */}
          <mesh
            position={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
          </mesh>
          
          {/* Drawer front */}
          <mesh
            ref={meshRef}
            position={[0, 0, depth / 2 + drawerFrontDepth / 2 + openProgress * depth * 0.5]}
            {...commonProps}
            castShadow
          >
            <boxGeometry args={[width - 0.02, height - 0.02, drawerFrontDepth]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
          </mesh>
          
          {/* Horizontal handle */}
          <mesh position={[0, height * 0.1, depth / 2 + drawerFrontDepth + 0.02 + openProgress * depth * 0.5]}>
            <boxGeometry args={[width * 0.6, 0.025, 0.025]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      );
    }
    
    // Pantry Shelf - with items always visible
    if (isPantryShelfType) {
      return (
        <group>
          {/* Shelf box */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#e8ddd0" roughness={0.6} metalness={0.05} />
          </mesh>
          
          {/* Shelf divider line at top */}
          <mesh position={[0, height / 2 - 0.01, depth / 2 + 0.001]}>
            <boxGeometry args={[width - 0.02, 0.015, 0.002]} />
            <meshStandardMaterial color="#d0c4b0" roughness={0.7} metalness={0.05} />
          </mesh>
          
          {/* Items on shelf */}
          <ZoneItems3D zone={zone} isOpen={true} openProgress={1} />
        </group>
      );
    }
    
    // Freezer Shelf - with items always visible
    if (isFreezerShelfType) {
      return (
        <group>
          {/* Shelf box */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.4} />
          </mesh>
          
          {/* Shelf divider line at top */}
          <mesh position={[0, height / 2 - 0.01, depth / 2 + 0.001]}>
            <boxGeometry args={[width - 0.02, 0.015, 0.002]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.3} />
          </mesh>
          
          {/* Frost effect on interior */}
          <mesh position={[0, 0, -depth / 4]}>
            <boxGeometry args={[width - 0.04, height - 0.04, 0.01]} />
            <meshStandardMaterial color="#e8f0f8" roughness={0.8} metalness={0.1} transparent opacity={0.3} />
          </mesh>
          
          {/* Items on shelf */}
          <ZoneItems3D zone={zone} isOpen={true} openProgress={1} />
        </group>
      );
    }
    
    // Generic appliance (legacy support)
    if (zone.zone_type === "appliance") {
      const isSink = zone.name.toLowerCase().includes("sink");
      const isStove = zone.name.toLowerCase().includes("stove") || zone.name.toLowerCase().includes("oven");
      
      return (
        <group>
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={isStove ? "#f5f5f5" : "#e0e0e0"}
              roughness={isStove ? 0.3 : 0.2}
              metalness={isStove ? 0.1 : 0.4}
            />
          </mesh>
          
          {/* Sink basins */}
          {isSink && (
            <>
              <mesh position={[-0.15, 0.02, 0]}>
                <boxGeometry args={[0.32, 0.08, 0.38]} />
                <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.7} />
              </mesh>
              <mesh position={[0.2, 0.02, 0]}>
                <boxGeometry args={[0.32, 0.08, 0.38]} />
                <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.7} />
              </mesh>
            </>
          )}
          
          {/* Stove burners */}
          {isStove && (
            <>
              {[[-0.18, -0.12], [0.18, -0.12], [-0.18, 0.12], [0.18, 0.12]].map(([dx, dz], i) => (
                <mesh key={i} position={[dx, height / 2 + 0.01, dz]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.2} />
                </mesh>
              ))}
            </>
          )}
        </group>
      );
    }
    
    // Pantry with door and 8 interior shelves + items
    if (isPantryType) {
      const doorWidth = width - 0.02;
      const doorHeight = height - 0.02;
      const doorDepth = 0.02;
      
      // 8 shelves evenly distributed
      const pantryShelfCount = 8;
      const shelfSpacing = (height - 0.1) / (pantryShelfCount + 1);
      const shelfYPositions = Array.from({ length: pantryShelfCount }, (_, i) => 
        -height / 2 + 0.05 + shelfSpacing * (i + 1)
      );
      
      return (
        <group>
          {/* Pantry body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            {getMaterial("#f5efe6")}
          </mesh>
          
          {/* Interior back panel (visible when open) */}
          {openProgress > 0.1 && (
            <mesh position={[0, 0, -depth / 2 + 0.01]}>
              <boxGeometry args={[width - 0.04, height - 0.04, 0.01]} />
              <meshStandardMaterial 
                color="#2a2420" 
                roughness={0.8} 
                transparent 
                opacity={Math.min(openProgress * 2, 1)} 
              />
            </mesh>
          )}
          
          {/* Interior shelves (visible when door opens) */}
          {openProgress > 0.15 && shelfYPositions.map((yPos, idx) => (
            <mesh 
              key={`shelf-${idx}`} 
              position={[0, yPos, -depth / 6]}
            >
              <boxGeometry args={[width - 0.06, 0.02, depth - 0.15]} />
              <meshStandardMaterial 
                color="#3d3530" 
                roughness={0.7} 
                transparent 
                opacity={Math.min(openProgress * 1.5, 1)} 
              />
            </mesh>
          ))}
          
          {/* Items inside pantry */}
          <ZoneItems3D zone={zone} isOpen={isOpen} openProgress={openProgress} />
          
          {/* Pantry door (hinged on left side) */}
          <group
            ref={doorRef}
            position={[
              -width / 2 + 0.01,
              0,
              depth / 2
            ]}
          >
            <mesh
              position={[doorWidth / 2, 0, doorDepth / 2]}
              castShadow
            >
              <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
              {getMaterial("#e8ddd0")}
            </mesh>
            
            {/* Door handle */}
            <mesh position={[doorWidth - 0.06, 0, doorDepth + 0.015]}>
              <boxGeometry args={[0.02, 0.12, 0.025]} />
              <meshStandardMaterial color={handleColor} metalness={handleMetalness} roughness={0.3} />
            </mesh>
          </group>
        </group>
      );
    }
    
    // Upright Freezer with single hinged door + items
    if (isUprightFreezerType) {
      const doorWidth = width - 0.02;
      const doorHeight = height - 0.02;
      const doorDepth = 0.025;
      
      // 4 shelves for freezer
      const freezerShelfCount = 4;
      const shelfSpacing = (height - 0.1) / (freezerShelfCount + 1);
      const shelfYPositions = Array.from({ length: freezerShelfCount }, (_, i) => 
        -height / 2 + 0.05 + shelfSpacing * (i + 1)
      );
      
      return (
        <group>
          {/* Freezer body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.4} />
          </mesh>
          
          {/* Interior (visible when open) */}
          {openProgress > 0.1 && (
            <mesh position={[0, 0, -depth / 2 + 0.01]}>
              <boxGeometry args={[width - 0.04, height - 0.04, 0.01]} />
              <meshStandardMaterial 
                color="#2a2a2a" 
                roughness={0.6} 
                transparent 
                opacity={Math.min(openProgress * 2, 1)} 
              />
            </mesh>
          )}
          
          {/* Interior shelves (visible when door opens) */}
          {openProgress > 0.15 && shelfYPositions.map((yPos, idx) => (
            <mesh 
              key={`freezer-shelf-${idx}`} 
              position={[0, yPos, -depth / 6]}
            >
              <boxGeometry args={[width - 0.06, 0.015, depth - 0.12]} />
              <meshStandardMaterial 
                color="#3a3a3a" 
                roughness={0.5} 
                metalness={0.3}
                transparent 
                opacity={Math.min(openProgress * 1.5, 1)} 
              />
            </mesh>
          ))}
          
          {/* Items inside freezer */}
          <ZoneItems3D zone={zone} isOpen={isOpen} openProgress={openProgress} />
          
          {/* Single door (hinged on left side) */}
          <group
            ref={doorRef}
            position={[
              -width / 2 + 0.01,
              0,
              depth / 2
            ]}
          >
            <mesh
              position={[doorWidth / 2, 0, doorDepth / 2]}
              castShadow
            >
              <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
            </mesh>
            
            {/* Door handle - vertical bar on left side */}
            <mesh position={[0.06, 0, doorDepth + 0.02]}>
              <boxGeometry args={[0.025, height * 0.4, 0.035]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
            </mesh>
            
            {/* Small logo/badge near top */}
            <mesh position={[doorWidth / 2, height * 0.35, doorDepth + 0.005]}>
              <boxGeometry args={[0.08, 0.04, 0.005]} />
              <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        </group>
      );
    }
    
    // Cabinets with doors, interior shelves, and items
    if (isCabinetType) {
      const doorWidth = width - 0.02;
      const doorHeight = height - 0.02;
      const doorDepth = 0.02;
      
      // Calculate shelf positions
      const shelfPositions: number[] = [];
      if (shelfCount > 0) {
        const shelfSpacing = (height - 0.06) / (shelfCount + 1);
        for (let i = 1; i <= shelfCount; i++) {
          shelfPositions.push(-height / 2 + 0.03 + shelfSpacing * i);
        }
      }
      
      return (
        <group>
          {/* Cabinet body - the frame */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            {getMaterial()}
          </mesh>
          
          {/* Dark interior back panel (visible when door opens) */}
          {openProgress > 0.05 && (
            <mesh position={[0, 0, -depth / 2 + 0.01]}>
              <boxGeometry args={[width - 0.03, height - 0.03, 0.01]} />
              <meshStandardMaterial 
                color="#2a2420" 
                roughness={0.85} 
                transparent 
                opacity={Math.min(openProgress * 1.5, 0.95)} 
              />
            </mesh>
          )}
          
          {/* Interior side walls (visible when open) */}
          {openProgress > 0.1 && (
            <>
              <mesh position={[-width / 2 + 0.015, 0, 0]}>
                <boxGeometry args={[0.015, height - 0.03, depth - 0.04]} />
                <meshStandardMaterial 
                  color="#3d3530" 
                  roughness={0.8} 
                  transparent 
                  opacity={Math.min(openProgress * 1.5, 0.9)} 
                />
              </mesh>
              <mesh position={[width / 2 - 0.015, 0, 0]}>
                <boxGeometry args={[0.015, height - 0.03, depth - 0.04]} />
                <meshStandardMaterial 
                  color="#3d3530" 
                  roughness={0.8} 
                  transparent 
                  opacity={Math.min(openProgress * 1.5, 0.9)} 
                />
              </mesh>
            </>
          )}
          
          {/* Interior shelves (visible when door opens) */}
          {openProgress > 0.15 && shelfPositions.map((yPos, idx) => (
            <mesh 
              key={`shelf-${idx}`} 
              position={[0, yPos, -depth * 0.1]}
            >
              <boxGeometry args={[width - 0.04, 0.015, depth - 0.08]} />
              <meshStandardMaterial 
                color="#4d4540" 
                roughness={0.7} 
                transparent 
                opacity={Math.min(openProgress * 1.3, 0.95)} 
              />
            </mesh>
          ))}
          
          {/* Items inside cabinet */}
          <ZoneItems3D zone={zone} isOpen={isOpen} openProgress={openProgress} />
          
          {/* Cabinet door (hinged on left side) */}
          <group
            ref={doorRef}
            position={[
              -width / 2 + 0.01,
              0,
              depth / 2
            ]}
          >
            <mesh
              position={[doorWidth / 2, 0, doorDepth / 2]}
              castShadow
            >
              <boxGeometry args={[doorWidth, doorHeight, doorDepth]} />
              {getMaterial()}
            </mesh>
            
            {/* Door handle */}
            <mesh position={[doorWidth - 0.06, 0, doorDepth + 0.015]}>
              <boxGeometry args={[0.02, 0.1, 0.025]} />
              <meshStandardMaterial color={handleColor} metalness={handleMetalness} roughness={0.3} />
            </mesh>
          </group>
        </group>
      );
    }
    
    // Drawers that slide out with interior and items
    if (isDrawerType) {
      // Single drawer for short heights (<=0.3m), 3-drawer stack for taller units
      const isSingleDrawer = height <= 0.3;
      const drawerCount = isSingleDrawer ? 1 : 3;
      const drawerFrontHeight = isSingleDrawer ? height - 0.02 : height / 3;
      
      // Calculate y offsets based on drawer count
      const yOffsets = isSingleDrawer ? [0] : [0.28, 0, -0.28];
      
      return (
        <group>
          {/* Drawer body/cavity */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            {getMaterial()}
          </mesh>
          
          {/* Dark interior (visible when open) */}
          {openProgress > 0.1 && (
            <mesh position={[0, 0, depth * 0.3 + openProgress * depth * 0.3]}>
              <boxGeometry args={[width - 0.04, height - 0.04, depth * 0.9]} />
              <meshStandardMaterial 
                color="#2a2420" 
                roughness={0.85} 
                side={THREE.BackSide}
                transparent 
                opacity={Math.min(openProgress * 1.5, 0.9)} 
              />
            </mesh>
          )}
          
          {/* Items inside drawer */}
          <group position={[0, 0, openProgress * depth * 0.6]}>
            <ZoneItems3D zone={zone} isOpen={isOpen} openProgress={openProgress} />
          </group>
          
          {/* Drawer fronts */}
          {yOffsets.map((yOffset, idx) => (
            <mesh
              key={idx}
              ref={idx === 0 ? drawerRef : undefined}
              position={[
                0,
                yOffset,
                depth / 2 + 0.01 + (idx === 0 ? openProgress * depth * 0.65 : 0)
              ]}
              castShadow
            >
              <boxGeometry args={[width - 0.02, drawerFrontHeight - 0.02, 0.025]} />
              {getMaterial()}
            </mesh>
          ))}
          
          {/* Drawer handles */}
          {yOffsets.map((yOffset, idx) => (
            <mesh
              key={`handle-${idx}`}
              position={[
                0,
                yOffset,
                depth / 2 + 0.04 + (idx === 0 ? openProgress * depth * 0.65 : 0)
              ]}
              castShadow
            >
              <boxGeometry args={[0.12, 0.025, 0.02]} />
              <meshStandardMaterial color={handleColor} metalness={handleMetalness} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );
    }
    
    // Refrigerator/Freezer with French doors or single door
    if (isApplianceType) {
      const isFrenchDoor = zone.notes?.includes("French");
      
      // French door fridge proportions (based on reference image)
      // Top section: ~55% height for double doors
      // Middle section: ~15% height for narrow deli drawer
      // Bottom section: ~30% height for deep freezer drawer
      const topDoorsHeight = height * 0.55;
      const deliDrawerHeight = height * 0.15;
      const freezerDrawerHeight = height * 0.30;
      
      // Y positions (from center)
      const topDoorsY = height / 2 - topDoorsHeight / 2;
      const deliDrawerY = height / 2 - topDoorsHeight - deliDrawerHeight / 2;
      const freezerDrawerY = -height / 2 + freezerDrawerHeight / 2;
      
      return (
        <group>
          {/* Appliance body */}
          <mesh
            ref={meshRef}
            position={[0, 0, 0]}
            {...commonProps}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, height, depth]} />
            {getMaterial()}
          </mesh>
          
          {isFrenchDoor ? (
            <>
              {/* === TOP SECTION: French Doors === */}
              {/* Left door panel */}
              <mesh position={[-width / 4, topDoorsY, depth / 2 + 0.005]}>
                <boxGeometry args={[width / 2 - 0.015, topDoorsHeight - 0.02, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
              </mesh>
              {/* Right door panel */}
              <mesh position={[width / 4, topDoorsY, depth / 2 + 0.005]}>
                <boxGeometry args={[width / 2 - 0.015, topDoorsHeight - 0.02, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
              </mesh>
              
              {/* Left door vertical handle */}
              <mesh position={[-0.03, topDoorsY, depth / 2 + 0.03]}>
                <boxGeometry args={[0.025, topDoorsHeight * 0.6, 0.035]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
              </mesh>
              {/* Right door vertical handle */}
              <mesh position={[0.03, topDoorsY, depth / 2 + 0.03]}>
                <boxGeometry args={[0.025, topDoorsHeight * 0.6, 0.035]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
              </mesh>
              
              {/* Center seam for French doors */}
              <mesh position={[0, topDoorsY, depth / 2 + 0.012]}>
                <boxGeometry args={[0.008, topDoorsHeight - 0.02, 0.002]} />
                <meshBasicMaterial color="#222222" />
              </mesh>
              
              {/* === MIDDLE SECTION: Deli Drawer === */}
              {/* Deli drawer panel */}
              <mesh position={[0, deliDrawerY, depth / 2 + 0.005]}>
                <boxGeometry args={[width - 0.02, deliDrawerHeight - 0.015, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
              </mesh>
              
              {/* Deli drawer horizontal handle */}
              <mesh position={[0, deliDrawerY, depth / 2 + 0.025]}>
                <boxGeometry args={[width * 0.6, 0.025, 0.025]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
              </mesh>
              
              {/* Horizontal seam above deli drawer */}
              <mesh position={[0, deliDrawerY + deliDrawerHeight / 2, depth / 2 + 0.012]}>
                <boxGeometry args={[width - 0.01, 0.006, 0.002]} />
                <meshBasicMaterial color="#222222" />
              </mesh>
              
              {/* === BOTTOM SECTION: Freezer Drawer === */}
              {/* Freezer drawer panel */}
              <mesh position={[0, freezerDrawerY, depth / 2 + 0.005]}>
                <boxGeometry args={[width - 0.02, freezerDrawerHeight - 0.015, 0.01]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.15} metalness={0.4} />
              </mesh>
              
              {/* Freezer drawer horizontal handle */}
              <mesh position={[0, freezerDrawerY + freezerDrawerHeight * 0.2, depth / 2 + 0.025]}>
                <boxGeometry args={[width * 0.6, 0.028, 0.025]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.15} />
              </mesh>
              
              {/* Horizontal seam above freezer drawer */}
              <mesh position={[0, freezerDrawerY + freezerDrawerHeight / 2, depth / 2 + 0.012]}>
                <boxGeometry args={[width - 0.01, 0.006, 0.002]} />
                <meshBasicMaterial color="#222222" />
              </mesh>
            </>
          ) : (
            /* Single door refrigerator/freezer */
            <>
              <mesh position={[-width / 2 + 0.06, 0, depth / 2 + 0.02]}>
                <boxGeometry args={[0.02, 0.35, 0.03]} />
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
              </mesh>
            </>
          )}
        </group>
      );
    }
    
    // Default box for any other type
    return (
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        {...commonProps}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        {getMaterial()}
      </mesh>
    );
  };

  // Apply rotation if specified
  const rotation = zone.rotation || { x: 0, y: 0, z: 0 };
  
  // Position the group at zone location, apply rotation around zone center
  return (
    <group 
      ref={groupRef} 
      position={[zone.position.x, zone.position.y, zone.position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      {renderZone()}
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(
            width + 0.03,
            height + 0.03,
            depth + 0.03
          )]} />
          <lineBasicMaterial color="#c05621" linewidth={2} />
        </lineSegments>
      )}
      
      {/* Label and item count badge */}
      {(isHovered || isSelected) && (
        <Html
          position={[0, height / 2 + 0.2, 0]}
          center
          distanceFactor={8}
        >
          <div className="kitchen-panel px-3 py-2 pointer-events-none whitespace-nowrap max-w-[200px]">
            <p className="text-sm font-medium text-foreground truncate">{zone.name}</p>
            {zone.notes && (
              <p className="text-xs text-muted-foreground truncate">{zone.notes}</p>
            )}
            {itemCount > 0 && (
              <span className="zone-badge mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            )}
            {canOpen && (
              <p className="text-xs text-muted-foreground/60 mt-1 italic">Double-click to {isOpen ? "close" : "open"}</p>
            )}
            {isSelected && (
              <p className="text-xs text-primary/80 mt-1 font-medium">Drag to move</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
