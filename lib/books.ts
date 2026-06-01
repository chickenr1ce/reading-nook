import { nanoid } from "nanoid";
import { redis } from "./kv";
import type { Book, BookInput, BookStatus, UserId } from "@/types";

const BOOK_PREFIX = "books";
const INDEX_ALL = "books:index:all";
const INDEX_PREFIX = "books:index"; // books:index:you, books:index:her

function indexKey(owner: UserId) {
  return `${INDEX_PREFIX}:${owner}`;
}

function bookKey(id: string) {
  return `${BOOK_PREFIX}:${id}`;
}

export async function addBook(input: BookInput): Promise<Book> {
  const id = nanoid(12);
  const now = new Date().toISOString();
  const book: Book = {
    id,
    title: input.title,
    author: input.author,
    coverUrl: input.coverUrl ?? null,
    status: input.status ?? "want-to-read",
    rating: input.rating ?? 0,
    notes: input.notes ?? "",
    owner: input.owner,
    addedAt: now,
  };

  await redis.hset(bookKey(id), book as unknown as Record<string, unknown>);
  // Use addedAt timestamp as score so we can sort newest first
  const score = Date.now();
  await redis.zadd(INDEX_ALL, { score, member: id });
  await redis.zadd(indexKey(input.owner), { score, member: id });

  return book;
}

export async function getBook(id: string): Promise<Book | null> {
  const data = await redis.hgetall(bookKey(id));
  if (!data || Object.keys(data).length === 0) return null;
  return rawToBook(data);
}

export async function updateBook(
  id: string,
  patch: Partial<Pick<Book, "title" | "author" | "status" | "rating" | "notes" | "coverUrl">>
): Promise<Book | null> {
  const exists = await redis.exists(bookKey(id));
  if (!exists) return null;

  const updates: Record<string, unknown> = {};
  if (patch.title !== undefined) updates.title = patch.title;
  if (patch.author !== undefined) updates.author = patch.author;
  if (patch.status !== undefined) updates.status = patch.status;
  if (patch.rating !== undefined) updates.rating = patch.rating;
  if (patch.notes !== undefined) updates.notes = patch.notes;
  if (patch.coverUrl !== undefined) updates.coverUrl = patch.coverUrl;

  if (Object.keys(updates).length > 0) {
    await redis.hset(bookKey(id), updates);
  }

  return getBook(id);
}

export async function deleteBook(id: string): Promise<boolean> {
  const book = await getBook(id);
  if (!book) return false;

  await redis.del(bookKey(id));
  await redis.zrem(INDEX_ALL, id);
  await redis.zrem(indexKey(book.owner), id);

  return true;
}

export async function listBooks(owner?: UserId): Promise<Book[]> {
  const setKey = owner ? indexKey(owner) : INDEX_ALL;
  // Get newest first
  const ids = (await redis.zrange(setKey, 0, -1, { rev: true })) as string[];
  if (ids.length === 0) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(bookKey(id));
  }
  const results = await pipeline.exec();
  return (results as (Record<string, unknown> | null)[])
    .filter((r): r is Record<string, unknown> => r !== null && Object.keys(r).length > 0)
    .map((r) => rawToBook(r));
}

function rawToBook(rawData: Record<string, unknown>): Book {
  return {
    id: String(rawData.id),
    title: String(rawData.title),
    author: String(rawData.author),
    rating: Number(rawData.rating) || 0,
    coverUrl: rawData.coverUrl ? String(rawData.coverUrl) : null,
    notes: rawData.notes ? String(rawData.notes) : "",
    status: String(rawData.status ?? "want-to-read") as BookStatus,
    owner: String(rawData.owner) as UserId,
    addedAt: new Date(String(rawData.addedAt ?? Date.now())).toISOString(),
  };
}