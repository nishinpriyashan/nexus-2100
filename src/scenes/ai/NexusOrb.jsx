import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import AiLabel from '../../components/ai/AiLabel';

export default function NexusOrb({ position = [0, 0, 0] }) {
  const coreRef = useRef(null);
  const ringRef1 = useRef(null);
  const ringRef2 = useRef(null);
  const particlesRef = useRef(null);

  const [particlesArray] = useState(() => 
    new Float32Array(50 * 3).map(() => (Math.random() - 0.5) * 8)
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
      coreRef.current.rotation.x = t * 0.1;
      // Pulse effect
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
      ringRef1.current.rotation.y = t * 0.5;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.3) * 0.2;
      ringRef2.current.rotation.y = -t * 0.3;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Central Holographic Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshPhysicalMaterial 
          color="#39E7FF"
          emissive="#39E7FF"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.3}
          roughness={0}
          transmission={1}
          thickness={0.5}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#8B5CFF" transparent opacity={0.6} />
      </mesh>

      {/* Rotating Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#39E7FF" transparent opacity={0.5} />
      </mesh>

      <mesh ref={ringRef2}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8B5CFF" transparent opacity={0.3} />
      </mesh>

      {/* Orbiting Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={particlesArray}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#42FFB4" transparent opacity={0.6} />
      </points>

      {/* HTML Label */}
      <AiLabel position={[0, -2.5, 0]} />
    </group>
  );
}
