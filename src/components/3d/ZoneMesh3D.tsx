import { useRef, useState, useCallback } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { KitchenZone } from "@/types/kitchen";
import { useKitchen } from "@/context/KitchenContext";
import { getZoneColor } from "@/utils/kitchenUtils";

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
  const canOpen = ["upper_cabinet", "lower_cabinet", "drawer", "refrigerator", "freezer", "pantry", "dishwasher"].includes(zone.zone_type);
  const isDrawerType = zone.zone_type === "drawer";
  const isCabinetType = ["upper_cabinet", "lower_cabinet", "pantry"].includes(zone.zone_type);
  const isApplianceType = ["refrigerator", "freezer"].includes(zone.zone_type);
  const isSinkType = zone.zone_type === "sink";
  const isStoveType = zone.zone_type === "stove";
  const isDishwasherType = zone.zone_type === "dishwasher";
  const isWindowType = zone.zone_type === "window";
  const isMicrowaveType = zone.zone_type === "microwave";
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth scale transition for hover
      const targetScale = isHovered ? 1.015 : 1;
      setHoverScale((prev) => THREE.MathUtils.lerp(prev, targetScale, delta * 8));
      meshRef.current.scale.setScalar(hoverScale);
      
      // Subtle floating animation for selected (relative to local origin)
      if (isSelected) {
        meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.015;
      } else {
        meshRef.current.position.y = 0;
      }
    }
    
    // Animate door/drawer opening
    const targetProgress = isOpen ? 1 : 0;
    const newProgress = THREE.MathUtils.lerp(openProgress, targetProgress, delta * 6);
    if (Math.abs(newProgress - openProgress) > 0.001) {
      setOpenProgress(newProgress);
    }
    
    // Apply door rotation for cabinets
    if (doorRef.current && isCabinetType) {
      doorRef.current.rotation.y = -openProgress * Math.PI * 0.45; // 81 degree swing
    }
    
    // Apply drawer translation (relative to local origin)
    if (drawerRef.current && isDrawerType) {
      drawerRef.current.position.z = zone.dimensions.depth / 2 + openProgress * zone.dimensions.depth * 0.6;
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
  
  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (canOpen) {
      setIsOpen(!isOpen);
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
    
    // Cabinets with doors
    if (isCabinetType) {
      const doorWidth = width - 0.02;
      const doorHeight = height - 0.02;
      const doorDepth = 0.02;
      
      return (
        <group>
          {/* Cabinet body */}
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
          
          {/* Interior shelf hint (visible when open) */}
          {zone.notes?.includes("shelf") && openProgress > 0.3 && (
            <mesh
              position={[0, 0, 0]}
              castShadow
            >
              <boxGeometry args={[width - 0.04, 0.015, depth - 0.04]} />
              <meshStandardMaterial color="#c4a77d" roughness={0.7} transparent opacity={openProgress} />
            </mesh>
          )}
        </group>
      );
    }
    
    // Drawers that slide out
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
          
          {/* Drawer fronts */}
          {yOffsets.map((yOffset, idx) => (
            <mesh
              key={idx}
              ref={idx === 0 ? drawerRef : undefined}
              position={[
                0,
                yOffset,
                depth / 2 + 0.01 + (idx === 0 ? openProgress * depth * 0.6 : 0)
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
                depth / 2 + 0.035 + (idx === 0 ? openProgress * depth * 0.6 : 0)
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
