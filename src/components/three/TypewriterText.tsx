"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

type TypewriterTextProps = {
  baseText: string;
  rotatingWords: string[];
  speed?: number;       // typing speed in ms per character
  pause?: number;       // pause after typing/deleting word
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
  const wordIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const caretVisible = useRef(true);
  const meshRef = useRef<THREE.Mesh>(null);
  const animationFrame = useRef<number>();
  const lastTimestamp = useRef(0);
  const nextCharTime = useRef(0);
  const pauseUntil = useRef(0);

  // Load font once
  useEffect(() => {
    new FontLoader().load(
      "/fonts/dm_serif_italic.typeface.json",
      setFont,
      undefined,
      (err) => console.error("Font load error", err)
    );
  }, []);

  // Blink caret with RAF
  useEffect(() => {
    function blink(timestamp: number) {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      if (timestamp - lastTimestamp.current >= 500) {
        caretVisible.current = !caretVisible.current;
        lastTimestamp.current = timestamp;
      }
      animationFrame.current = requestAnimationFrame(blink);
    }
    animationFrame.current = requestAnimationFrame(blink);
    return () => animationFrame.current && cancelAnimationFrame(animationFrame.current);
  }, []);

  // Main typewriter animation with RAF
  useEffect(() => {
    if (!font) return;

    function tick(timestamp: number) {
      if (!nextCharTime.current) nextCharTime.current = timestamp;
      if (timestamp < pauseUntil.current) {
        animationFrame.current = requestAnimationFrame(tick);
        return;
      }

      if (timestamp >= nextCharTime.current) {
        const currentWord = rotatingWords[wordIndex.current];
        const fullText = baseText + currentWord;

        if (!isDeleting.current) {
          if (charIndex.current < fullText.length) {
            charIndex.current++;
            setDisplayedText(fullText.slice(0, charIndex.current));
            nextCharTime.current = timestamp + speed;
          } else {
            isDeleting.current = true;
            pauseUntil.current = timestamp + pause;
          }
        } else {
          if (charIndex.current > baseText.length) {
            charIndex.current--;
            setDisplayedText(fullText.slice(0, charIndex.current));
            nextCharTime.current = timestamp + speed / 2;
          } else {
            isDeleting.current = false;
            wordIndex.current = Math.floor(Math.random() * rotatingWords.length);
            pauseUntil.current = timestamp + pause / 2;
          }
        }
      }
      animationFrame.current = requestAnimationFrame(tick);
    }

    animationFrame.current = requestAnimationFrame(tick);
    return () => animationFrame.current && cancelAnimationFrame(animationFrame.current);
  }, [baseText, rotatingWords, speed, pause, font]);

  // Update geometry only if text or caret changes
  useEffect(() => {
    if (!font || !meshRef.current) return;

    let lastText = "";
    function updateGeometry() {
      const textToShow = displayedText + (caretVisible.current ? "|" : "");
      if (textToShow === lastText) return; // skip if no change
      lastText = textToShow;

      const textGeo = new TextGeometry(textToShow, {
        font,
        size: 0.5,
        depth: 0.05,
        curveSegments: 12,
        bevelEnabled: false,
      });

      textGeo.computeBoundingBox();

      meshRef.current.geometry.dispose();
      meshRef.current.geometry = textGeo;
    }

    updateGeometry();

    // Update on caret blink using RAF for smoothness
    let rafId: number;
    function animate() {
      updateGeometry();
      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [displayedText, font]);

  if (!font) return null;

  return (
    <>
      <group {...props}>
        <mesh ref={meshRef}>
          <meshStandardMaterial color="white" emissive="purple" emissiveIntensity={2} />
        </mesh>
      </group>

      <EffectComposer>
        <Bloom intensity={3} luminanceThreshold={0} luminanceSmoothing={0.2} />
      </EffectComposer>
    </>
  );
}