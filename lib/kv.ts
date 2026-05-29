import { Redis } from "@upstash/redis";

/**
 * Upstash Redis client for shared bookshelf data.
 *
 * Set these env vars wherever you deploy:
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Get them from https://console.upstash.com after creating a Redis database.
 *
 * Lazy-initialized so env vars are read at first use, not at import time.
 * This avoids the Vercel edge-case where env vars aren't available during
 * module initialization but are available later.
 */

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN env vars"
      );
    }

    _redis = new Redis({ url, token });
  }
  return _redis;
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const real = getRedis();
    const value = (real as unknown as Record<string | symbol, unknown>)[prop];
    // Bind methods so `this` inside the Redis client resolves correctly
    if (typeof value === "function") {
      return value.bind(real);
    }
    return value;
  },
});
