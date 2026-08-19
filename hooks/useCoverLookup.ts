import { useState, useCallback } from "react";

export type CoverResult = "idle" | "found" | "not_found";

export function useCoverLookup() {
  const [coverSearching, setCoverSearching] = useState(false);
  const [coverResult, setCoverResult] = useState<CoverResult>("idle");

  const findCover = useCallback(
    async (title: string, author: string): Promise<string | null> => {
      const cleanTitle = title.trim();
      const cleanAuthor = author.trim();
      if (!cleanTitle || !cleanAuthor) return null;

      setCoverSearching(true);
      setCoverResult("idle");

      try {
        const params = new URLSearchParams({
          title: cleanTitle,
          author: cleanAuthor,
        });
        const res = await fetch(`/api/covers?${params}`);
        if (!res.ok) {
          setCoverResult("not_found");
          return null;
        }

        const data = await res.json();
        if (data.coverUrl) {
          setCoverResult("found");
          return data.coverUrl as string;
        } else {
          setCoverResult("not_found");
          return null;
        }
      } catch (err) {
        console.error("Cover lookup error:", err);
        setCoverResult("not_found");
        return null;
      } finally {
        setCoverSearching(false);
      }
    },
    []
  );

  const resetCoverResult = useCallback(() => {
    setCoverResult("idle");
  }, []);

  return {
    coverSearching,
    coverResult,
    findCover,
    resetCoverResult,
    setCoverResult,
  };
}
