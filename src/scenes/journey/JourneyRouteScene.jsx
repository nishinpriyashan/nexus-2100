import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useJourneyStore } from '../../store/journeyStore';

export default function JourneyRouteScene() {
  const { passport, aiApplied } = useJourneyStore();
  const groupRef = useRef(null);
  const travelerRef = useRef(null);
  const waypointsRef = useRef([]);
  
  const standardColor = '#39E7FF'; // Cyan
  const aiColor = '#8B5CFF'; // Violet
  const color = aiApplied ? aiColor : standardColor;

  const points = useMemo(() => [
    new THREE.Vector3(-4, -2, 0), // Current Location
    new THREE.Vector3(-1.5, 0, 1),
    new THREE.Vector3(1, 0.5, -1),
    new THREE.Vector3(4, 2, 0), // Destination
  ], []);

  const aiPoints = useMemo(() => [
    new THREE.Vector3(-4, -2, 0),
    new THREE.Vector3(-1, 1, -2),
    new THREE.Vector3(2, 1.5, 1),
    new THREE.Vector3(4, 2, 0),
  ], []);

  const currentPoints = aiApplied ? aiPoints : points;
  
  // Create a smooth curve for the traveler to follow
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(currentPoints);
  }, [currentPoints]);

  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Animate waypoints scaling up (formation)
    waypointsRef.current.forEach((wp, i) => {
      if (wp && wp.scale.x < 1) {
        wp.scale.lerp(new THREE.Vector3(1, 1, 1), delta * (2 + i));
      }
    });

    if (!passport.mobility.reducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
        groupRef.current.rotation.x = Math.cos(elapsedTime * 0.1) * 0.05;
      }
      
      // Animate traveler along the curve
      if (travelerRef.current) {
        const time = (elapsedTime * 0.15) % 1; // loop every ~6.6 seconds
        const position = curve.getPoint(time);
        travelerRef.current.position.copy(position);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <Float 
        speed={passport.mobility.reducedMotion ? 0 : 2} 
        rotationIntensity={passport.mobility.reducedMotion ? 0 : 0.5} 
        floatIntensity={passport.mobility.reducedMotion ? 0 : 1}
      >
        <Line
          points={currentPoints}
          color={color}
          lineWidth={3}
          dashed={false}
        />
        
        {/* Traveler dot that moves along the line */}
        {!passport.mobility.reducedMotion && (
          <Sphere ref={travelerRef} args={[0.12, 16, 16]}>
            <meshBasicMaterial color="#FFFFFF" />
          </Sphere>
        )}
        
        {/* Origin Node */}
        <Sphere 
          ref={(el) => waypointsRef.current[0] = el} 
          args={[0.15, 16, 16]} 
          position={currentPoints[0]} 
          scale={0}
        >
          <meshBasicMaterial color={color} />
        </Sphere>
        
        {/* Waypoints */}
        <Sphere 
          ref={(el) => waypointsRef.current[1] = el} 
          args={[0.08, 16, 16]} 
          position={currentPoints[1]} 
          scale={0}
        >
          <meshBasicMaterial color={color} />
        </Sphere>
        <Sphere 
          ref={(el) => waypointsRef.current[2] = el} 
          args={[0.08, 16, 16]} 
          position={currentPoints[2]} 
          scale={0}
        >
          <meshBasicMaterial color={color} />
        </Sphere>
        
        {/* Destination Node */}
        <Sphere 
          ref={(el) => waypointsRef.current[3] = el} 
          args={[0.2, 32, 32]} 
          position={currentPoints[3]} 
          scale={0}
        >
          <meshBasicMaterial color={color} wireframe />
        </Sphere>
        <Sphere 
          ref={(el) => waypointsRef.current[4] = el} 
          args={[0.4, 16, 16]} 
          position={currentPoints[3]} 
          scale={0}
        >
          <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
        </Sphere>
      </Float>
    </group>
  );
}
