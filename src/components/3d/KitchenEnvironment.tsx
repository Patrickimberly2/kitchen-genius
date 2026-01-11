import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface KitchenEnvironmentProps {
  preset?: string;
}

export function KitchenEnvironment({ preset }: KitchenEnvironmentProps) {
  const floorRef = useRef<THREE.Mesh>(null);
  
  // Room dimensions based on preset
  const isCustomKitchen = preset === "custom-u-shaped";
  
  // Custom kitchen is larger to accommodate U-shape with wings
  const roomWidth = isCustomKitchen ? 12 : 12;
  const roomDepth = isCustomKitchen ? 10 : 10;
  const roomHeight = 3.2;
  
  // Wall positions
  const backWallZ = isCustomKitchen ? -3.5 : -3.5;
  const frontWallZ = isCustomKitchen ? 3.5 : 3.5;
  const leftWallX = isCustomKitchen ? -4.5 : -5;
  const rightWallX = isCustomKitchen ? 5.5 : 5;
  
  useFrame(() => {
    // Could add subtle animations here
  });

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FLOOR - Wood texture simulation */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.5, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color="#8b6914"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Floor wood grain overlay */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.5, 0.001, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color="#7a5c10"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WALLS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Back wall (Sink Wall) */}
      <mesh position={[0.5, roomHeight / 2, backWallZ]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Front wall (Fridge/Freezer Wall) */}
      <mesh position={[0.5, roomHeight / 2, frontWallZ]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[leftWallX, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[rightWallX, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CEILING */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <mesh position={[0.5, roomHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
      </mesh>
      
      {/* Ceiling lights */}
      <mesh position={[-1.5, roomHeight - 0.1, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#fff8e8" transparent opacity={0.9} />
      </mesh>
      <mesh position={[2.5, roomHeight - 0.1, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#fff8e8" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.5, roomHeight - 0.1, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#fff8e8" transparent opacity={0.9} />
      </mesh>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* DINING AREA OPENINGS (for custom kitchen) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isCustomKitchen && (
        <>
          {/* Left opening to dining #1 - subtle floor color change */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-4, 0.002, 0]}
            receiveShadow
          >
            <planeGeometry args={[2, 4]} />
            <meshStandardMaterial
              color="#a07830"
              roughness={0.7}
              metalness={0.1}
              transparent
              opacity={0.4}
            />
          </mesh>
          
          {/* Right opening to dining #2 */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[5, 0.002, 0]}
            receiveShadow
          >
            <planeGeometry args={[2, 4]} />
            <meshStandardMaterial
              color="#a07830"
              roughness={0.7}
              metalness={0.1}
              transparent
              opacity={0.4}
            />
          </mesh>
        </>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BASEBOARDS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Back wall baseboard */}
      <mesh position={[0.5, 0.05, backWallZ + 0.05]}>
        <boxGeometry args={[roomWidth, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      
      {/* Front wall baseboard */}
      <mesh position={[0.5, 0.05, frontWallZ - 0.05]}>
        <boxGeometry args={[roomWidth, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      
      {/* Left wall baseboard */}
      <mesh position={[leftWallX + 0.05, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      
      {/* Right wall baseboard */}
      <mesh position={[rightWallX - 0.05, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WINDOW LIGHT EFFECT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <mesh position={[leftWallX + 0.05, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 1.4]} />
        <meshBasicMaterial color="#fffef5" transparent opacity={0.12} />
      </mesh>
      
      {/* Window frame hint */}
      <mesh position={[leftWallX + 0.03, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.9, 1.5]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.5} />
      </mesh>
    </group>
  );
}
