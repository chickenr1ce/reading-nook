"use client";

import React from "react";
import { motion } from "motion/react";
import { Fire } from "@phosphor-icons/react";
import { displayName, getPartnerId } from "@/lib/names";
import type { UserId } from "@/types";

interface StreakDisplayProps {
  userId: UserId;
  currentStreak: number;
  partnerStreak: number;
  checkedToday: boolean;
  partnerCheckedToday: boolean;
  bothStreak: boolean;
  justChecked: boolean;
  checking: boolean;
  onCheckIn: () => void;
}

export function StreakDisplay({
  userId,
  currentStreak,
  partnerStreak,
  checkedToday,
  partnerCheckedToday,
  bothStreak,
  justChecked,
  checking,
  onCheckIn,
}: StreakDisplayProps) {
  const partnerId = getPartnerId(userId);

  return (
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

        {/* Mobile View */}
        <div className="sm:hidden">
          <p className="text-sm font-semibold text-text-primary leading-tight">
            {currentStreak > 0 ? `${currentStreak} day streak` : "No streak yet"}
          </p>
          <p className="text-[10px] text-text-secondary">
            {checkedToday
              ? "Checked in"
              : partnerStreak > 0
                ? `${displayName(partnerId)}: ${partnerStreak}d`
                : "Tap fire"}
          </p>
        </div>
      </div>

      {/* Desktop View */}
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
                ? `${displayName(partnerId)}: ${partnerStreak} day streak`
                : "Tap the fire to check in"}
        </p>
        {partnerCheckedToday && (
          <p className="text-[10px] text-accent mt-0.5">
            {displayName(partnerId)} checked in today
          </p>
        )}
      </div>

      <motion.button
        onClick={onCheckIn}
        disabled={checking || checkedToday}
        className={`px-4 py-2 text-xs font-medium rounded-full transition-colors flex-shrink-0 cursor-pointer ${
          checkedToday
            ? "bg-accent/10 text-accent cursor-default"
            : "bg-amber text-brown-ink hover:bg-amber-soft"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {checkedToday ? "Done" : checking ? "..." : "Check in"}
      </motion.button>
    </div>
  );
}
