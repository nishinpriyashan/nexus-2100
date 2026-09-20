import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useJourneyStore } from '../../store/journeyStore';

export default function JourneyRouteScene() {
  const { aiApplied, accessibility } = useJourneyStore();
  const groupRef = useRef(null);
  
  const standardColor = '#39E7FF'; // Cyan
  const aiColor = '#8B5CFF'; // Violet
  const color = aiApplied ? aiColor : standardColor;

  const points = [
    new THREE.Vector3(-4, -2, 0), // Current Location
    new THREE.Vector3(-1.5, 0, 1),
    new THREE.Vector3(1, 0.5, -1),
    new THREE.Vector3(4, 2, 0), // Destination
  ];

  const aiPoints = [
    new THREE.Vector3(-4, -2, 0),
    new THREE.Vector3(-1, 1, -2),
    new THREE.Vector3(2, 1.5, 1),
    new THREE.Vector3(4, 2, 0),
  ];

  const currentPoints = aiApplied ? aiPoints : points;

  useFrame(({ clock }) => {
    if (!accessibility.reducedMotion && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
      groupRef.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <Float 
        speed={accessibility.reducedMotion ? 0 : 2} 
        rotationIntensity={accessibility.reducedMotion ? 0 : 0.5} 
        floatIntensity={accessibility.reducedMotion ? 0 : 1}
      >
        <Line
          points={currentPoints}
          color={color}
          lineWidth={3}
          dashed={false}
        />
        
        {/* Origin Node */}
        <Sphere args={[0.15, 16, 16]} position={currentPoints[0]}>
          <meshBasicMaterial color={color} />
        </Sphere>
        
        {/* Waypoints */}
        <Sphere args={[0.08, 16, 16]} position={currentPoints[1]}>
          <meshBasicMaterial color={color} />
        </Sphere>
        <Sphere args={[0.08, 16, 16]} position={currentPoints[2]}>
          <meshBasicMaterial color={color} />
        </Sphere>
        
        {/* Destination Node */}
        <Sphere args={[0.2, 32, 32]} position={currentPoints[3]}>
          <meshBasicMaterial color={color} wireframe />
        </Sphere>

        {/* Optional glowing effect sphere for destination */}
        <Sphere args={[0.4, 16, 16]} position={currentPoints[3]}>
          <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
        </Sphere>
      </Float>
    </group>
  );
}
