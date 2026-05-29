"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "@phosphor-icons/react";
import type { BookStatus, UserId } from "@/types";

interface AddBookFormProps {
  owner: UserId;
  onAdd: (book: {
    title: string;
    author: string;
    coverUrl?: string;
    status: BookStatus;
    rating: number;
    notes: string;
    owner: UserId;
  }) => void;
}

const statusOptions: { value: BookStatus; label: string }[] = [
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
  { value: "want-to-read", label: "Want to read" },
];

export function AddBookForm({ owner, onAdd }: AddBookFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<BookStatus>("want-to-read");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function reset() {
    setTitle("");
    setAuthor("");
    setCoverUrl("");
    setStatus("want-to-read");
    setNotes("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSubmitting(true);
    onAdd({
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim() || undefined,
      status,
      rating: 0,
      notes: notes.trim(),
      owner,
    });
    reset();
    setOpen(false);
    setSubmitting(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full bg-accent text-cream-warm hover:bg-accent-hover transition-colors"
      >
        <Plus size={16} weight="bold" />
        Add a book
      </button>

      {/* Dropdown panel — absolutely positioned, doesn't shift layout */}
      <AnimatePresence>
        {open && (
          <motion.form
            onSubmit={handleSubmit}
            className="absolute right-0 top-full mt-2 z-20 w-80 rounded-2xl bg-surface-elevated border border-border p-5 space-y-4"
            style={{
              boxShadow:
                "0 8px 32px rgba(44,36,27,0.12), 0 2px 8px rgba(44,36,27,0.08)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                Add to {owner === "you" ? "Alexiz" : "Ying"}&rsquo;s shelf
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="The Name of the Wind"
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Author *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Patrick Rothfuss"
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Cover image URL (optional)
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">
                Status
              </label>
              <div className="flex gap-1.5">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      status === opt.value
                        ? "bg-accent text-cream-warm"
                        : "bg-border/30 text-text-secondary hover:bg-border/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="A little note about this book..."
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting || !title.trim() || !author.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-full bg-accent text-cream-warm hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding..." : "Add to shelf"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-full bg-border/30 text-text-secondary hover:bg-border/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
