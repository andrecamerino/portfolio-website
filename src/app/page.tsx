import React from "react";
import BasicScene from "@/components/three/BasicScene";
import AnimationButton from "@/components/AnimationButton";

export default function Page() {
  return (
    <>
      <div>
        <BasicScene />
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
        <AnimationButton>Click Me</AnimationButton>
      </div>
    </>
  );
}