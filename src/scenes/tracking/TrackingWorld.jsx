import { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import TrackingCity from './TrackingCity';
import JourneyRoute from './JourneyRoute';
import LiveVehicle from './LiveVehicle';
import HolographicBeacon from './HolographicBeacon';
import { useJourneyStore } from '../../store/journeyStore';
import { useTheme } from '../../hooks/useTheme';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import WebGLFallback from '../../components/common/WebGLFallback';

export default function TrackingWorld({ progress }) {
  const { passport, aiApplied } = useJourneyStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
  const destination = currentRoute[currentRoute.length - 1];

  const [pixelRatio] = useState(() => 
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  );

  const bgColor = isDark ? '#030711' : '#F8FAFC';
  const fogColor = isDark ? '#030711' : '#F8FAFC';

  return (
    <ErrorBoundary fallback={<WebGLFallback />}>
      <Canvas
        dpr={pixelRatio}
        camera={{ position: [-15, 15, -15], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, 20, 80]} />
        
        <ambientLight intensity={isDark ? 0.5 : 1.2} />
        <directionalLight position={[10, 20, 10]} intensity={isDark ? 1.5 : 2} color={isDark ? "#42FFB4" : "#ffffff"} />
        <directionalLight position={[-10, 10, -10]} intensity={isDark ? 1 : 1.5} color={isDark ? "#39E7FF" : "#e2e8f0"} />

        <Suspense fallback={null}>
          <TrackingCity count={passport.mobility.reducedMotion ? 50 : 300} isDark={isDark} />
          <JourneyRoute routePoints={currentRoute} progress={progress} />
          <LiveVehicle routePoints={currentRoute} progress={progress} />
          <HolographicBeacon position={destination} isDark={isDark} reducedMotion={passport.mobility.reducedMotion} />
          {/* Grid Floor */}
          <gridHelper args={[200, 50, isDark ? '#1e293b' : '#cbd5e1', isDark ? '#0f172a' : '#e2e8f0']} position={[0, -0.1, 0]} />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={10}
          maxDistance={60}
          autoRotate={false}
        />
      </Canvas>
    </ErrorBoundary>
  );
}
