import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title")?.trim();
  const author = req.nextUrl.searchParams.get("author")?.trim();

  if (!title || !author) {
    return NextResponse.json({ coverUrl: null });
  }

  // 1. Try Open Library (traditional books)
  const olCover = await fetchOpenLibrary(title, author);
  if (olCover) return NextResponse.json({ coverUrl: olCover });

  // 2. Fallback: AniList (light novels, manga)
  const alCover = await fetchAniList(title);
  if (alCover) return NextResponse.json({ coverUrl: alCover });

  return NextResponse.json({ coverUrl: null });
}

async function fetchOpenLibrary(
  title: string,
  author: string,
): Promise<string | null> {
  const params = new URLSearchParams({ title, author, limit: "1" });
  const url = `https://openlibrary.org/search.json?${params.toString()}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = await res.json();
    const coverId: number | undefined = data?.docs?.[0]?.cover_i;
    if (!coverId) return null;

    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  } catch {
    return null;
  }
}

async function fetchAniList(title: string): Promise<string | null> {
  const query = `
    query ($search: String) {
      Media(search: $search, type: MANGA) {
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
      body: JSON.stringify({
        query,
        variables: { search: title },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const coverUrl: string | undefined =
      json?.data?.Media?.coverImage?.large;
    return coverUrl ?? null;
  } catch {
    return null;
  }
}
