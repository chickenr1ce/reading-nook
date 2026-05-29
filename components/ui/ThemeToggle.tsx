"use client";

import { motion } from "motion/react";
import { Tree, Flower, MoonStars } from "@phosphor-icons/react";
import { useTheme, type Theme } from "./ThemeProvider";

const options: { id: Theme; label: string; icon: typeof Tree }[] = [
  { id: "forest", label: "Forest", icon: Tree },
  { id: "garden", label: "Garden", icon: Flower },
  { id: "starlight", label: "Starlight", icon: MoonStars },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-border/40">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.id;

        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              active
                ? "text-surface"
                : "text-text-secondary hover:text-text-primary"
            }`}
            aria-label={`${opt.label} theme`}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 bg-accent rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon size={14} weight={active ? "fill" : "regular"} className="relative z-10" />
            <span className="relative z-10 hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
