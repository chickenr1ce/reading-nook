"use client";

import { BookOpen } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookOpen size={18} className="text-accent" weight="duotone" />
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            The Reading Nook
          </span>
        </div>

        {/* Right side — theme toggle */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
