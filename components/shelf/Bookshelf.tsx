"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Books } from "@phosphor-icons/react";
import { ShelfToggle } from "./ShelfToggle";
import { BookCard } from "./BookCard";
import { BookDetail } from "./BookDetail";
import { AddBookForm } from "./AddBookForm";
import { displayName } from "@/lib/names";
import type { Book, BookStatus, UserId } from "@/types";

interface BookshelfProps {
  initialBooks: Book[];
  activeShelf: UserId;
  onShelfChange: (user: UserId) => void;
  onBooksChanged?: (books: Book[]) => void;
  recDrawer?: React.ReactNode;
}

export function Bookshelf({
  initialBooks,
  activeShelf,
  onShelfChange,
  onBooksChanged,
  recDrawer,
}: BookshelfProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  const shelfBooks = books.filter((b) => b.owner === activeShelf);

  // Notify parent when books change — deferred to avoid setState-during-render
  useEffect(() => {
    onBooksChanged?.(books);
  }, [books, onBooksChanged]);

  const refreshBooks = useCallback(async () => {
    const res = await fetch(`/api/books?owner=${activeShelf}`);
    if (res.ok) {
      const data = await res.json();
      setBooks((prev) => {
        const other = prev.filter((b) => b.owner !== activeShelf);
        return [...other, ...data];
      });
    }
  }, [activeShelf]);

  // Refresh when shelf changes
  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  async function handleAddBook(input: {
    title: string;
    author: string;
    coverUrl?: string;
    status: BookStatus;
    rating: number;
    notes: string;
    owner: UserId;
  }) {
    setLoading(true);
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      const newBook = await res.json();
      setBooks((prev) => [...prev, newBook]);
    }
    setLoading(false);
  }

  async function handleUpdateBook(
    id: string,
    patch: Partial<Pick<Book, "title" | "author" | "status" | "rating" | "notes" | "coverUrl">>
  ) {
    const res = await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setSelectedBook((prev) => (prev?.id === id ? updated : prev));
    }
  }

  async function handleDeleteBook(id: string) {
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setSelectedBook(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ShelfToggle active={activeShelf} onChange={onShelfChange} />
        <div className="flex items-center gap-2">
          {recDrawer}
          <AddBookForm owner={activeShelf} onAdd={handleAddBook} />
        </div>
      </div>

      {/* Books grid */}
      {shelfBooks.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Books size={28} className="text-accent/50" weight="duotone" />
          </div>
          <p className="text-sm text-text-secondary max-w-[24ch]">
            {activeShelf === "you"
              ? `${displayName("you")}'s shelf is empty. Add the first book!`
              : `${displayName("her")}'s shelf is empty. No books yet.`}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {shelfBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <BookCard book={book} onClick={() => setSelectedBook(book)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail modal */}
      <BookDetail
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <span className="px-4 py-2 text-xs font-medium rounded-full bg-accent text-cream-warm animate-float-up">
            Added!
          </span>
        </div>
      )}
    </div>
  );
}
