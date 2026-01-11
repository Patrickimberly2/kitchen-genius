import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useKitchen } from "@/context/KitchenContext";
import { ZoneMesh3D } from "./ZoneMesh3D";
import { KitchenEnvironment } from "./KitchenEnvironment";

function KitchenLighting() {
  return (
    <>
      {/* Main ambient light */}
      <ambientLight intensity={0.4} color="#fff8e8" />
      
      {/* Primary directional light (sun-like) */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1}
        color="#fffbf0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-3, 4, 2]}
        intensity={0.3}
        color="#e8f0ff"
      />
      
      {/* Warm accent light */}
      <pointLight
        position={[0, 3.5, 0]}
        intensity={0.4}
        color="#ffead0"
        distance={8}
        decay={2}
      />
      
      {/* Subtle rim light */}
      <spotLight
        position={[0, 4, -3]}
        angle={0.5}
        penumbra={1}
        intensity={0.2}
        color="#ffffff"
      />
    </>
  );
}

function SceneContent() {
  const { zones, selectZone } = useKitchen();
  const controlsRef = useRef<any>(null);

  const handleBackgroundClick = () => {
    selectZone(null);
  };

  return (
    <>
      <KitchenLighting />
      <KitchenEnvironment />
      
      {/* Render all zones */}
      {zones.map((zone) => (
        <ZoneMesh3D key={zone.id} zone={zone} />
      ))}
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={15}
        blur={2}
        far={4}
        color="#3d2914"
      />
      
      {/* Click catcher for deselection */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={12}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 1, 0]}
        enableDamping
        dampingFactor={0.05}
      />
      
      {/* Environment for reflections */}
      <Environment preset="apartment" />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#d4a574" wireframe />
    </mesh>
  );
}

export function KitchenScene3D() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-muted/30 to-muted/60">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera
            makeDefault
            position={[4, 4, 6]}
            fov={50}
            near={0.1}
            far={100}
          />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
