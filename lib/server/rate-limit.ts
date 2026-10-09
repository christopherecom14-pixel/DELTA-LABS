import "server-only";
import { createHash } from "node:crypto";
import { COLLECTIONS, getDb } from "./db";

/**
 * Client IP from proxy headers. Defaults suit Railway, Vercel and nginx; behind
 * Cloudflare set CLIENT_IP_HEADER=cf-connecting-ip. Only trust a header your
 * proxy overwrites, otherwise clients can spoof it to dodge rate limits.
 */
export function clientIp(headers: Headers): string {
  const custom = process.env.CLIENT_IP_HEADER;
  return (
    (custom && headers.get(custom)) ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/** One-way hash so raw IP addresses are never stored. */
export function hashIdentifier(value: string): string {
  const salt = process.env.SESSION_SECRET || "delta-labs";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex").slice(0, 32);
}

/**
 * Fixed-window limiter stored in MongoDB so it works across serverless instances.
 * Returns true when the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const db = await getDb();
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const id = `${key}:${windowStart}`;
  const result = await db.collection<{ _id: string; count: number; expiresAt: Date }>(COLLECTIONS.rateLimits).findOneAndUpdate(
    { _id: id },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((windowStart + windowSeconds) * 1000) } },
    { upsert: true, returnDocument: "after" },
  );
  return (result?.count ?? 1) <= limit;
}
