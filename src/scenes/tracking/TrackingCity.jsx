import { useRef, useState, useLayoutEffect } from 'react';
import * as THREE from 'three';

export default function TrackingCity({ count = 200 }) {
  const meshRef = useRef(null);
  
  const [{ matrices, colors }] = useState(() => {
    const dummy = new THREE.Object3D();
    const matricesArray = new Array(count);
    const colorsArray = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    // Spread buildings across a large area
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80 - 10;
      // Leave a corridor for the route around z=0
      if (Math.abs(z) < 3) continue;

      const height = Math.random() * Math.random() * 20 + 1;
      
      dummy.position.set(x, height / 2, z);
      dummy.scale.set(Math.random() * 1.5 + 0.5, height, Math.random() * 1.5 + 0.5);
      dummy.updateMatrix();
      matricesArray[i] = dummy.matrix.clone();

      if (Math.random() > 0.95) {
        color.set('#091827'); // Slightly lighter architecture
      } else {
        color.set('#07111F'); // Deep architecture
      }
      
      colorsArray[i * 3] = color.r;
      colorsArray[i * 3 + 1] = color.g;
      colorsArray[i * 3 + 2] = color.b;
    }
    return { matrices: matricesArray.filter(Boolean), colors: colorsArray };
  });

  useLayoutEffect(() => {
    if (meshRef.current) {
      matrices.forEach((matrix, i) => {
        meshRef.current.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, matrices.length]}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial 
        vertexColors 
        roughness={0.8} 
        metalness={0.2}
      />
    </instancedMesh>
  );
}
