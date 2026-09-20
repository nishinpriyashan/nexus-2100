import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useJourneyStore } from '../../store/journeyStore';

export default function LiveVehicle({ routePoints, progress }) {
  const { aiApplied } = useJourneyStore();
  const vehicleRef = useRef();

  const curve = useMemo(() => new THREE.CatmullRomCurve3(routePoints), [routePoints]);
  const primaryColor = aiApplied ? '#8B5CFF' : '#39E7FF';
  const accentColor = '#42FFB4';

  useFrame(() => {
    if (vehicleRef.current) {
      const safeProgress = Math.min(Math.max(progress, 0.001), 0.999);
      const position = curve.getPointAt(safeProgress);
      const tangent = curve.getTangentAt(safeProgress);

      vehicleRef.current.position.copy(position);

      const target = position.clone().add(tangent);
      vehicleRef.current.lookAt(target);
    }
  });

  return (
    <group ref={vehicleRef}>
      {/* ── High-Speed Aerodynamic Maglev Train ── */}

      {/* 1. Sleek Tapered Front Nose */}
      <mesh position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.35, 0.9, 16]} />
        <meshStandardMaterial color="#F4FAFF" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Front Headlight Beam */}
      <mesh position={[0, 0, 1.35]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <spotLight
        position={[0, 0, 1.4]}
        target-position={[0, 0, 6]}
        color="#39E7FF"
        intensity={3}
        angle={0.4}
        penumbra={0.5}
      />

      {/* Windshield Cockpit Glass */}
      <mesh position={[0, 0.18, 0.7]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.42, 0.18, 0.4]} />
        <meshStandardMaterial color="#091827" roughness={0.05} metalness={0.95} />
      </mesh>

      {/* 2. Main Lead Cabin Body */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.65, 0.45, 1.2]} />
        <meshStandardMaterial color="#0F2035" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* Illuminated Passenger Side Windows (Left & Right) */}
      <mesh position={[0.33, 0.05, 0.1]}>
        <boxGeometry args={[0.02, 0.12, 1.0]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>
      <mesh position={[-0.33, 0.05, 0.1]}>
        <boxGeometry args={[0.02, 0.12, 1.0]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>

      {/* 3. Second Carriage (Flexible Maglev Connector) */}
      <mesh position={[0, 0, -1.25]}>
        <boxGeometry args={[0.62, 0.43, 1.2]} />
        <meshStandardMaterial color="#081525" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Side Windows for Car 2 */}
      <mesh position={[0.32, 0.05, -1.25]}>
        <boxGeometry args={[0.02, 0.12, 1.0]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>
      <mesh position={[-0.32, 0.05, -1.25]}>
        <boxGeometry args={[0.02, 0.12, 1.0]} />
        <meshBasicMaterial color={primaryColor} />
      </mesh>

      {/* Flexible Bellow Connector between carriages */}
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[0.5, 0.38, 0.2]}>
        </boxGeometry>
        <meshStandardMaterial color="#030711" roughness={0.8} />
      </mesh>

      {/* 4. Glowing Underside Anti-Gravity Skids */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.7, 0.06, 2.6]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.85} />
      </mesh>

      {/* Rear Engine Plasma Thruster Glow */}
      <mesh position={[0, 0, -1.9]}>
        <cylinderGeometry args={[0.18, 0.22, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Ambient glow light surrounding the moving train */}
      <pointLight position={[0, 0.5, 0]} color={primaryColor} intensity={3.5} distance={12} />
    </group>
  );
}
