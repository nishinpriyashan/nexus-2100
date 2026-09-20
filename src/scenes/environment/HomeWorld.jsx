import { Suspense, useState, useEffect, useRef } from "react";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import WebGLFallback from "../../components/common/WebGLFallback";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import EarthGlobe from "../earth/EarthGlobe";
import EarthAtmosphere from "../earth/EarthAtmosphere";
import NetworkArcs from "../earth/NetworkArcs";
import { useJourneyStore } from "../../store/journeyStore";

/**
 * Lighting setup for the Earth scene.
 * Cinematic directional lighting from upper-left (sunlight).
 */
function EarthLighting({ isDark }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.1 : 0.4} color={isDark ? "#1A3A5C" : "#E8F0FA"} />
      <directionalLight
        position={[8, 6, 4]}
        intensity={isDark ? 2.5 : 3.0}
        color={isDark ? "#C8E8FF" : "#FFFFFF"}
      />
      <pointLight
        position={[-6, -3, -4]}
        intensity={isDark ? 0.5 : 0.2}
        color={isDark ? "#39E7FF" : "#4A90D9"}
      />
    </>
  );
}

/**
 * Auto-slow rotation group with pointer parallax on desktop.
 */
function EarthGroup({ isDark }) {
  const groupRef = useRef();
  const { passport } = useJourneyStore();
  const { size } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = size.width < 768;

  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (passport.mobility.reducedMotion) return;

    // Gentle pointer-based tilt (desktop only)
    if (!isMobile) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseRef.current.y * 0.08,
        delta * 2
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouseRef.current.x * 0.04,
        delta * 2
      );
    }
  });

  return (
    <group ref={groupRef}>
      <EarthGlobe isDark={isDark} />
      <EarthAtmosphere isDark={isDark} />
      <NetworkArcs isDark={isDark} />
    </group>
  );
}

export default function HomeWorld({ isDark = true }) {
  const [pixelRatio] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1
  );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <ErrorBoundary fallback={<WebGLFallback />}>
      <Canvas
        dpr={pixelRatio}
        camera={{ position: [0, 1, 7], fov: isMobile ? 52 : 42 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <EarthLighting isDark={isDark} />
          <EarthGroup isDark={isDark} />
          {/* Background star field */}
          <StarField count={isDark ? 300 : 50} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
}

/**
 * Lightweight star field particles.
 */
function StarField({ count = 300 }) {
  const positions = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  })[0];

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7ABFFF"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
