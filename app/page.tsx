import { listBooks } from "@/lib/books";
import { getTodayStatus } from "@/lib/checkin";
import { listRecs } from "@/lib/recs";
import { PageContent } from "@/components/PageContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [books, checkin, recs] = await Promise.all([
    listBooks(),
    getTodayStatus(),
    listRecs("you"),
  ]);

  return (
    <PageContent
      initialBooks={books}
      initialCheckin={checkin}
      initialRecs={recs}
    />
  );
}
