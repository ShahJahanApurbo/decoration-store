"use client";
import * as React from "react";

interface CarouselNavButtonProps {
  direction: "prev" | "next";
  className?: string;
  onClick?: () => void; // (reserved) in case manual binding is needed
}

export const CarouselNavButton: React.FC<CarouselNavButtonProps> = ({
  direction,
  className = "",
}) => {
  const isPrev = direction === "prev";
  const path = isPrev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7";
  return (
    <button
      aria-label={`${isPrev ? "Previous" : "Next"} slide`}
      className={`${className} pointer-events-auto group p-2 rounded-full bg-white/90 hover:bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
    >
      <svg
        className={`w-4 h-4 text-neutral-700 transition-transform ${
          isPrev
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={path}
        />
      </svg>
    </button>
  );
};
