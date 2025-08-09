"use client";
import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_SCALE, MODEL_POSITION } from "./constants";

type CameraModelProps = JSX.IntrinsicElements["primitive"];

export default function CameraModel(props: CameraModelProps) {
  const { scene } = useGLTF("/models/camera/source/camera-model.glb") as unknown as { scene: THREE.Object3D };

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={MODEL_SCALE}
      position={MODEL_POSITION}
      {...props}
    />
  );
}