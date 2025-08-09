"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { CAMERA_POS, CAMERA_LOOK_AT } from "./constants";

export default function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.copy(CAMERA_POS);
    camera.lookAt(CAMERA_LOOK_AT);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}