"use client";

import { displayName } from "@/lib/names";
import type { UserId } from "@/types";

interface CozyStatsProps {
  bookCount: number;
  activeShelf: UserId;
}

export function CozyStats({ bookCount, activeShelf }: CozyStatsProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-secondary">
      <span className="font-mono text-sm text-text-primary font-medium">
        {bookCount}
      </span>
      <span>
        {bookCount === 1 ? "book" : "books"} on{" "}
        {displayName(activeShelf)}&rsquo;s shelf
      </span>
    </div>
  );
}
