import { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import TrackingCity from './TrackingCity';
import JourneyRoute from './JourneyRoute';
import LiveVehicle from './LiveVehicle';
import { useJourneyStore } from '../../store/journeyStore';

export default function TrackingWorld({ progress }) {
  const { aiApplied } = useJourneyStore();

  const standardRoute = useMemo(() => [
    new THREE.Vector3(-30, 0.5, -20),
    new THREE.Vector3(-15, 0.5, -5),
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(15, 0.5, 5),
    new THREE.Vector3(30, 0.5, 20),
  ], []);

  const aiRoute = useMemo(() => [
    new THREE.Vector3(-30, 0.5, -20),
    new THREE.Vector3(-15, 0.5, -15), // Bypassing node A17 at (-15, -5)
    new THREE.Vector3(0, 5, -5),     // Taking Aerial Link
    new THREE.Vector3(15, 2, 5),
    new THREE.Vector3(30, 0.5, 20),
  ], []);

  const currentRoute = aiApplied ? aiRoute : standardRoute;

  const [pixelRatio] = useState(() => 
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  );

  return (
    <Canvas
      dpr={pixelRatio}
      camera={{ position: [-15, 15, -15], fov: 45 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#030711']} />
      <fog attach="fog" args={['#030711', 20, 80]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#42FFB4" />
      <directionalLight position={[-10, 10, -10]} intensity={1} color="#39E7FF" />

      <Suspense fallback={null}>
        <TrackingCity count={300} />
        <JourneyRoute routePoints={currentRoute} progress={progress} />
        <LiveVehicle routePoints={currentRoute} progress={progress} />
      </Suspense>

      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minDistance={10}
        maxDistance={60}
      />
    </Canvas>
  );
}
