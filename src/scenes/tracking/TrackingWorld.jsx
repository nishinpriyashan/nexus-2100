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
  const { passport, aiApplied, isDriveMode, driveSpeed, steeringAngle } = useJourneyStore();
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
        <fog attach="fog" args={[fogColor, 20, 120]} />
        
        <ambientLight intensity={isDark ? 0.6 : 1.2} />
        <directionalLight position={[10, 20, 10]} intensity={isDark ? 1.5 : 2} color={isDark ? "#42FFB4" : "#ffffff"} />
        <directionalLight position={[-10, 10, -10]} intensity={isDark ? 1 : 1.5} color={isDark ? "#39E7FF" : "#e2e8f0"} />

        <Suspense fallback={null}>
          <CameraRig cameraMode={cameraMode} cameraRotation={cameraRotation} cameraZoom={cameraZoom} progress={progress} routePoints={currentRoute} />
          <SmartRoads isDark={isDark} />
          <TrackingCity count={passport.mobility.reducedMotion ? 25 : 50} isDark={isDark} />
          <JourneyRoute routePoints={currentRoute} progress={progress} />
          <LiveVehicle routePoints={currentRoute} progress={progress} />
          <DriveableCyberRoadster />
          {!passport.mobility.reducedMotion && <SecondaryTraffic isDark={isDark} />}
          <HolographicBeacon position={destination} isDark={isDark} reducedMotion={passport.mobility.reducedMotion} />
          <gridHelper args={[250, 60, isDark ? '#1e293b' : '#cbd5e1', isDark ? '#0f172a' : '#e2e8f0']} position={[0, -0.1, 0]} />
        </Suspense>

        {cameraMode === 'falcon' && !isDriveMode && (
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
 * Interactive 3D Cyber Roadster Vehicle Mesh
 * Driven across the 3D Sri Lankan city universe using hand gestures or touch controls.
 */
function DriveableCyberRoadster() {
  const { isDriveMode, driveSpeed, steeringAngle, drivePos, setDriveState } = useJourneyStore();
  const carRef = useRef();
  const angleRef = useRef(0);

  useFrame((state, delta) => {
    if (!isDriveMode || !carRef.current) return;

    // Turn / rotate car orientation
    if (steeringAngle !== 0) {
      angleRef.current += (steeringAngle * 0.03 * delta);
    }

    // Accelerate forward along heading vector
    if (driveSpeed > 0) {
      const moveDist = (driveSpeed / 3600) * delta * 250;
      const newX = drivePos[0] + Math.sin(angleRef.current) * moveDist;
      const newZ = drivePos[2] + Math.cos(angleRef.current) * moveDist;
      setDriveState({ drivePos: [newX, 0.4, newZ] });
    }

    if (carRef.current) {
      carRef.current.position.set(drivePos[0], drivePos[1], drivePos[2]);
      carRef.current.rotation.y = angleRef.current;
    }
  });

  if (!isDriveMode) return null;

  return (
    <group ref={carRef} position={drivePos}>
      {/* Sleek Cyber Roadster Car Body Chassis */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.6, 3.6]} />
        <meshStandardMaterial color="#0A1F38" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Aerodynamic Cockpit Glass Roof */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.4, 0.5, 1.8]} />
        <meshStandardMaterial color="#39E7FF" opacity={0.65} transparent roughness={0.05} />
      </mesh>

      {/* Glowing Neon Cyber Trim Line */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.85, 0.1, 3.65]} />
        <meshBasicMaterial color="#42FFB4" />
      </mesh>

      {/* Bright White LED Headlights */}
      <spotLight position={[0, 0.6, 1.8]} target-position={[0, 0, 10]} intensity={4} color="#FFFFFF" angle={0.6} penumbra={0.5} />
      <mesh position={[-0.6, 0.45, 1.81]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshBasicMaterial color="#39E7FF" />
      </mesh>
      <mesh position={[0.6, 0.45, 1.81]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshBasicMaterial color="#39E7FF" />
      </mesh>

      {/* Red LED Tail Lights */}
      <mesh position={[-0.6, 0.45, -1.81]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshBasicMaterial color="#FF3366" />
      </mesh>
      <mesh position={[0.6, 0.45, -1.81]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshBasicMaterial color="#FF3366" />
      </mesh>

      {/* 4 Wheels */}
      {[[-0.95, 0.25, 1.1], [0.95, 0.25, 1.1], [-0.95, 0.25, -1.1], [0.95, 0.25, -1.1]].map((wPos, idx) => (
        <mesh key={idx} position={wPos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#07111F" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * CameraRig handles smooth 3D camera transitions, orientation pitch/yaw,
 * street-level chase camera in Drive Mode, and 2-finger pinch gesture zoom levels.
 */
function CameraRig({ cameraMode, cameraRotation, cameraZoom, progress, routePoints }) {
  const { isDriveMode, drivePos, steeringAngle } = useJourneyStore();
  const curve = useMemo(() => new THREE.CatmullRomCurve3(routePoints), [routePoints]);
  const camAngleRef = useRef(0);

  useFrame(({ camera }, delta) => {
    // Street-Level Chase Camera in Hand Gesture Vehicle Drive Mode
    if (isDriveMode) {
      if (steeringAngle !== 0) {
        camAngleRef.current += (steeringAngle * 0.03 * delta);
      }

      // Chase camera position behind the Cyber Roadster at street level (height = 1.6m)
      const chaseDistance = 7.5;
      const camX = drivePos[0] - Math.sin(camAngleRef.current) * chaseDistance;
      const camY = 1.8;
      const camZ = drivePos[2] - Math.cos(camAngleRef.current) * chaseDistance;

      const targetCamPos = new THREE.Vector3(camX, camY, camZ);
      camera.position.lerp(targetCamPos, 0.15);

      const lookX = drivePos[0] + Math.sin(camAngleRef.current) * 10;
      const lookZ = drivePos[2] + Math.cos(camAngleRef.current) * 10;
      camera.lookAt(lookX, 1.2, lookZ);
      return;
    }

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

