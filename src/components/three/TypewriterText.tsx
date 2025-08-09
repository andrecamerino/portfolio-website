"use client";

import React, { useEffect, useState, useRef } from "react";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

type TypewriterTextProps = {
  baseText: string;
  rotatingWords: string[];
  speed?: number;
  pause?: number;
} & JSX.IntrinsicElements["group"];

export default function TypewriterText({
  baseText,
  rotatingWords,
  speed = 100,
  pause = 1500,
  ...props
}: TypewriterTextProps) {
  const [font, setFont] = useState<THREE.Font | null>(null);
  const [displayedText, setDisplayedText] = useState(baseText);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const meshRef = useRef<THREE.Mesh>(null);

  // Load font once on mount
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "/fonts/dm_serif_italic.typeface.json",
      (loadedFont) => setFont(loadedFont),
      undefined,
      (err) => console.error("Font load error", err)
    );
  }, []);

  // Caret blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCaretVisible((v) => !v);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Typing effect logic
  useEffect(() => {
    if (!font) return;

    const currentWord = rotatingWords[wordIndex];
    const fullText = `${baseText}${currentWord}`;
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(fullText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, speed);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (charIndex > baseText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(fullText.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        }, speed / 2);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex(() => Math.floor(Math.random() * rotatingWords.length));
        }, pause / 2);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, baseText, rotatingWords, wordIndex, speed, pause, font]);

  // Update text geometry when displayedText or caret changes
  useEffect(() => {
    if (!font || !meshRef.current) return;

    const textToShow = displayedText + (caretVisible ? "|" : "");
    const textGeo = new TextGeometry(textToShow, {
      font: font,
      size: 0.5,
      depth: 0.05,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textGeo.computeBoundingBox();
    // Left aligned: no centering offset

    meshRef.current.geometry.dispose();
    meshRef.current.geometry = textGeo;
  }, [displayedText, font, caretVisible]);

  if (!font) return null;

  return (
    <>
      <group {...props}>
        <mesh ref={meshRef}>
          <meshStandardMaterial
            color="white"
            emissive="purple"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* Subtle glow effect */}
      <EffectComposer>
        <Bloom intensity={3} luminanceThreshold={0} luminanceSmoothing={0.2} />
      </EffectComposer>
    </>
  );
}