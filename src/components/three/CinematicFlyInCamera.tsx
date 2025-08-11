import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { CAMERA_POS } from "./constants";

type CinematicFlyInCameraProps = {
  target?: [number, number, number];
  duration?: number; // seconds
  curveHeight?: number;
};

export default function CinematicFlyInCamera({
  target = [0, 0, 0],
  duration = 3,
  curveHeight = 5,
}: CinematicFlyInCameraProps) {
  const { camera } = useThree();
  const startTime = useRef<number | null>(null);
  const startPos = useRef(CAMERA_POS.clone()); // start from your defined CAMERA_POS
  const loweredTarget = new THREE.Vector3(...target);
  loweredTarget.x += -1; // adjust this value as you want
  loweredTarget.y += -3.9; // adjust this value as you want
  loweredTarget.z += -0.2; // adjust this value as you want
  const endPos = useRef(loweredTarget);

  useEffect(() => {
    camera.position.copy(startPos.current);
    camera.lookAt(...target);
  }, [camera, target]);

  useFrame(({ clock }) => {
    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTime.current;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    // Interpolate position along curve with height
    const pos = new THREE.Vector3().lerpVectors(
      startPos.current,
      endPos.current,
      ease
    );
    pos.y += Math.sin(ease * Math.PI) * curveHeight;
    camera.position.copy(pos);

    // Interpolate lookAt from center to side
    const centerTarget = new THREE.Vector3(...target);
    const sideOffsetAmount = 5;
    const sideDirection = new THREE.Vector3(1.1, -0.8, 0); // +X side view

    const lookAtTarget = centerTarget
      .clone()
      .lerp(
        centerTarget
          .clone()
          .add(sideDirection.multiplyScalar(sideOffsetAmount)),
        ease
      );

    camera.lookAt(lookAtTarget);
  });

  return null;
}
