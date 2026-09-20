import { useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FutureCity({ count = 80 }) {
  const meshRef = useRef(null);

  // Generate instances only once using state initializer
  const [{ matrices, colors }] = useState(() => {
    const dummy = new THREE.Object3D();
    const matricesArray = new Array(count);
    const colorsArray = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40 - 10;
      const height = Math.random() * 15 + 2;
      
      dummy.position.set(x, height / 2 - 2, z);
      dummy.scale.set(Math.random() * 2 + 0.5, height, Math.random() * 2 + 0.5);
      dummy.updateMatrix();
      matricesArray[i] = dummy.matrix.clone();

      const rand = Math.random();
      if (rand > 0.9) {
        color.set('#39E7FF');
      } else if (rand > 0.8) {
        color.set('#8B5CFF');
      } else {
        color.set('#081525');
      }
      
      colorsArray[i * 3] = color.r;
      colorsArray[i * 3 + 1] = color.g;
      colorsArray[i * 3 + 2] = color.b;
    }
    return { matrices: matricesArray, colors: colorsArray };
  });

  // Apply matrices on mount safely inside useLayoutEffect
  useLayoutEffect(() => {
    if (meshRef.current) {
      matrices.forEach((matrix, i) => {
        meshRef.current.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);


  // Slow parallax/environmental movement
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.1) * 0.5;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
      </boxGeometry>
      <meshStandardMaterial 
        vertexColors 
        roughness={0.2} 
        metalness={0.8}
        envMapIntensity={0.5}
      />
    </instancedMesh>
  );
}
