"use client";

import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  KEY_LIGHT_POS,
  BLUE_LIGHT_POS,
  RED_LIGHT_POS,
  KEY_LIGHT_INTENSITY,
  BLUE_LIGHT_INTENSITY,
  RED_LIGHT_INTENSITY,
  SHADOW_BIAS,
  KEY_LIGHT_TARGET_POS,
  BLUE_LIGHT_TARGET_POS,
  RED_LIGHT_TARGET_POS,
  FLOOR_SIZE,
  FLOOR_Y,
  FLOOR_COLOR,
  FLOOR_METALNESS,
  FLOOR_ROUGHNESS,
  TEXT_SIZE,
  TEXT_COLOR,
  ROTATING_WORDS,
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
} from "./constants";
import CameraController from "./CameraController";
import CameraModel from "./CameraModel";
import TypewriterText from "./TypewriterText";
import LoadingFallback from "./LoadingFallback";
import { OrbitControls } from "@react-three/drei";
import GlowingText from "./GlowingText";
import CinematicFlyInCamera from "./CinematicFlyInCamera";

type BasicSceneProps = {
  isAnimating: boolean;
  onAnimationComplete: () => void;
};

export default function BasicScene({ isAnimating, onAnimationComplete }: BasicSceneProps) {
  // SpotLight refs
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const blueLightRef = useRef<THREE.SpotLight>(null);
  const redLightRef = useRef<THREE.SpotLight>(null);

  // Targets memoized once, to prevent re-creation every render
  const whiteTarget = useMemo(() => new THREE.Object3D(), []);
  const blueTarget = useMemo(() => new THREE.Object3D(), []);
  const redTarget = useMemo(() => new THREE.Object3D(), []);

  // Configure shadow camera once after mount
  useEffect(() => {
    if (!keyLightRef.current) return;

    const cam = keyLightRef.current.shadow.camera as THREE.PerspectiveCamera;
    cam.near = 1;
    cam.far = 100;
    cam.fov = 30;
    cam.updateProjectionMatrix();
  }, []);

  // Set spotlight target positions once after mount
  useEffect(() => {
    whiteTarget.position.copy(KEY_LIGHT_TARGET_POS);
    blueTarget.position.copy(BLUE_LIGHT_TARGET_POS);
    redTarget.position.copy(RED_LIGHT_TARGET_POS);
  }, [whiteTarget, blueTarget, redTarget]);

  return (
    <Canvas
      shadows
      camera={{ fov: 50 }}
      style={{ height: "100vh", width: "100vw" }}
      gl={{
        antialias: false,  // Disable native antialias for perf, consider FXAA postprocessing instead
        alpha: false,
        clearColor: "black",
      }}
      // dpr={Math.min(window.devicePixelRatio, 1.5)} // Cap device pixel ratio for performance
    >
      {/* Fog fades floor into darkness */}
      <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />

      {/* Animate camera fly-in only if isAnimating */}
      {isAnimating && (
        <CinematicFlyInCamera
          target={[0, 4, 0]}
          duration={3}
          curveHeight={8}
          onAnimationComplete={onAnimationComplete}
        />
      )}

      <CameraController />
      <ambientLight intensity={0.02} />

      {/* White key light with shadows */}
      <spotLight
        ref={keyLightRef}
        color="white"
        position={KEY_LIGHT_POS.toArray()}
        intensity={KEY_LIGHT_INTENSITY}
        angle={Math.PI / 24}
        penumbra={0.05}
        castShadow
        shadow-mapSize-width={2048}  // Reduced shadow map size for performance
        shadow-mapSize-height={2048}
        shadow-bias={SHADOW_BIAS}
        target={whiteTarget}
      />
      <primitive object={whiteTarget} />

      {/* Blue fill light (no shadows for better performance) */}
      <spotLight
        ref={blueLightRef}
        color="blue"
        position={BLUE_LIGHT_POS.toArray()}
        intensity={BLUE_LIGHT_INTENSITY}
        angle={Math.PI / 20}
        penumbra={0.1}
        target={blueTarget}
        castShadow={false}
      />
      <primitive object={blueTarget} />

      {/* Red fill light (no shadows for better performance) */}
      <spotLight
        ref={redLightRef}
        color="red"
        position={RED_LIGHT_POS.toArray()}
        intensity={RED_LIGHT_INTENSITY}
        angle={Math.PI / 20}
        penumbra={0.1}
        target={redTarget}
        castShadow={false}
      />
      <primitive object={redTarget} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial
          color={FLOOR_COLOR}
          metalness={FLOOR_METALNESS}
          roughness={FLOOR_ROUGHNESS}
        />
      </mesh>

      {/* Typewriter text only shown when not animating */}
      {!isAnimating && (
        <TypewriterText
          position={[5, 0, -3]}
          fontSize={TEXT_SIZE}
          color={TEXT_COLOR}
          rotation={[Math.PI / 1, Math.PI / -2, Math.PI / 1]}
          anchorX="center"
          anchorY="middle"
          castShadow
          baseText=""
          rotatingWords={ROTATING_WORDS}
          speed={100}
          pause={1500}
        />
      )}

      {/* Glowing texts */}
      <GlowingText
        text="Andre Camerino"
        size={0.5}
        position={[5, 1.5, -1]}
        rotation={[0, -1.6, 0]}
        glowIntensity={2}
        glowColor="orange"
        castShadow
      />

      <GlowingText
        text="Hi there!"
        fontPath="/fonts/courier_prime_regular.typeface.json"
        size={0.35}
        position={[5, 2.9, -3]}
        rotation={[0, -1.6, 0]}
        glowIntensity={1.5}
        glowColor="white"
        castShadow
      />

      <GlowingText
        text="My name is"
        fontPath="/fonts/courier_prime_regular.typeface.json"
        size={0.35}
        position={[5, 2.3, -2]}
        rotation={[0, -1.6, 0]}
        glowIntensity={1.5}
        glowColor="white"
        castShadow
      />

      <GlowingText
        text="and I am a"
        fontPath="/fonts/courier_prime_regular.typeface.json"
        size={0.35}
        position={[5, 0.9, -2.5]}
        rotation={[0, -1.6, 0]}
        glowIntensity={1.5}
        glowColor="white"
        castShadow
      />

      <GlowingText
        text="Welcome to my"
        fontPath="/fonts/courier_prime_regular.typeface.json"
        size={0.35}
        position={[3, 0.6, 5]}
        rotation={[0, 3.1, 0]}
        glowIntensity={1.5}
        glowColor="white"
        castShadow
      />

      <GlowingText
        text="Portfolio"
        size={0.5}
        position={[2, 0, 5]}
        rotation={[0, 3.1, 0]}
        glowIntensity={1.5}
        glowColor="orange"
        castShadow
      />

      {/* Model with fallback */}
      <Suspense fallback={<LoadingFallback />}>
        <CameraModel />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}