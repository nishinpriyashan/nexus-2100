import { Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import TrackingCity from './TrackingCity';
import JourneyRoute from './JourneyRoute';
import LiveVehicle from './LiveVehicle';
import SecondaryTraffic from './SecondaryTraffic';
import SmartRoads from './SmartRoads';
import HolographicBeacon from './HolographicBeacon';
import { useJourneyStore } from '../../store/journeyStore';
import { useTheme } from '../../hooks/useTheme';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import WebGLFallback from '../../components/common/WebGLFallback';

export default function TrackingWorld({
  progress,
  cameraMode = 'falcon',
  cameraRotation = { yaw: 0, pitch: 0 },
  cameraZoom = 1.0
}) {
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
    new THREE.Vector3(-15, 0.5, -15),
    new THREE.Vector3(0, 5, -5),
    new THREE.Vector3(15, 2, 5),
    new THREE.Vector3(30, 0.5, 20),
  ], []);

  const currentRoute = aiApplied ? aiRoute : standardRoute;
  const destination = currentRoute[currentRoute.length - 1];

  const [pixelRatio] = useState(() => 
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1
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
        
        <ambientLight intensity={isDark ? 0.6 : 1.2} />
        <directionalLight position={[10, 20, 10]} intensity={isDark ? 1.5 : 2} color={isDark ? "#42FFB4" : "#ffffff"} />
        <directionalLight position={[-10, 10, -10]} intensity={isDark ? 1 : 1.5} color={isDark ? "#39E7FF" : "#e2e8f0"} />

        <Suspense fallback={null}>
          <CameraRig cameraMode={cameraMode} cameraRotation={cameraRotation} cameraZoom={cameraZoom} progress={progress} routePoints={currentRoute} />
          <SmartRoads isDark={isDark} />
          <TrackingCity count={passport.mobility.reducedMotion ? 40 : 120} isDark={isDark} />
          <JourneyRoute routePoints={currentRoute} progress={progress} />
          <LiveVehicle routePoints={currentRoute} progress={progress} />
          {!passport.mobility.reducedMotion && <SecondaryTraffic isDark={isDark} />}
          <HolographicBeacon position={destination} isDark={isDark} reducedMotion={passport.mobility.reducedMotion} />
          <gridHelper args={[200, 50, isDark ? '#1e293b' : '#cbd5e1', isDark ? '#0f172a' : '#e2e8f0']} position={[0, -0.1, 0]} />
        </Suspense>

        {cameraMode === 'falcon' && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={8}
            maxDistance={80}
            autoRotate={false}
          />
        )}
      </Canvas>
    </ErrorBoundary>
  );
}

/**
 * CameraRig handles smooth 3D camera transitions, orientation pitch/yaw,
 * and 2-finger pinch gesture zoom levels.
 */
function CameraRig({ cameraMode, cameraRotation, cameraZoom, progress, routePoints }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(routePoints), [routePoints]);

  useFrame(({ camera }) => {
    // Dynamic FOV adjustment driven by 2-finger pinch gesture zoom
    const targetFov = 45 * cameraZoom;
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1);
    camera.updateProjectionMatrix();

    if (cameraMode === 'reality') {
      const safeProgress = Math.min(Math.max(progress, 0.001), 0.999);
      const vehiclePos = curve.getPointAt(safeProgress);
      const roadPos = new THREE.Vector3(vehiclePos.x + 2, 1.6, vehiclePos.z - 2);

      camera.position.lerp(roadPos, 0.1);

      const lookTarget = new THREE.Vector3(
        roadPos.x + Math.sin(cameraRotation.yaw) * 10,
        roadPos.y + Math.sin(cameraRotation.pitch) * 8,
        roadPos.z + Math.cos(cameraRotation.yaw) * 10
      );
      camera.lookAt(lookTarget);
    } else {
      const targetPos = new THREE.Vector3(-15 * cameraZoom, 18 * cameraZoom, -15 * cameraZoom);
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}
