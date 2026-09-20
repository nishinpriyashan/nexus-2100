import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Secondary Traffic component rendering flying Air Taxis and ground shuttles
 * to make the 3D 2100 metropolis feel alive with realistic continuous motion.
 */
export default function SecondaryTraffic({ isDark = true }) {
  const airTaxisRef = useRef([]);
  const shuttlesRef = useRef([]);

  // Generate 8 flying air taxis at upper sky altitudes
  const airTaxis = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      start: new THREE.Vector3((Math.random() - 0.5) * 80, 8 + Math.random() * 6, -30),
      end: new THREE.Vector3((Math.random() - 0.5) * 80, 8 + Math.random() * 6, 30),
      speed: 0.08 + Math.random() * 0.06,
      offset: Math.random() * 100,
      color: i % 2 === 0 ? '#39E7FF' : '#8B5CFF'
    }));
  }, []);

  // Generate 12 ground autonomous road shuttles
  const shuttles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: (i % 2 === 0 ? -1 : 1) * (10 + Math.random() * 25),
      speed: 0.1 + Math.random() * 0.08,
      offset: Math.random() * 50,
      color: '#42FFB4'
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate air taxis flying along upper sky lanes
    airTaxisRef.current.forEach((ref, idx) => {
      if (ref) {
        const item = airTaxis[idx];
        const progress = ((time * item.speed + item.offset) % 1);
        ref.position.lerpVectors(item.start, item.end, progress);
      }
    });

    // Animate ground shuttles moving along city streets
    shuttlesRef.current.forEach((ref, idx) => {
      if (ref) {
        const item = shuttles[idx];
        const z = (((time * item.speed * 10 + item.offset) % 80) - 40);
        ref.position.set(item.x, 0.25, z);
      }
    });
  });

  return (
    <group>
      {/* Flying Air Taxis */}
      {airTaxis.map((item, i) => (
        <group key={`air-${i}`} ref={(el) => (airTaxisRef.current[i] = el)}>
          {/* Sleek Aerodynamic Flying Pod */}
          <mesh rotation={[0, 0, Math.PI / 8]}>
            <capsuleGeometry args={[0.18, 0.5, 8, 8]} />
            <meshStandardMaterial color="#F4FAFF" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Engine Rotor Glow */}
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={item.color} />
          </mesh>
        </group>
      ))}

      {/* Autonomous Ground Shuttles */}
      {shuttles.map((item, i) => (
        <group key={`ground-${i}`} ref={(el) => (shuttlesRef.current[i] = el)}>
          <mesh>
            <boxGeometry args={[0.45, 0.3, 0.9]} />
            <meshStandardMaterial color="#0A1F38" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Headlights */}
          <mesh position={[0, 0.05, 0.46]}>
            <boxGeometry args={[0.35, 0.06, 0.02]} />
            <meshBasicMaterial color={item.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
