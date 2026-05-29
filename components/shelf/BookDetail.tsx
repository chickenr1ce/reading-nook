"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star as StarIcon, Trash } from "@phosphor-icons/react";
import type { Book, BookStatus } from "@/types";

interface BookDetailProps {
  book: Book | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Pick<Book, "status" | "rating" | "notes">>) => void;
  onDelete: (id: string) => void;
}

const statusOptions: { value: BookStatus; label: string }[] = [
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
  { value: "want-to-read", label: "Want to read" },
];

export function BookDetail({ book, onClose, onUpdate, onDelete }: BookDetailProps) {
  const [rating, setRating] = useState(book?.rating ?? 0);
  const [hoverStar, setHoverStar] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!book) return null;

  const displayRating = hoverStar || rating;

  function handleRating(star: number) {
    setRating(star);
    onUpdate(book!.id, { rating: star });
  }

  function handleStatusChange(status: BookStatus) {
    onUpdate(book!.id, { status });
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-brown-ink/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel */}
        <motion.div
          className="relative w-full max-w-md bg-surface-elevated border border-border rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 8px 40px rgba(44,36,27,0.12), 0 2px 8px rgba(44,36,27,0.08)",
          }}
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          {/* Header image */}
          <div className="relative h-48 bg-accent/10">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-accent/30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary leading-snug">
                {book.title}
              </h2>
              <p className="text-sm text-text-secondary">{book.author}</p>
            </div>

            {/* Status selector */}
            <div className="flex gap-1.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    book.status === opt.value
                      ? "bg-accent text-cream-warm"
                      : "bg-border/30 text-text-secondary hover:bg-border/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Rating */}
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <StarIcon
                      size={22}
                      weight={star <= displayRating ? "fill" : "regular"}
                      className={
                        star <= displayRating
                          ? "text-amber"
                          : "text-border dark:text-border/50"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            {book.notes && (
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">
                  Notes
                </label>
                <p className="text-sm text-text-primary leading-relaxed bg-border/20 rounded-lg p-3">
                  {book.notes}
                </p>
              </div>
            )}

            {/* Delete */}
            <div className="pt-3 border-t border-border">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">
                    Remove this book?
                  </span>
                  <button
                    onClick={() => {
                      onDelete(book.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-rose-600/10 text-rose-600 hover:bg-rose-600/20 transition-colors"
                  >
                    Yes, remove
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-border/30 text-text-secondary hover:bg-border/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-rose-500 transition-colors"
                >
                  <Trash size={13} weight="regular" />
                  Remove from shelf
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
