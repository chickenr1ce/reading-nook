import { NextRequest, NextResponse } from "next/server";

interface SearchResult {
  title: string;
  author: string;
  coverUrl: string | null;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  // 1. Try Open Library
  const olResults = await searchOpenLibrary(q);
  if (olResults.length > 0) return NextResponse.json(olResults);

  // 2. Fallback: AniList single result
  const alResult = await searchAniList(q);
  if (alResult) return NextResponse.json([alResult]);

  return NextResponse.json([]);
}

async function searchOpenLibrary(q: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q, limit: "5" });
  const url = `https://openlibrary.org/search.json?${params.toString()}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];

    const data = await res.json();
    const docs: Array<{
      title?: string;
      author_name?: string[];
      cover_i?: number;
    }> = data?.docs ?? [];

    return docs
      .filter((d) => d.title)
      .map((d) => ({
        title: d.title!,
        author: d.author_name?.[0] ?? "Unknown",
        coverUrl: d.cover_i
          ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
          : null,
      }));
  } catch {
    return [];
  }
}

async function searchAniList(q: string): Promise<SearchResult | null> {
  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA) {
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  `;

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: q } }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const media = json?.data?.Media;
    if (!media) return null;

    return {
      title: media.title?.english || media.title?.romaji || q,
      author: "", // AniList doesn't expose author in this query shape
      coverUrl: media.coverImage?.large ?? null,
    };
  } catch {
    return null;
  }
}
