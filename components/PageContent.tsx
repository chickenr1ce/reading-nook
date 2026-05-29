"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Nav } from "./ui/Nav";
import { Fireplace } from "./ambient/Fireplace";
import { FairyLights } from "./ambient/FairyLights";
import { GrainOverlay } from "./ambient/GrainOverlay";
import { Bookshelf } from "./shelf/Bookshelf";
import { RecCard } from "./recs/RecCard";
import { RecDrawer } from "./recs/RecDrawer";
import { CozyStats } from "./stats/CozyStats";
import { CheckInButton } from "./stats/CheckInButton";
import type { Book, Rec, DailyCheckInStatus, StreakData, UserId } from "@/types";

interface PageContentProps {
  initialBooks: Book[];
  initialCheckin: DailyCheckInStatus;
  initialRecs: Rec[];
}

export function PageContent({
  initialBooks,
  initialCheckin,
  initialRecs,
}: PageContentProps) {
  const [activeShelf, setActiveShelf] = useState<UserId>("you");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [recs, setRecs] = useState<Rec[]>(initialRecs);
  const [checkinStatus, setCheckinStatus] = useState(initialCheckin);

  const shelfBookCount = books.filter((b) => b.owner === activeShelf).length;

  const refreshRecs = useCallback(async () => {
    const res = await fetch(`/api/recs?for=${activeShelf}`);
    if (res.ok) {
      const data = await res.json();
      setRecs(data);
    }
  }, [activeShelf]);

  useEffect(() => {
    refreshRecs();
  }, [refreshRecs]);

  async function handleSendRec(input: {
    from: UserId;
    to: UserId;
    bookTitle: string;
    bookAuthor: string;
    note: string;
  }) {
    const res = await fetch("/api/recs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (res.ok) {
      refreshRecs();
    }
  }

  async function handleMarkRecRead(id: string) {
    const res = await fetch(`/api/recs/${id}`, { method: "PATCH" });
    if (res.ok) {
      setRecs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, read: true } : r))
      );
    }
  }

  function handleCheckedIn(status: DailyCheckInStatus, _streaks: StreakData) {
    setCheckinStatus(status);
  }

  function handleShelfChange(user: UserId) {
    setActiveShelf(user);
  }

  const unreadRecs = recs.filter((r) => !r.read);

  return (
    <>
      <GrainOverlay />
      <Nav />

      <main className="relative flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-24">
        <div className="relative mt-4 space-y-6">
          <FairyLights />

          {/* Slim stats bar */}
          <CozyStats bookCount={shelfBookCount} activeShelf={activeShelf} />

          {/* Calendar + streak */}
          <CheckInButton userId={activeShelf} onCheckedIn={handleCheckedIn} />

          {/* Bookshelf — rec button lives in its header */}
          <Bookshelf
            initialBooks={initialBooks}
            activeShelf={activeShelf}
            onShelfChange={handleShelfChange}
            onBooksChanged={setBooks}
            recDrawer={
              <RecDrawer
                from={activeShelf}
                to={activeShelf === "you" ? "her" : "you"}
                onSend={handleSendRec}
              />
            }
          />

          {/* Recommendations received */}
          {unreadRecs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Recommendations for {activeShelf === "you" ? "Alexiz" : "Ying"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unreadRecs.map((rec) => (
                  <RecCard key={rec.id} rec={rec} onMarkRead={handleMarkRecRead} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Fireplace />
    </>
  );
}
