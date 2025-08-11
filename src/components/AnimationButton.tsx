"use client";

import React from "react";

type AnimationButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string; // extra classes if needed
};

export default function AnimationButton({
  onClick,
  children,
  className = "",
}: AnimationButtonProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`select-none cursor-pointer rounded bg-gray-800 text-white px-6 py-3
        transition-transform transform hover:scale-105 focus:scale-105
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        active:scale-95 ${className}`}
    >
      {children}
    </div>
  );
}
