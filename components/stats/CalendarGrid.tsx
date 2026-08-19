"use client";

import React, { useState } from "react";
import { CaretLeft, CaretRight, Trash } from "@phosphor-icons/react";
import { DiamondDot } from "@/components/ui/DiamondDot";
import { displayName, getPartnerId } from "@/lib/names";
import type { MonthCheckins, UserId } from "@/types";

interface CalendarGridProps {
  userId: UserId;
  monthData: MonthCheckins | null;
  currentYearMonth: string;
  onNavigateMonth: (delta: number) => void;
  onResetData: () => Promise<void>;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildMonthGrid(yearMonth: string): (number | null)[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const firstDow = new Date(y, m - 1, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export function CalendarGrid({
  userId,
  monthData,
  currentYearMonth,
  onNavigateMonth,
  onResetData,
}: CalendarGridProps) {
  const today = new Date();
  const [cy, cm] = currentYearMonth.split("-").map(Number);
  const grid = buildMonthGrid(currentYearMonth);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const youSet = new Set(monthData?.you ?? []);
  const herSet = new Set(monthData?.her ?? []);
  const partnerId = getPartnerId(userId);

  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      await onResetData();
    } finally {
      setResetting(false);
      setConfirmingReset(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 flex-1 min-w-0 space-y-1.5">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateMonth(-1)}
          className="p-1 rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <CaretLeft size={14} weight="bold" />
        </button>
        <span className="text-xs font-medium text-text-primary">
          {MONTH_NAMES[cm - 1]} {cy}
        </span>
        <button
          onClick={() => onNavigateMonth(1)}
          className="p-1 rounded text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="text-center text-[8px] font-medium text-text-secondary py-0.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

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
                    <DiamondDot color="accent" title={displayName("you")} />
                  )}
                  {herChecked && (
                    <DiamondDot color="amber" title={displayName("her")} />
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
          <DiamondDot color="accent" />
          <span className="text-[8px] text-text-secondary">{displayName(userId)}</span>
        </div>
        <div className="flex items-center gap-1">
          <DiamondDot color="amber" />
          <span className="text-[8px] text-text-secondary">{displayName(partnerId)}</span>
        </div>
      </div>

      {/* Reset action with styled inline confirmation */}
      <div className="flex justify-end pt-1">
        {confirmingReset ? (
          <div className="flex items-center gap-2 bg-surface border border-border px-2.5 py-1 rounded-full text-[9px] shadow-sm">
            <span className="text-text-secondary">Reset all data?</span>
            <button
              onClick={handleConfirmReset}
              disabled={resetting}
              className="text-rose-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resetting ? "Resetting…" : "Yes, reset"}
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              disabled={resetting}
              className="text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingReset(true)}
            className="flex items-center gap-0.5 text-[8px] text-text-secondary/40 hover:text-rose-500 transition-colors cursor-pointer"
            title="Reset check-in history"
          >
            <Trash size={10} weight="regular" />
            <span>reset history</span>
          </button>
        )}
      </div>
    </div>
  );
}
