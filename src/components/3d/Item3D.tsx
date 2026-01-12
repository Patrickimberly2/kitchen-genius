import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { InventoryItem } from "@/types/kitchen";
import { getDefaultShape, getDefaultDimensions, getCategoryColor } from "@/utils/itemShapeUtils";

interface Item3DProps {
  item: InventoryItem;
  position: { x: number; y: number; z: number };
  isHighlighted?: boolean;
  onClick?: () => void;
}

export function Item3D({ item, position, isHighlighted, onClick }: Item3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const shape = item.shape || getDefaultShape(item.category, item.unit);
  const dimensions = item.dimensions || getDefaultDimensions(shape, item.category);
  const color = item.color || getCategoryColor(item.category);
  
  // Smooth hover animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Target values for hover effect
    const targetZ = isHovered ? 0.03 : 0; // Pop forward on hover
    const targetScale = isHovered ? 1.08 : 1; // Slight scale up
    
    // Lerp position
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      position.z + targetZ,
      delta * 12
    );
    
    // Lerp scale
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 12);
    groupRef.current.scale.setScalar(newScale);
    
    // Subtle floating when highlighted
    if (isHighlighted && meshRef.current) {
      meshRef.current.position.y = Math.sin(Date.now() * 0.003) * 0.005;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "bottle":
        // Bottle: cylinder body with neck
        return new THREE.CylinderGeometry(
          dimensions.width / 2 * 0.6, // top radius (narrower)
          dimensions.width / 2,       // bottom radius
          dimensions.height,
          16
        );
      
      case "jar":
        // Jar: short cylinder with lid indication
        return new THREE.CylinderGeometry(
          dimensions.width / 2,
          dimensions.width / 2,
          dimensions.height,
          20
        );
      
      case "can":
        // Can: cylinder
        return new THREE.CylinderGeometry(
          dimensions.width / 2,
          dimensions.width / 2,
          dimensions.height,
          24
        );
      
      case "cylinder":
        // Generic cylinder (pans, utensils)
        return new THREE.CylinderGeometry(
          dimensions.width / 2,
          dimensions.width / 2,
          dimensions.height,
          16
        );
      
      case "bag":
      case "pouch":
        // Bag/pouch: slightly tapered box
        return new THREE.BoxGeometry(
          dimensions.width,
          dimensions.height,
          dimensions.depth
        );
      
      case "carton":
        // Carton: box with slight taper
        return new THREE.BoxGeometry(
          dimensions.width,
          dimensions.height,
          dimensions.depth
        );
      
      case "box":
      default:
        return new THREE.BoxGeometry(
          dimensions.width,
          dimensions.height,
          dimensions.depth
        );
    }
  }, [shape, dimensions]);

  const material = useMemo(() => {
    const baseColor = new THREE.Color(color);
    
    if (isHighlighted) {
      baseColor.multiplyScalar(1.3);
    } else if (isHovered) {
      baseColor.multiplyScalar(1.15);
    }
    
    // Different materials for different shapes
    switch (shape) {
      case "bottle":
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.85,
          roughness: 0.1,
          metalness: 0.1,
        });
      
      case "can":
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.3,
          metalness: 0.6,
        });
      
      case "jar":
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.7,
          roughness: 0.1,
          metalness: 0.05,
        });
      
      case "bag":
      case "pouch":
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.8,
          metalness: 0,
        });
      
      default:
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.5,
          metalness: 0.1,
        });
    }
  }, [color, shape, isHighlighted, isHovered]);

  // Render cap/lid for jars and bottles
  const renderCap = () => {
    if (shape !== "jar" && shape !== "bottle") return null;
    
    const capRadius = shape === "bottle" 
      ? dimensions.width / 2 * 0.5 
      : dimensions.width / 2 * 0.9;
    const capHeight = 0.015;
    
    return (
      <mesh position={[0, dimensions.height / 2 + capHeight / 2, 0]}>
        <cylinderGeometry args={[capRadius, capRadius, capHeight, 16]} />
        <meshStandardMaterial 
          color={shape === "bottle" ? "#444444" : "#8b4513"} 
          roughness={0.4} 
          metalness={shape === "bottle" ? 0.3 : 0.1} 
        />
      </mesh>
    );
  };

  // Render label strip for cans
  const renderLabel = () => {
    if (shape !== "can") return null;
    
    return (
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[
          dimensions.width / 2 + 0.001,
          dimensions.width / 2 + 0.001,
          dimensions.height * 0.7,
          24
        ]} />
        <meshBasicMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>
    );
  };

  // Soft shadow plane under item
  const renderShadow = () => {
    const shadowSize = Math.max(dimensions.width, dimensions.depth) * 1.2;
    return (
      <mesh 
        position={[0, -dimensions.height / 2 + 0.002, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[shadowSize / 2, 16]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={isHovered ? 0.2 : 0.12} 
        />
      </mesh>
    );
  };

  return (
    <group 
      ref={groupRef} 
      position={[position.x, position.y, position.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <mesh 
        ref={meshRef} 
        geometry={geometry} 
        material={material} 
        castShadow 
        receiveShadow 
      />
      {renderCap()}
      {renderLabel()}
      {renderShadow()}
      
      {/* Selection/highlight outline */}
      {(isHighlighted || isHovered) && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color={isHighlighted ? "#fbbf24" : "#ffffff"} linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}
