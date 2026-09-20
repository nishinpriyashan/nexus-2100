import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useJourneyStore } from "../../store/journeyStore";

export default function EarthGlobe({ isDark = true }) {
  const earthGroupRef = useRef();
  const cloudsRef = useRef();
  const { passport, journeyStatus } = useJourneyStore();

  const baseUrl = import.meta.env.BASE_URL;

  // Load all textures
  const [colorMap, bumpMap, specularMap, cloudsMap, nightMap] = useTexture([
    `${baseUrl}textures/earth/earth_color.jpg`,
    `${baseUrl}textures/earth/earth_bump.jpg`,
    `${baseUrl}textures/earth/earth_specular.png`,
    `${baseUrl}textures/earth/earth_clouds.png`,
    `${baseUrl}textures/earth/earth_night.jpg`,
  ]);
  
  // Animate rotation and formation
  useFrame(({ clock }, delta) => {
    if (!earthGroupRef.current) return;
    
    // Scale animation (formation)
    if (earthGroupRef.current.scale.x < 1) {
      earthGroupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2.5);
    }
    
    if (!passport.mobility.reducedMotion) {
      const elapsedTime = clock.getElapsedTime();
      earthGroupRef.current.rotation.y = elapsedTime * 0.04;
      
      if (cloudsRef.current) {
        // Clouds rotate slightly faster than the earth
        cloudsRef.current.rotation.y = elapsedTime * 0.045;
      }
    }
  });

  return (
    <group ref={earthGroupRef} scale={0}>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          specularMap={specularMap}
          specular={new THREE.Color("grey")}
          emissiveMap={isDark ? nightMap : null}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={isDark ? 0.4 : 0}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glow sphere for stylized ambiance */}
      <mesh>
        <sphereGeometry args={[2.38, 32, 32]} />
        <meshBasicMaterial
          color={isDark ? "#0A2040" : "#C8DCF0"}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Journey Search Animation */}
      {journeyStatus === 'analyzing' && (
        <JourneySearchNodes isDark={isDark} reducedMotion={passport.mobility.reducedMotion} />
      )}
    </group>
  );
}

// Arbitrary lat/lon points mapped to spherical coordinates (radius = 2.45)
// Origin: roughly Europe, Dest: roughly another part of Europe/Asia
const SEARCH_ORIGIN_POS = new THREE.Vector3(1.4, 1.6, 1.2);
const SEARCH_DEST_POS = new THREE.Vector3(-1.2, 1.5, -1.5);

function JourneySearchNodes({ isDark, reducedMotion }) {
  const originRef = useRef();
  const destRef = useRef();
  const arcRef = useRef();
  
  const arcGeometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      SEARCH_ORIGIN_POS,
      new THREE.Vector3(0, 3.5, 0), // Control point above surface
      SEARCH_DEST_POS
    );
    const points = curve.getPoints(50);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    if (originRef.current) originRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.2);
    if (destRef.current) destRef.current.scale.setScalar(1 + Math.sin(t * 8 + 2) * 0.2);
    if (arcRef.current) {
      // Create a dash animation effect
      arcRef.current.material.dashOffset -= 0.05;
    }
  });

  const nodeColor = isDark ? "#39E7FF" : "#0284c7";

  return (
    <group>
      {/* Origin */}
      <mesh ref={originRef} position={SEARCH_ORIGIN_POS}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>
      
      {/* Destination */}
      <mesh ref={destRef} position={SEARCH_DEST_POS}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={isDark ? "#8B5CFF" : "#6366f1"} />
      </mesh>

      {/* Arc */}
      <line ref={arcRef} geometry={arcGeometry}>
        <lineDashedMaterial 
          color={nodeColor} 
          linewidth={2} 
          dashSize={0.2} 
          gapSize={0.1} 
          opacity={0.8} 
          transparent 
        />
      </line>
    </group>
  );
}
