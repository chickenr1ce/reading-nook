"use client";

import { motion } from "motion/react";
import { displayName } from "@/lib/names";
import type { UserId } from "@/types";

interface ShelfToggleProps {
  active: UserId;
  onChange: (user: UserId) => void;
}

export function ShelfToggle({ active, onChange }: ShelfToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-border/40">
      {(["you", "her"] as UserId[]).map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative px-5 py-2 text-sm font-medium rounded-full transition-colors ${
            active === id
              ? "text-cream-warm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {active === id && (
            <motion.span
              layoutId="shelf-pill"
              className="absolute inset-0 bg-accent rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{displayName(id)}&rsquo;s Shelf</span>
        </button>
      ))}
    </div>
  );
}
