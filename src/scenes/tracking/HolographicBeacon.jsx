import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HolographicBeacon({ position, isDark, reducedMotion }) {
  const ringsRef = useRef();
  const cylinderRef = useRef();

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.getElapsedTime();
    
    if (ringsRef.current) {
      ringsRef.current.position.y = Math.sin(time * 2) * 0.5;
      ringsRef.current.rotation.y = time * 0.5;
    }
    
    if (cylinderRef.current) {
      cylinderRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;
    }
  });

  const color = isDark ? '#39E7FF' : '#0284c7'; // Primary cyan or darker blue for light mode

  return (
    <group position={position}>
      {/* Central Beam */}
      <mesh ref={cylinderRef} position={[0, 5, 0]}>
        <cylinderGeometry args={[0.5, 2, 10, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>

      {/* Floating Rings */}
      <group ref={ringsRef} position={[0, 1, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <ringGeometry args={[1.5, 1.6, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Ground marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}
