import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FutureCity from '../city/FutureCity';
import NexusOrb from '../ai/NexusOrb';
import Atmosphere from '../effects/Atmosphere';

export default function HomeWorld() {
  const [pixelRatio] = useState(() => 
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
  );

  return (
    <Canvas
      dpr={pixelRatio}
      camera={{ position: [10, 5, 15], fov: 45 }}
      gl={{ alpha: false, antialias: false }}
      className="bg-background"
    >
      <Suspense fallback={null}>
        <Atmosphere />
        <FutureCity count={100} />
        <NexusOrb position={[0, 2, 0]} />
        
        {/* Restrict orbit controls to prevent user from getting lost */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Suspense>
    </Canvas>
  );
}
