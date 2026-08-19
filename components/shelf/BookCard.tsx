"use client";

import { motion } from "motion/react";
import { Star } from "@phosphor-icons/react";
import { BookPlaceholder } from "@/components/ui/BookPlaceholder";
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
        <Star
          key={star}
          size={14}
          weight={star <= rating ? "fill" : "regular"}
          className={
            star <= rating
              ? "text-amber"
              : "text-border dark:text-border/50"
          }
        />
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
          <div className="w-full h-full bg-accent/10 text-accent p-4">
            <BookPlaceholder className="w-8 h-8 opacity-50" title={book.title} />
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
