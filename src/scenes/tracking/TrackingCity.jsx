import { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';

export default function TrackingCity({ count = 200, isDark = true }) {
  const meshRef = useRef(null);
  
  const { matrices, colors } = useMemo(() => {
    return generateInstances(count, isDark);
  }, [count, isDark]);

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

function generateInstances(count, isDark) {
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

    // Emissive-like windows logic (Phase 4 requirement: add emissive windows to ~10% of buildings)
    // For standard material with vertexColors, we just make them brighter or distinct.
    const isEmissive = Math.random() > 0.9;
    
    if (isDark) {
      if (isEmissive) color.set('#1E3A8A'); // Dark blue emissive hint
      else color.set(Math.random() > 0.95 ? '#091827' : '#07111F');
    } else {
      if (isEmissive) color.set('#BAE6FD'); // Light blue emissive hint
      else color.set(Math.random() > 0.95 ? '#F1F5F9' : '#E2E8F0');
    }
    
    colorsArray[i * 3] = color.r;
    colorsArray[i * 3 + 1] = color.g;
    colorsArray[i * 3 + 2] = color.b;
  }
  
  return { 
    matrices: matricesArray.filter(Boolean), 
    colors: colorsArray 
  };
}
