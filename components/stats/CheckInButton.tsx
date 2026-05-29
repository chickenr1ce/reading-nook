"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Fire, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { displayName } from "@/lib/names";
import type { DailyCheckInStatus, StreakData, MonthCheckins, UserId } from "@/types";

interface CheckInButtonProps {
  userId: UserId;
  onCheckedIn: (status: DailyCheckInStatus, streaks: StreakData) => void;
}

interface FullStatus {
  status: DailyCheckInStatus;
  streaks: StreakData;
  month: MonthCheckins | null;
}

function buildMonthGrid(yearMonth: string): (number | null)[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const firstDow = new Date(y, m - 1, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function formatYearMonth(y: number, m: number): string {
  return `${y}-${String(m).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CheckInButton({ userId, onCheckedIn }: CheckInButtonProps) {
  const today = new Date();
  const [currentYearMonth, setCurrentYearMonth] = useState(
    formatYearMonth(today.getFullYear(), today.getMonth() + 1)
  );
  const [data, setData] = useState<FullStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/checkin?month=${currentYearMonth}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
  }, [currentYearMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCheckIn() {
    if (checking) return;
    setChecking(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const json = await res.json();
        setData({ status: json.status, streaks: json.streaks, month: data?.month ?? null });
        setJustChecked(true);
        onCheckedIn(json.status, json.streaks);
        setTimeout(() => setJustChecked(false), 2500);
      }
    } finally {
      setChecking(false);
    }
  }

  const [cy, cm] = currentYearMonth.split("-").map(Number);
  const grid = buildMonthGrid(currentYearMonth);
  const currentStreak = data?.streaks?.[userId] ?? 0;
  const partnerStreak = data?.streaks?.[userId === "you" ? "her" : "you"] ?? 0;
  const checkedToday = data?.status?.[userId] ?? false;
  const partnerCheckedToday = data?.status?.[userId === "you" ? "her" : "you"] ?? false;
  const bothStreak = data?.streaks ? data.streaks.you > 0 && data.streaks.her > 0 : false;

  function navMonth(delta: number) {
    const d = new Date(cy, cm - 1 + delta, 1);
    setCurrentYearMonth(formatYearMonth(d.getFullYear(), d.getMonth() + 1));
  }

  const youSet = new Set(data?.month?.you ?? []);
  const herSet = new Set(data?.month?.her ?? []);

  return (
    <div className="rounded-2xl bg-surface-elevated border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Left — streak + check-in */}
        <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-3 p-5 sm:w-48 sm:border-r border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <motion.div
                animate={
                  justChecked
                    ? { scale: [1, 1.4, 1], rotate: [0, -8, 8, -5, 0] }
                    : bothStreak
                      ? { scale: [1, 1.05, 1] }
                      : {}
                }
                transition={
                  justChecked
                    ? { duration: 0.5 }
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <Fire
                  size={28}
                  weight={currentStreak > 0 ? "fill" : "regular"}
                  className={
                    currentStreak >= 7
                      ? "text-amber drop-shadow-[0_0_8px_rgba(232,168,80,0.5)]"
                      : currentStreak > 0
                        ? "text-amber"
                        : "text-text-secondary"
                  }
                />
              </motion.div>
              {currentStreak >= 3 && (
                <span className="absolute -top-1 -right-2 text-[9px] font-bold font-mono text-amber">
                  {currentStreak}
                </span>
              )}
            </div>

            <div className="sm:hidden">
              <p className="text-sm font-semibold text-text-primary leading-tight">
                {currentStreak > 0 ? `${currentStreak} day streak` : "No streak yet"}
              </p>
              <p className="text-[10px] text-text-secondary">
                {checkedToday ? "Checked in" : partnerStreak > 0 ? `${displayName(userId === "you" ? "her" : "you")}: ${partnerStreak}d` : "Tap fire"}
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-text-primary leading-tight">
              {currentStreak > 0 ? `${currentStreak} day streak` : "No streak yet"}
            </p>
            <p className="text-[10px] text-text-secondary mt-0.5">
              {checkedToday
                ? `${displayName(userId)} checked in today`
                : bothStreak
                  ? "Both on a streak"
                  : partnerStreak > 0
                    ? `${displayName(userId === "you" ? "her" : "you")}: ${partnerStreak} day streak`
                    : "Tap the fire to check in"}
            </p>
            {partnerCheckedToday && (
              <p className="text-[10px] text-accent mt-0.5">{displayName(userId === "you" ? "her" : "you")} checked in today</p>
            )}
          </div>

          <motion.button
            onClick={handleCheckIn}
            disabled={checking || checkedToday}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-colors flex-shrink-0 ${
              checkedToday
                ? "bg-accent/10 text-accent cursor-default"
                : "bg-amber text-brown-ink hover:bg-amber-soft"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {checkedToday ? "Done" : checking ? "..." : "Check in"}
          </motion.button>
        </div>

        {/* Right — calendar */}
        <div className="p-4 sm:p-5 flex-1 min-w-0 space-y-1.5">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navMonth(-1)}
              className="p-1 rounded text-text-secondary hover:text-text-primary transition-colors"
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <span className="text-xs font-medium text-text-primary">
              {MONTH_NAMES[cm - 1]} {cy}
            </span>
            <button
              onClick={() => navMonth(1)}
              className="p-1 rounded text-text-secondary hover:text-text-primary transition-colors"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-[8px] font-medium text-text-secondary py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {grid.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;

              const dateStr = `${currentYearMonth}-${String(day).padStart(2, "0")}`;
              const youChecked = youSet.has(dateStr);
              const herChecked = herSet.has(dateStr);
              const isToday =
                day === today.getDate() &&
                cm === today.getMonth() + 1 &&
                cy === today.getFullYear();

              return (
                <div
                  key={dateStr}
                  className={`relative flex items-center justify-center h-7 rounded text-[9px] font-mono ${
                    isToday
                      ? "ring-1 ring-accent bg-accent/5 text-text-primary font-semibold"
                      : "text-text-secondary"
                  }`}
                >
                  {day}
                  {(youChecked || herChecked) && (
                    <div className="absolute bottom-0 flex gap-px">
                      {youChecked && (
                        <span
                          className="w-2.5 h-2.5 bg-accent"
                          style={{ clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)" }}
                          title={displayName("you")}
                        />
                      )}
                      {herChecked && (
                        <span
                          className="w-2.5 h-2.5 bg-amber"
                          style={{ clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)" }}
                          title={displayName("her")}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 pt-0.5">
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 bg-accent"
                style={{ clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)" }}
              />
              <span className="text-[8px] text-text-secondary">{displayName(userId)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 bg-amber"
                style={{ clipPath: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)" }}
              />
              <span className="text-[8px] text-text-secondary">{displayName(userId === "you" ? "her" : "you")}</span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={async () => {
                if (!confirm("Reset all check-in data?")) return;
                await fetch("/api/checkin", { method: "DELETE" });
                fetchData();
              }}
              className="text-[8px] text-text-secondary/30 hover:text-rose-500 transition-colors"
            >
              reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
