import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Atmospheric glow rim around the Earth globe.
 * Uses additive blending for a natural limb glow.
 */
export default function EarthAtmosphere({ isDark = true }) {
  const atmRef = useRef();

  useFrame(({ clock }) => {
    if (atmRef.current) {
      // Subtle atmospheric shimmer
      const t = clock.getElapsedTime();
      atmRef.current.material.opacity = isDark
        ? 0.12 + Math.sin(t * 0.5) * 0.02
        : 0.08 + Math.sin(t * 0.5) * 0.01;
    }
  });

  const glowColor = isDark ? "#1A6AFF" : "#4A90D9";

  return (
    <group>
      {/* Outer atmospheric halo */}
      <mesh ref={atmRef}>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner rim light — tighter glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color={isDark ? "#39E7FF" : "#0099CC"}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
