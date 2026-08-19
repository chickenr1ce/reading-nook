import React from "react";

interface DiamondDotProps {
  color?: "accent" | "amber" | "text-secondary";
  className?: string;
  title?: string;
  size?: string;
}

const COLOR_CLASSES = {
  accent: "bg-accent",
  amber: "bg-amber",
  "text-secondary": "bg-text-secondary",
};

export function DiamondDot({
  color = "accent",
  className = "",
  title,
  size = "w-2.5 h-2.5",
}: DiamondDotProps) {
  const bgClass = COLOR_CLASSES[color] || COLOR_CLASSES.accent;

  return (
    <span
      className={`inline-block shrink-0 ${size} ${bgClass} ${className}`}
      style={{
        clipPath:
          "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)",
      }}
      title={title}
      aria-hidden={!title}
    />
  );
}
