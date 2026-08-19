import React from "react";

interface BookPlaceholderProps {
  className?: string;
  size?: number | string;
  title?: string;
}

export function BookPlaceholder({
  className = "w-12 h-12 text-accent/30",
  size,
  title,
}: BookPlaceholderProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
      {title && (
        <span className="text-xs text-center leading-tight opacity-60 line-clamp-3 px-2">
          {title}
        </span>
      )}
    </div>
  );
}
