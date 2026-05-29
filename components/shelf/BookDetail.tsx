"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star as StarIcon, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import type { Book, BookStatus } from "@/types";

interface BookDetailProps {
  book: Book | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Pick<Book, "title" | "author" | "status" | "rating" | "notes" | "coverUrl">>) => void;
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
  const [draftTitle, setDraftTitle] = useState(book?.title ?? "");
  const [draftAuthor, setDraftAuthor] = useState(book?.author ?? "");
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl ?? "");
  const [coverSearching, setCoverSearching] = useState(false);
  const [coverResult, setCoverResult] = useState<"idle" | "found" | "not_found">("idle");
  const [draftNotes, setDraftNotes] = useState(book?.notes ?? "");

  // Sync local state when book changes (different book selected)
  useEffect(() => {
    if (!book) return;
    setDraftTitle(book.title);
    setDraftAuthor(book.author);
    setCoverUrl(book.coverUrl ?? "");
    setDraftNotes(book.notes ?? "");
    setRating(book.rating);
    setCoverResult("idle");
  }, [book?.id]);

  if (!book) return null;

  const displayRating = hoverStar || rating;

  function handleRating(star: number) {
    setRating(star);
    onUpdate(book!.id, { rating: star });
  }

  function handleStatusChange(status: BookStatus) {
    onUpdate(book!.id, { status });
  }

  function handleCoverChange(url: string) {
    setCoverUrl(url);
    onUpdate(book!.id, { coverUrl: url.trim() || undefined });
    setCoverResult("idle");
  }

  async function handleFindCover() {
    if (!book) return;
    const searchTitle = draftTitle || book.title;
    const searchAuthor = draftAuthor || book.author;
    if (!searchTitle || !searchAuthor) return;
    setCoverSearching(true);
    setCoverResult("idle");
    try {
      const params = new URLSearchParams({
        title: searchTitle,
        author: searchAuthor,
      });
      const res = await fetch(`/api/covers?${params}`);
      const data = await res.json();
      if (data.coverUrl) {
        setCoverUrl(data.coverUrl);
        onUpdate(book.id, { coverUrl: data.coverUrl });
        setCoverResult("found");
      } else {
        setCoverResult("not_found");
      }
    } catch {
      setCoverResult("not_found");
    } finally {
      setCoverSearching(false);
    }
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
            <div className="space-y-2">
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={() => {
                  const trimmed = draftTitle.trim();
                  if (trimmed && trimmed !== book.title) {
                    onUpdate(book.id, { title: trimmed });
                  }
                }}
                placeholder="Title"
                className="w-full text-lg font-semibold text-text-primary bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors pb-0.5 placeholder:text-text-secondary/40"
              />
              <input
                type="text"
                value={draftAuthor}
                onChange={(e) => setDraftAuthor(e.target.value)}
                onBlur={() => {
                  const trimmed = draftAuthor.trim();
                  if (trimmed && trimmed !== book.author) {
                    onUpdate(book.id, { author: trimmed });
                  }
                }}
                placeholder="Author"
                className="w-full text-sm text-text-secondary bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors pb-0.5 placeholder:text-text-secondary/40"
              />
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
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Notes
              </label>
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                onBlur={() => {
                  const trimmed = draftNotes.trim();
                  if (trimmed !== (book.notes ?? "")) {
                    onUpdate(book.id, { notes: trimmed });
                  }
                }}
                rows={3}
                placeholder="Thoughts, quotes, reactions…"
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
              />
            </div>

            {/* Cover image */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-text-secondary">
                  Cover image
                </label>
                <button
                  type="button"
                  onClick={handleFindCover}
                  disabled={coverSearching}
                  className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MagnifyingGlass size={12} weight="bold" />
                  {coverSearching ? "Searching…" : "Find cover"}
                </button>
              </div>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => handleCoverChange(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              {coverResult === "not_found" && (
                <p className="mt-1 text-xs text-text-secondary/70">
                  No cover found — try pasting one manually
                </p>
              )}
              {coverResult === "found" && (
                <p className="mt-1 text-xs text-green-600">Cover found ✓</p>
              )}
            </div>

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
