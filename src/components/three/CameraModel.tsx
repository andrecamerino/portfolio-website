"use client";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MODEL_SCALE, MODEL_POSITION } from "./constants";

type CameraModelProps = JSX.IntrinsicElements["primitive"];

export default function CameraModel(props: CameraModelProps) {
  const { scene } = useGLTF("/models/camera/source/camera-model.glb") as unknown as { scene: THREE.Object3D };

  // Memoize the processed scene with shadows enabled on meshes
  const preparedScene = useMemo(() => {
    if (!scene) return null;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
        // Optionally set material.side to FrontSide for performance, if your model is single-sided
        // (child as THREE.Mesh).material.side = THREE.FrontSide;
      }
    });
    return scene;
  }, [scene]);

  if (!preparedScene) return null;

  return (
    <primitive
      object={preparedScene}
      scale={MODEL_SCALE}
      position={MODEL_POSITION}
      {...props}
    />
  );
}