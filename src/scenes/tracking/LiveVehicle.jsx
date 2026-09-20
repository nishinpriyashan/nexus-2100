import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useJourneyStore } from '../../store/journeyStore';

export default function LiveVehicle({ routePoints, progress }) {
  const { aiApplied } = useJourneyStore();
  const vehicleRef = useRef();
  
  const curve = useMemo(() => new THREE.CatmullRomCurve3(routePoints), [routePoints]);
  const color = aiApplied ? '#8B5CFF' : '#39E7FF';

  useFrame(() => {
    if (vehicleRef.current) {
      // Get position along curve based on progress
      // Clamp progress slightly to avoid getting 100% exactly if it causes curve errors
      const safeProgress = Math.min(Math.max(progress, 0.001), 0.999);
      const position = curve.getPointAt(safeProgress);
      const tangent = curve.getTangentAt(safeProgress);
      
      vehicleRef.current.position.copy(position);
      
      // Orient vehicle to face direction of travel
      const target = position.clone().add(tangent);
      vehicleRef.current.lookAt(target);
    }
  });

  return (
    <group ref={vehicleRef}>
      {/* Main Capsule Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Energy Strip / Accent */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.31, 0.8, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      
      {/* Glowing thruster/engine */}
      <mesh position={[0, 0, -0.6]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Point light to cast a glow on the surroundings */}
      <pointLight color={color} intensity={2} distance={5} />
    </group>
  );
}
