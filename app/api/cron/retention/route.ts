import { timingSafeEqual } from "node:crypto";
import { purgeExpired } from "@/lib/server/applications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deletes applications (and CVs) past their retention date. Call daily from a
 * scheduler with `Authorization: Bearer $CRON_SECRET`. The dashboard also runs
 * it once a day on its own (purgeExpiredDaily).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const ok = secret && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) return new Response("Unauthorized", { status: 401 });

  const removed = await purgeExpired();
  return Response.json({ removed });
}
