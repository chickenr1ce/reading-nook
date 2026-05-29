import { redis } from "./kv";
import type { CheckIn, DailyCheckInStatus, StreakData, MonthCheckins, UserId } from "@/types";

const DATES_SET_PREFIX = "checkin:dates"; // checkin:dates:you, checkin:dates:her

function checkinKey(userId: UserId, date: string) {
  return `checkin:${userId}:${date}`;
}

function datesSetKey(userId: UserId) {
  return `${DATES_SET_PREFIX}:${userId}`;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateToYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Count consecutive days from today going backwards where the set contains the date. */
async function calcStreak(userId: UserId): Promise<number> {
  let streak = 0;
  const d = new Date();
  // Check up to 60 days back
  for (let i = 0; i < 60; i++) {
    const date = dateToYMD(d);
    const exists = await redis.exists(checkinKey(userId, date));
    if (exists) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      // Allow today to be missing (they haven't checked in yet today)
      if (i === 0) {
        d.setDate(d.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}

export async function checkIn(userId: UserId): Promise<CheckIn> {
  const date = todayString();
  const timestamp = new Date().toISOString();
  const data: CheckIn = { userId, date, timestamp };

  // Store the check-in hash
  await redis.hset(checkinKey(userId, date), data as unknown as Record<string, unknown>);
  await redis.expire(checkinKey(userId, date), 60 * 60 * 24 * 90);

  // Add to sorted set for date queries (score = unix timestamp of the date)
  const dateObj = new Date(date + "T00:00:00Z");
  await redis.zadd(datesSetKey(userId), {
    score: dateObj.getTime(),
    member: date,
  });

  return data;
}

export async function getTodayStatus(): Promise<DailyCheckInStatus> {
  const date = todayString();

  const [youRaw, herRaw] = await Promise.all([
    redis.hgetall(checkinKey("you", date)),
    redis.hgetall(checkinKey("her", date)),
  ]);

  return {
    date,
    you: youRaw !== null && Object.keys(youRaw).length > 0,
    her: herRaw !== null && Object.keys(herRaw).length > 0,
  };
}

export async function getStreaks(): Promise<StreakData> {
  const [youStreak, herStreak] = await Promise.all([
    calcStreak("you"),
    calcStreak("her"),
  ]);

  return {
    you: youStreak,
    her: herStreak,
  };
}

/** Get all check-in dates for a given month (YYYY-MM). */
export async function getMonthCheckins(yearMonth: string): Promise<MonthCheckins> {
  const [y, m] = yearMonth.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

  const [youDates, herDates] = await Promise.all([
    redis.zrange(datesSetKey("you"), start.getTime(), end.getTime(), {
      byScore: true,
    }),
    redis.zrange(datesSetKey("her"), start.getTime(), end.getTime(), {
      byScore: true,
    }),
  ]);

  return {
    yearMonth,
    you: (youDates ?? []) as string[],
    her: (herDates ?? []) as string[],
  };
}

/** Delete all check-in data for both users. For testing. */
export async function resetCheckins(): Promise<void> {
  // Scan and delete all checkin:* keys
  const pattern = "checkin:*";
  let cursor = "0";
  const keys: string[] = [];

  do {
    const [nextCursor, batch] = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });
    cursor = nextCursor as string;
    keys.push(...(batch as string[]));
  } while (cursor !== "0");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
