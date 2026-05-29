"use client";

import { motion } from "motion/react";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const statusLabels: Record<Book["status"], string> = {
  reading: "Reading",
  finished: "Finished",
  "want-to-read": "Want to read",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "text-amber"
              : "text-border dark:text-border/50"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl bg-surface-elevated border border-border/60 p-4 text-left cursor-pointer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        boxShadow: "0 1px 3px rgba(44,36,27,0.06), 0 4px 12px rgba(44,36,27,0.04)",
      }}
    >
      {/* Shelf ledge */}
      <div className="absolute -bottom-1 left-2 right-2 h-1 rounded-b-sm bg-oak/20 dark:bg-oak-light/15" />

      {/* Cover or placeholder */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-border/30">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-accent/10 text-accent p-4">
            <svg
              className="w-8 h-8 opacity-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            <span className="text-xs text-center leading-tight opacity-60 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-text-secondary">{book.author}</p>

        <div className="flex items-center gap-2 pt-1">
          <Stars rating={book.rating} />
        </div>

        <span
          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${
            book.status === "reading"
              ? "bg-amber/15 text-amber dark:bg-amber/20"
              : book.status === "finished"
                ? "bg-accent/15 text-accent"
                : "bg-border/40 text-text-secondary"
          }`}
        >
          {statusLabels[book.status]}
        </span>
      </div>
    </motion.button>
  );
}
