/* ── User Profiles ── */
export type UserId = "you" | "her";

/* ── Book ── */
export type BookStatus = "reading" | "finished" | "want-to-read";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  status: BookStatus;
  rating: number; // 0–5
  notes: string;
  owner: UserId;
  addedAt: string; // ISO timestamp
}

export interface BookInput {
  title: string;
  author: string;
  coverUrl?: string;
  status?: BookStatus;
  rating?: number;
  notes?: string;
  owner: UserId;
}

/* ── Recommendation ── */
export interface Rec {
  id: string;
  from: UserId;
  to: UserId;
  bookTitle: string;
  bookAuthor: string;
  note: string;
  createdAt: string;
  read: boolean;
}

export interface RecInput {
  from: UserId;
  to: UserId;
  bookTitle: string;
  bookAuthor: string;
  note: string;
}

/* ── Check-In ── */
export interface CheckIn {
  userId: UserId;
  date: string; // "YYYY-MM-DD"
  timestamp: string; // ISO
}

export interface DailyCheckInStatus {
  date: string;
  you: boolean;
  her: boolean;
}

export interface StreakData {
  you: number;
  her: number;
}

export interface MonthCheckins {
  yearMonth: string; // "YYYY-MM"
  you: string[]; // date strings like "2025-01-15"
  her: string[];
}
