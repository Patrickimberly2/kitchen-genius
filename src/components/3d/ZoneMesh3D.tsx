import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
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
  const { selectedZoneId, hoveredZoneId, selectZone, hoverZone, getItemCountInZone } = useKitchen();
  const [hoverScale, setHoverScale] = useState(1);
  
  const isSelected = selectedZoneId === zone.id;
  const isHovered = hoveredZoneId === zone.id;
  const itemCount = getItemCountInZone(zone.id);
  
  const baseColor = zone.color || getZoneColor(zone.zone_type);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smooth scale transition
      const targetScale = isHovered ? 1.02 : 1;
      setHoverScale((prev) => THREE.MathUtils.lerp(prev, targetScale, delta * 8));
      meshRef.current.scale.setScalar(hoverScale);
      
      // Subtle floating animation for selected
      if (isSelected) {
        meshRef.current.position.y = zone.position.y + Math.sin(Date.now() * 0.002) * 0.02;
      } else {
        meshRef.current.position.y = zone.position.y;
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectZone(zone.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoverZone(zone.id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    hoverZone(null);
    document.body.style.cursor = "auto";
  };

  // Determine mesh appearance based on zone type
  const getMaterial = () => {
    const color = new THREE.Color(baseColor);
    
    if (isSelected) {
      color.multiplyScalar(1.15);
    } else if (isHovered) {
      color.multiplyScalar(1.08);
    }
    
    return (
      <meshStandardMaterial
        color={color}
        roughness={zone.zone_type === "countertop" ? 0.2 : 0.6}
        metalness={zone.zone_type === "refrigerator" || zone.zone_type === "freezer" ? 0.3 : 0.1}
        envMapIntensity={0.5}
      />
    );
  };

  // Add special styling for refrigerator/freezer
  const getGeometry = () => {
    const { width, height, depth } = zone.dimensions;
    
    if (zone.zone_type === "drawer") {
      // Drawer with slight front protrusion
      return <boxGeometry args={[width, height, depth]} />;
    }
    
    return <boxGeometry args={[width, height, depth]} />;
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[zone.position.x, zone.position.y, zone.position.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        {getMaterial()}
        
        {/* Selection outline */}
        {isSelected && (
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(
              zone.dimensions.width + 0.02,
              zone.dimensions.height + 0.02,
              zone.dimensions.depth + 0.02
            )]} />
            <lineBasicMaterial color="#c05621" linewidth={2} />
          </lineSegments>
        )}
      </mesh>
      
      {/* Label and item count badge */}
      {(isHovered || isSelected) && (
        <Html
          position={[
            zone.position.x,
            zone.position.y + zone.dimensions.height / 2 + 0.15,
            zone.position.z,
          ]}
          center
          distanceFactor={6}
        >
          <div className="kitchen-panel px-3 py-2 pointer-events-none whitespace-nowrap">
            <p className="text-sm font-medium text-foreground">{zone.name}</p>
            {itemCount > 0 && (
              <span className="zone-badge mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </Html>
      )}
      
      {/* Drawer handle */}
      {zone.zone_type === "drawer" && (
        <mesh
          position={[
            zone.position.x,
            zone.position.y,
            zone.position.z + zone.dimensions.depth / 2 + 0.02,
          ]}
          castShadow
        >
          <boxGeometry args={[0.15, 0.03, 0.02]} />
          <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.3} />
        </mesh>
      )}
      
      {/* Cabinet handles */}
      {(zone.zone_type === "upper_cabinet" || zone.zone_type === "lower_cabinet") && (
        <mesh
          position={[
            zone.position.x + zone.dimensions.width / 4,
            zone.position.y,
            zone.position.z + zone.dimensions.depth / 2 + 0.02,
          ]}
          castShadow
        >
          <boxGeometry args={[0.02, 0.1, 0.02]} />
          <meshStandardMaterial color="#8b7355" metalness={0.6} roughness={0.3} />
        </mesh>
      )}
      
      {/* Refrigerator handle */}
      {(zone.zone_type === "refrigerator" || zone.zone_type === "freezer") && (
        <mesh
          position={[
            zone.position.x - zone.dimensions.width / 2 + 0.05,
            zone.position.y,
            zone.position.z + zone.dimensions.depth / 2 + 0.02,
          ]}
          castShadow
        >
          <boxGeometry args={[0.02, 0.4, 0.03]} />
          <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
    </group>
  );
}
