"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StreakDisplay } from "./StreakDisplay";
import { CalendarGrid } from "./CalendarGrid";
import { CHECKIN_FLASH_MS } from "@/lib/constants";
import { getPartnerId } from "@/lib/names";
import type { DailyCheckInStatus, StreakData, MonthCheckins, UserId } from "@/types";

interface CheckInButtonProps {
  userId: UserId;
  onCheckedIn?: (status: DailyCheckInStatus, streaks: StreakData) => void;
}

interface FullStatus {
  status: DailyCheckInStatus;
  streaks: StreakData;
  month: MonthCheckins | null;
}

function formatYearMonth(y: number, m: number): string {
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function CheckInButton({ userId, onCheckedIn }: CheckInButtonProps) {
  const today = new Date();
  const [currentYearMonth, setCurrentYearMonth] = useState(
    formatYearMonth(today.getFullYear(), today.getMonth() + 1)
  );
  const [data, setData] = useState<FullStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [justChecked, setJustChecked] = useState(false);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkin?month=${currentYearMonth}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch check-in data:", err);
    }
  }, [currentYearMonth]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`/api/checkin?month=${currentYearMonth}`);
        if (res.ok && !ignore) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch check-in data:", err);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [currentYearMonth]);

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
        setData((prev) => ({
          status: json.status,
          streaks: json.streaks,
          month: prev?.month ?? null,
        }));
        setJustChecked(true);
        onCheckedIn?.(json.status, json.streaks);

        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => {
          setJustChecked(false);
        }, CHECKIN_FLASH_MS);
      }
    } catch (err) {
      console.error("Check-in request failed:", err);
    } finally {
      setChecking(false);
    }
  }

  async function handleResetData() {
    try {
      await fetch("/api/checkin", { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error("Failed to reset check-in data:", err);
    }
  }

  function handleNavigateMonth(delta: number) {
    const [cy, cm] = currentYearMonth.split("-").map(Number);
    const d = new Date(cy, cm - 1 + delta, 1);
    setCurrentYearMonth(formatYearMonth(d.getFullYear(), d.getMonth() + 1));
  }

  const partnerId = getPartnerId(userId);
  const currentStreak = data?.streaks?.[userId] ?? 0;
  const partnerStreak = data?.streaks?.[partnerId] ?? 0;
  const checkedToday = data?.status?.[userId] ?? false;
  const partnerCheckedToday = data?.status?.[partnerId] ?? false;
  const bothStreak = data?.streaks ? data.streaks.you > 0 && data.streaks.her > 0 : false;

  return (
    <div className="rounded-2xl bg-surface-elevated border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Left — streak display & check-in button */}
        <StreakDisplay
          userId={userId}
          currentStreak={currentStreak}
          partnerStreak={partnerStreak}
          checkedToday={checkedToday}
          partnerCheckedToday={partnerCheckedToday}
          bothStreak={bothStreak}
          justChecked={justChecked}
          checking={checking}
          onCheckIn={handleCheckIn}
        />

        {/* Right — calendar grid & history */}
        <CalendarGrid
          userId={userId}
          monthData={data?.month ?? null}
          currentYearMonth={currentYearMonth}
          onNavigateMonth={handleNavigateMonth}
          onResetData={handleResetData}
        />
      </div>
    </div>
  );
}
