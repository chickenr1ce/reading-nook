import { listBooks } from "@/lib/books";
import { getTodayStatus } from "@/lib/checkin";
import { listRecs } from "@/lib/recs";
import { isRedisConfigured } from "@/lib/kv";
import { PageContent } from "@/components/PageContent";
import type { Book, DailyCheckInStatus, Rec } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let books: Book[] = [];
  let checkin: DailyCheckInStatus = {
    date: new Date().toISOString().slice(0, 10),
    you: false,
    her: false,
  };
  let recs: Rec[] = [];
  let dbError: string | null = null;

  if (!isRedisConfigured()) {
    dbError = "Missing Redis environment variables (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL and KV_REST_API_TOKEN).";
  } else {
    try {
      const [loadedBooks, loadedCheckin, loadedRecs] = await Promise.all([
        listBooks(),
        getTodayStatus(),
        listRecs("you"),
      ]);
      books = loadedBooks;
      checkin = loadedCheckin;
      recs = loadedRecs;
    } catch (error) {
      console.error("Failed to load initial data from Redis:", error);
      dbError = error instanceof Error ? error.message : "Failed to connect to Redis database";
    }
  }

  return (
    <PageContent
      initialBooks={books}
      initialCheckin={checkin}
      initialRecs={recs}
      dbError={dbError}
    />
  );
}
