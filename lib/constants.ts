import type { BookStatus } from "@/types";

export const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
  { value: "want-to-read", label: "Want to read" },
];

/** Maximum days to look back for consecutive check-in streak calculation */
export const STREAK_MAX_LOOKBACK_DAYS = 60;

/** TTL for individual check-in records in seconds (90 days) */
export const CHECKIN_TTL_SECONDS = 60 * 60 * 24 * 90;

/** Debounce timeout in milliseconds for book search inputs */
export const SEARCH_DEBOUNCE_MS = 300;

/** Delay in milliseconds before closing recommendation drawer on success */
export const REC_DRAWER_AUTO_CLOSE_MS = 1500;

/** Duration in milliseconds for the check-in success flash animation */
export const CHECKIN_FLASH_MS = 2500;

/** Request timeout in milliseconds for third-party cover and search APIs */
export const EXTERNAL_API_TIMEOUT_MS = 5000;
