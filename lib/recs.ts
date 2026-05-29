import { nanoid } from "nanoid";
import { redis } from "./kv";
import type { Rec, RecInput, UserId } from "@/types";

const REC_PREFIX = "recs";
const INDEX_PREFIX = "recs:index"; // recs:index:you, recs:index:her

function recKey(id: string) {
  return `${REC_PREFIX}:${id}`;
}

function indexKey(userId: UserId) {
  return `${INDEX_PREFIX}:${userId}`;
}

export async function addRec(input: RecInput): Promise<Rec> {
  const id = nanoid(12);
  const now = new Date().toISOString();
  const rec: Rec = {
    id,
    from: input.from,
    to: input.to,
    bookTitle: input.bookTitle,
    bookAuthor: input.bookAuthor,
    note: input.note,
    createdAt: now,
    read: false,
  };

  await redis.hset(recKey(id), rec as unknown as Record<string, unknown>);
  const score = Date.now();
  await redis.zadd(indexKey(input.to), { score, member: id });

  return rec;
}

export async function listRecs(forUser: UserId): Promise<Rec[]> {
  const ids = (await redis.zrange(indexKey(forUser), 0, -1, { rev: true })) as string[];
  if (ids.length === 0) return [];

  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.hgetall(recKey(id));
  }
  const results = await pipeline.exec();
  return (results as (Record<string, unknown> | null)[])
    .filter((r): r is Record<string, unknown> => r !== null && Object.keys(r).length > 0)
    .map((r) => r as unknown as Rec);
}

export async function markRecRead(id: string): Promise<boolean> {
  const exists = await redis.exists(recKey(id));
  if (!exists) return false;
  await redis.hset(recKey(id), { read: true });
  return true;
}
