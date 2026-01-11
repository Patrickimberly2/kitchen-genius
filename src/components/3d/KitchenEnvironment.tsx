import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function KitchenEnvironment() {
  const floorRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    // Could add subtle animations here
  });

  return (
    <group>
      {/* Floor - wood texture simulation */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#8b6914"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Floor pattern overlay for wood effect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#7a5c10"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 2, -3.5]} receiveShadow>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} metalness={0} />
      </mesh>
      
      {/* Ceiling - subtle */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
      </mesh>
      
      {/* Ambient lighting simulation - subtle glow planes */}
      <mesh position={[0, 3.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#fff8e8" transparent opacity={0.8} />
      </mesh>
      
      {/* Window light effect on left wall */}
      <mesh position={[-4.95, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.2]} />
        <meshBasicMaterial color="#fffef5" transparent opacity={0.15} />
      </mesh>
      
      {/* Baseboard */}
      <mesh position={[0, 0.05, -3.45]}>
        <boxGeometry args={[12, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
      <mesh position={[-4.95, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.1, 0.1]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.6} />
      </mesh>
    </group>
  );
}
