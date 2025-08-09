"use client";

import React, { useEffect, useState, useRef } from "react";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

type GlowingTextProps = {
  text: string;
  size?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  glowIntensity?: number;
  glowColor?: string;
  fontPath?: string;  // NEW prop
} & JSX.IntrinsicElements["group"];

export default function GlowingText({
  text,
  size = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  glowIntensity = 1,
  glowColor = "white",
  fontPath = "/fonts/dm_serif_italic.typeface.json",  // default path
  ...props
}: GlowingTextProps) {
  const [font, setFont] = useState<THREE.Font | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Load font once on mount or when fontPath changes
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      fontPath,
      (loadedFont) => setFont(loadedFont),
      undefined,
      (err) => console.error("Font load error", err)
    );
  }, [fontPath]);

  // Update geometry when text, font, or size changes
  useEffect(() => {
    if (!font || !meshRef.current) return;

    const textGeo = new TextGeometry(text, {
      font,
      size,
      depth: 0.05,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textGeo.computeBoundingBox();
    // Left aligned

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = textGeo;
  }, [text, font, size]);

  if (!font) return null;

  return (
    <>
      <group position={position} rotation={rotation} {...props}>
        <mesh ref={meshRef}>
          <meshStandardMaterial
            color="white"
            emissive={glowColor}
            emissiveIntensity={glowIntensity / 3}
          />
        </mesh>
      </group>

      <EffectComposer>
        <Bloom
          intensity={glowIntensity}
          luminanceThreshold={0}
          luminanceSmoothing={0.2}
          kernelSize={3}
        />
      </EffectComposer>
    </>
  );
}