"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A warm, pulsing fireplace glow at the bottom of the page.
 * Uses Motion's animate() loop for continuous subtle breathing — no React re-renders.
 */
export function Fireplace() {
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-10 h-64"
      aria-hidden="true"
    >
      {/* Warm amber glow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-full rounded-t-full"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(232,168,80,0.25) 0%, rgba(232,168,80,0.08) 40%, transparent 70%)",
        }}
        animate={
          reduce
            ? {}
            : {
                opacity: [0.6, 0.85, 0.6],
                scale: [1, 1.03, 1],
              }
        }
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Secondary warm glow — deeper, wider */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-48 rounded-t-full"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(61,107,79,0.12) 0%, rgba(61,107,79,0.04) 50%, transparent 70%)",
        }}
        animate={
          reduce
            ? {}
            : {
                opacity: [0.5, 0.7, 0.5],
              }
        }
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1.5,
        }}
      />
    </div>
  );
}
