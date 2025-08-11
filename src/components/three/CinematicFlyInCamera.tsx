import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { CAMERA_POS } from "./constants";

type CinematicFlyInCameraProps = {
  target?: [number, number, number];
  duration?: number; // seconds for movement
  curveHeight?: number;
  holdTime?: number; // seconds to stay still after animation
  onAnimationComplete?: () => void;
};

export default function CinematicFlyInCamera({
  target = [0, 0, 0],
  duration = 3,
  curveHeight = 5,
  holdTime = 3,
  onAnimationComplete,
}: CinematicFlyInCameraProps) {
  const { camera } = useThree();
  const startTime = useRef<number | null>(null);
  const holdStartTime = useRef<number | null>(null);
  const animationDone = useRef(false);
  const holdDone = useRef(false);

  const startPos = useRef(CAMERA_POS.clone());
  const loweredTarget = new THREE.Vector3(...target);
  loweredTarget.x += -0.7;
  loweredTarget.y += -3.9;
  loweredTarget.z += -0.2;
  const endPos = useRef(loweredTarget);

  const controlPoint = useRef(
    new THREE.Vector3(
      startPos.current.x + 5,
      (startPos.current.y + endPos.current.y) / 2 - 3,
      startPos.current.z + 5
    )
  );

  useEffect(() => {
    camera.position.copy(startPos.current);
    camera.lookAt(...target);
  }, [camera, target]);

  const quadraticBezier = (
    t: number,
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    p2: THREE.Vector3
  ) => {
    const oneMinusT = 1 - t;
    return new THREE.Vector3()
      .add(p0.clone().multiplyScalar(oneMinusT))
      .add(p1.clone().multiplyScalar(oneMinusT * t))
      .add(p2.clone().multiplyScalar(t * t));
  };

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();

    if (startTime.current === null) {
      startTime.current = now;
    }

    if (!animationDone.current) {
      // Movement phase
      const elapsed = now - startTime.current;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      const pos = quadraticBezier(
        ease,
        startPos.current,
        controlPoint.current,
        endPos.current
      );
      camera.position.copy(pos);

      const centerTarget = new THREE.Vector3(...target);
      const sideOffsetAmount = 5;
      const sideDirection = new THREE.Vector3(1.1, -0.8, 0);

      const lookAtTarget = centerTarget
        .clone()
        .lerp(
          centerTarget
            .clone()
            .add(sideDirection.multiplyScalar(sideOffsetAmount)),
          ease
        );

      camera.lookAt(lookAtTarget);

      if (t === 1) {
        animationDone.current = true;
        holdStartTime.current = now;
        if (onAnimationComplete) onAnimationComplete();
      }
    } else if (!holdDone.current) {
      // Hold phase
      if (holdStartTime.current && now - holdStartTime.current >= holdTime) {
        holdDone.current = true;
      }
    }
  });

  return null;
}