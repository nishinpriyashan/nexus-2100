import { useMemo } from 'react';
import * as THREE from 'three';
import { createBuildingTexture, createEmissiveBuildingTexture } from '../../utils/buildingTextures';

export default function FutureCity({ count = 80, isDark = true }) {
  const { facadeTexture, emissiveTexture } = useMemo(() => {
    return {
      facadeTexture: createBuildingTexture(isDark),
      emissiveTexture: createEmissiveBuildingTexture()
    };
  }, [isDark]);

  const buildings = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45 - 10;
      const width = Math.random() * 2 + 1;
      const depth = Math.random() * 2 + 1;
      const height = Math.random() * 16 + 3;

      const hasSpire = Math.random() > 0.5;
      const spireHeight = hasSpire ? Math.random() * 4 + 2 : 0;

      list.push({
        id: i,
        position: [x, height / 2 - 2, z],
        width,
        height,
        depth,
        hasSpire,
        spirePos: [x, height - 2 + spireHeight / 2, z],
        spireHeight,
        accentColor: Math.random() > 0.5 ? '#39E7FF' : '#8B5CFF'
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {buildings.map((b) => (
        <group key={b.id}>
          <mesh position={b.position}>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={isDark ? new THREE.Color('#39E7FF') : new THREE.Color('#0099CC')}
              emissiveIntensity={isDark ? 0.3 : 0.15}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {b.hasSpire && (
            <mesh position={b.spirePos}>
              <cylinderGeometry args={[0.03, 0.1, b.spireHeight, 8]} />
              <meshBasicMaterial color={b.accentColor} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
