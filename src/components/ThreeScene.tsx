import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SpinningBox() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function BasicScene() {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 5] }} style={{ height: '100vh', width: '100vw' }}>
      <ambientLight />
      <SpinningBox />
    </Canvas>
  );
}