"use client";
import React from "react";
import { Text } from "@react-three/drei";

export default function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <Text fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        Loading...
      </Text>
    </mesh>
  );
}