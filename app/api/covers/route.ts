import { NextRequest, NextResponse } from "next/server";
import { coversQuerySchema } from "@/lib/validations";
import { EXTERNAL_API_TIMEOUT_MS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const queryResult = coversQuerySchema.safeParse({
    title: req.nextUrl.searchParams.get("title") || "",
    author: req.nextUrl.searchParams.get("author") || "",
  });

  if (!queryResult.success) {
    return NextResponse.json({ coverUrl: null });
  }

  const { title, author } = queryResult.data;

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
    const res = await fetch(url, { signal: AbortSignal.timeout(EXTERNAL_API_TIMEOUT_MS) });
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
      signal: AbortSignal.timeout(EXTERNAL_API_TIMEOUT_MS),
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
