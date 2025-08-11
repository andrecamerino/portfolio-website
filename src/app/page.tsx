"use client"

import React, { useState } from "react";
import BasicScene from "@/components/three/BasicScene";
import AnimationButton from "@/components/AnimationButton";

export default function Page() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>
      <div>
        <BasicScene isAnimating={isAnimating}/>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
        <AnimationButton onClick={() => setIsAnimating(true)}>Lets get started</AnimationButton>
      </div>
    </>
  );
}