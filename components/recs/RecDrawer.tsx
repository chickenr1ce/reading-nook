"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, X } from "@phosphor-icons/react";
import { displayName } from "@/lib/names";
import type { UserId } from "@/types";

interface RecDrawerProps {
  from: UserId;
  to: UserId;
  onSend: (rec: {
    from: UserId;
    to: UserId;
    bookTitle: string;
    bookAuthor: string;
    note: string;
  }) => void;
}

export function RecDrawer({ from, to, onSend }: RecDrawerProps) {
  const [open, setOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function reset() {
    setBookTitle("");
    setBookAuthor("");
    setNote("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bookTitle.trim() || !bookAuthor.trim()) return;

    onSend({
      from,
      to,
      bookTitle: bookTitle.trim(),
      bookAuthor: bookAuthor.trim(),
      note: note.trim(),
    });
    reset();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1500);
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full bg-amber/15 text-amber dark:bg-amber/20 hover:bg-amber/20 dark:hover:bg-amber/25 transition-colors"
      >
        <Gift size={16} weight="bold" />
        Leave a rec
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-brown-ink/30 dark:bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-surface-elevated border-l border-border overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-text-primary">
                    Leave a recommendation
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X size={18} weight="bold" />
                  </button>
                </div>

                {sent ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-16 gap-3 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Gift size={24} className="text-accent" weight="fill" />
                    </div>
                    <p className="text-sm font-medium text-text-primary">
                      Recommendation sent!
                    </p>
                    <p className="text-xs text-text-secondary">
                      It will appear on {displayName(to)}&rsquo;s shelf.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        For
                      </label>
                      <p className="text-sm text-text-primary font-medium">
                        {displayName(to)}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        Book title *
                      </label>
                      <input
                        type="text"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        required
                        placeholder="A Court of Thorns and Roses"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        Author *
                      </label>
                      <input
                        type="text"
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        required
                        placeholder="Sarah J. Maas"
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        Note (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="I think you'd love this one..."
                        className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={!bookTitle.trim() || !bookAuthor.trim()}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-full bg-amber text-brown-ink hover:bg-amber-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Send recommendation
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
