"use client";

import { useState, useCallback } from "react";
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
import { SectionErrorBoundary } from "./ui/SectionErrorBoundary";
import { WarningCircle } from "@phosphor-icons/react";
import { displayName, getPartnerId } from "@/lib/names";
import type { Book, Rec, DailyCheckInStatus, UserId } from "@/types";

interface PageContentProps {
  initialBooks: Book[];
  initialCheckin: DailyCheckInStatus;
  initialRecs: Rec[];
  dbError?: string | null;
}

export function PageContent({
  initialBooks,
  initialRecs,
  dbError,
}: PageContentProps) {
  const [activeShelf, setActiveShelf] = useState<UserId>("you");
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [recs, setRecs] = useState<Rec[]>(initialRecs);

  const shelfBookCount = books.filter((b) => b.owner === activeShelf).length;

  const refreshRecs = useCallback(async (forUser: UserId = activeShelf) => {
    try {
      const res = await fetch(`/api/recs?for=${forUser}`);
      if (res.ok) {
        const data = await res.json();
        setRecs(data);
      }
    } catch (err) {
      console.error("Failed to fetch recs:", err);
    }
  }, [activeShelf]);

  async function handleSendRec(input: {
    from: UserId;
    to: UserId;
    bookTitle: string;
    bookAuthor: string;
    note: string;
  }) {
    try {
      const res = await fetch("/api/recs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        refreshRecs();
      }
    } catch (err) {
      console.error("Failed to send rec:", err);
    }
  }

  async function handleMarkRecRead(id: string) {
    try {
      const res = await fetch(`/api/recs/${id}`, { method: "PATCH" });
      if (res.ok) {
        setRecs((prev) =>
          prev.map((r) => (r.id === id ? { ...r, read: true } : r))
        );
      }
    } catch (err) {
      console.error("Failed to mark rec read:", err);
    }
  }

  function handleShelfChange(user: UserId) {
    setActiveShelf(user);
    refreshRecs(user);
  }

  const unreadRecs = recs.filter((r) => !r.read);

  return (
    <>
      <GrainOverlay />
      <Nav />

      <main className="relative flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-24">
        <div className="relative mt-4 space-y-6">
          {dbError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber/10 border border-amber/30 text-amber text-xs leading-relaxed">
              <WarningCircle size={18} weight="bold" className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-0.5">Database setup required</p>
                <p className="text-text-secondary">
                  Redis is not connected ({dbError}). In your Vercel Project Settings under <strong className="text-text-primary">Environment Variables</strong>, ensure <code className="bg-amber/15 px-1 py-0.5 rounded">UPSTASH_REDIS_REST_URL</code> and <code className="bg-amber/15 px-1 py-0.5 rounded">UPSTASH_REDIS_REST_TOKEN</code> (or <code className="bg-amber/15 px-1 py-0.5 rounded">KV_REST_API_URL</code> and <code className="bg-amber/15 px-1 py-0.5 rounded">KV_REST_API_TOKEN</code>) are set.
                </p>
              </div>
            </div>
          )}

          <FairyLights />

          {/* Slim stats bar */}
          <SectionErrorBoundary fallbackTitle="Stats unavailable">
            <CozyStats bookCount={shelfBookCount} activeShelf={activeShelf} />
          </SectionErrorBoundary>

          {/* Calendar + streak */}
          <SectionErrorBoundary fallbackTitle="Check-in calendar unavailable">
            <CheckInButton userId={activeShelf} />
          </SectionErrorBoundary>

          {/* Bookshelf — rec button lives in its header */}
          <SectionErrorBoundary fallbackTitle="Bookshelf unavailable">
            <Bookshelf
              books={books}
              setBooks={setBooks}
              activeShelf={activeShelf}
              onShelfChange={handleShelfChange}
              recDrawer={
                <RecDrawer
                  from={activeShelf}
                  to={getPartnerId(activeShelf)}
                  onSend={handleSendRec}
                />
              }
            />
          </SectionErrorBoundary>

          {/* Recommendations received */}
          {unreadRecs.length > 0 && (
            <SectionErrorBoundary fallbackTitle="Recommendations unavailable">
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Recommendations for {displayName(activeShelf)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unreadRecs.map((rec) => (
                    <RecCard key={rec.id} rec={rec} onMarkRead={handleMarkRecRead} />
                  ))}
                </div>
              </motion.section>
            </SectionErrorBoundary>
          )}
        </div>
      </main>

      <Fireplace />
    </>
  );
}
