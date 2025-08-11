"use client";

import React, { useState, useCallback } from "react";
import BasicScene from "@/components/three/BasicScene";
import AnimationButton from "@/components/AnimationButton";

export default function Page() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const handleButtonClick = useCallback(() => {
    setButtonPressed(true);
    setIsAnimating(true);

    // Delay website fade-in
    setTimeout(() => {
      setShowWebsite(true);
    }, 2500);
  }, []);

  return (
    <>
      {/* 3D scene container */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          showWebsite ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <BasicScene
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationEnd}
        />
      </div>

      {/* Website content */}
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-400 transform ${
          showWebsite
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {/* place main page component here */}
        <h1 className="text-4xl font-bold text-black">Welcome to the website!</h1>
      </div>

      {/* Button */}
      {!showWebsite && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-700 ${
            buttonPressed
              ? "opacity-0 scale-110 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <AnimationButton onClick={handleButtonClick}>
            Let's get started
          </AnimationButton>
        </div>
      )}
    </>
  );
}