"use client";

import { useReducedMotion } from "motion/react";

/**
 * A strand of twinkling fairy lights along the top of the bookshelf.
 * Pure CSS animation with staggered delays — no JS runtime cost.
 */
export function FairyLights() {
  const reduce = useReducedMotion();

  // 12 lights across the strand
  const lights = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      className="relative w-full h-8 mb-2 pointer-events-none"
      aria-hidden="true"
    >
      {/* The wire — a subtle curved line */}
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
      >
        <path
          d="M0,28 Q150,8 300,24 Q450,12 600,22 Q750,6 900,20 Q1050,10 1200,26"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-oak/30 dark:text-oak-light/20"
        />
      </svg>

      {/* The bulbs */}
      <div className="absolute top-0 left-0 w-full flex justify-around px-4">
        {lights.map((i) => (
          <div
            key={i}
            className="relative flex flex-col items-center"
            style={{
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {/* Wire drop */}
            <div className="w-px h-2 bg-oak/40 dark:bg-oak-light/30" />
            {/* Bulb glow */}
            <div
              className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_6px_2px_rgba(232,168,80,0.5)]"
              style={
                reduce
                  ? { opacity: 0.7 }
                  : {
                      animation: "twinkle 2.5s ease-in-out infinite",
                      animationDelay: `${i * 0.35}s`,
                    }
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
