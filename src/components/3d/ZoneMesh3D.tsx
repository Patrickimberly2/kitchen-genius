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
  const canOpen = ["upper_cabinet", "lower_cabinet", "drawer", "refrigerator", "freezer", "pantry"].includes(zone.zone_type);
  const isDrawerType = zone.zone_type === "drawer";
  const isCabinetType = ["upper_cabinet", "lower_cabinet", "pantry"].includes(zone.zone_type);
  const isApplianceType = ["refrigerator", "freezer"].includes(zone.zone_type);
  
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
    
    // Appliances (sink, stove)
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
      const drawerFrontHeight = height / 3;
      
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
          
          {/* Drawer fronts (3 drawer stack) */}
          {[0.28, 0, -0.28].map((yOffset, idx) => (
            <mesh
              key={idx}
              ref={idx === 1 ? drawerRef : undefined}
              position={[
                0,
                yOffset,
                depth / 2 + 0.01 + (idx === 1 ? openProgress * depth * 0.6 : 0)
              ]}
              castShadow
            >
              <boxGeometry args={[width - 0.02, drawerFrontHeight - 0.02, 0.025]} />
              {getMaterial()}
            </mesh>
          ))}
          
          {/* Drawer handles */}
          {[0.28, 0, -0.28].map((yOffset, idx) => (
            <mesh
              key={`handle-${idx}`}
              position={[
                0,
                yOffset,
                depth / 2 + 0.035 + (idx === 1 ? openProgress * depth * 0.6 : 0)
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
          
          {/* Handle(s) */}
          {isFrenchDoor ? (
            <>
              {/* Left door handle */}
              <mesh position={[-0.02, 0, depth / 2 + 0.02]}>
                <boxGeometry args={[0.02, 0.35, 0.03]} />
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Right door handle */}
              <mesh position={[0.02, 0, depth / 2 + 0.02]}>
                <boxGeometry args={[0.02, 0.35, 0.03]} />
                <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
              </mesh>
            </>
          ) : (
            <mesh position={[-width / 2 + 0.06, 0, depth / 2 + 0.02]}>
              <boxGeometry args={[0.02, 0.35, 0.03]} />
              <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
          
          {/* Door seam lines */}
          {isFrenchDoor && (
            <mesh position={[0, 0, depth / 2 + 0.001]}>
              <boxGeometry args={[0.005, height - 0.02, 0.001]} />
              <meshBasicMaterial color="#333333" />
            </mesh>
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
