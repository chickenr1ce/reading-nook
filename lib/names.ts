import type { UserId } from "@/types";

/** Display names for the two users. Change these anytime. */
const NAMES: Record<UserId, string> = {
  you: "Alexiz",
  her: "Ying",
};

/** Capitalized display name for a user ID. */
export function displayName(id: UserId): string {
  return NAMES[id];
}

/** Possessive form: "Alexiz's" / "Ying's" */
export function possessiveName(id: UserId): string {
  return `${NAMES[id]}'s`;
}

/** Get the other user's ID. */
export function getPartnerId(id: UserId): UserId {
  return id === "you" ? "her" : "you";
}
