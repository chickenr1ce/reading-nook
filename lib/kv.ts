import { Redis } from "@upstash/redis";

/**
 * Upstash Redis client for shared bookshelf data.
 *
 * Set these env vars in .env.local:
 *   UPSTASH_REDIS_REST_URL=https://...
 *   UPSTASH_REDIS_REST_TOKEN=...
 *
 * Get them from https://console.upstash.com after creating a Redis database.
 */

export const redis = Redis.fromEnv();
