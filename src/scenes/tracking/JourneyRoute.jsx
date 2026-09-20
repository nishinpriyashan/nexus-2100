import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useJourneyStore } from '../../store/journeyStore';

export default function JourneyRoute({ routePoints }) {
  const { aiApplied, accessibility } = useJourneyStore();
  const lineRef = useRef();
  
  const color = aiApplied ? '#8B5CFF' : '#39E7FF'; // Violet or Cyan
  
  // We can draw the line in two parts: completed (muted) and remaining (bright/dashed)
  // For simplicity in the demo, we just draw one bright glowing line and maybe a pulse.

  useFrame(({ clock }) => {
    if (!accessibility.reducedMotion && lineRef.current) {
      // Subtle pulse effect on the line material if possible
      lineRef.current.material.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <group>
      {/* Base Route */}
      <Line
        ref={lineRef}
        points={routePoints}
        color={color}
        lineWidth={5}
        transparent
        opacity={0.8}
      />
      
      {/* Route Glow */}
      <Line
        points={routePoints}
        color={color}
        lineWidth={15}
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </group>
  );
}
