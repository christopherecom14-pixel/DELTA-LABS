import { randomInt } from "node:crypto";
import { after } from "next/server";
import { CV_MAX_BYTES } from "@/lib/recruitment/config";
import { applicationSchema, issuesToFieldErrors } from "@/lib/recruitment/schema";
import { createApplication, findReferenceBySubmission } from "@/lib/server/applications";
import { CvValidationError, deleteCv, storeCv, validateCv } from "@/lib/server/cv-storage";
import { isDatabaseConfigured } from "@/lib/server/db";
import { sendApplicationEmails } from "@/lib/server/email";
import { clientIp, hashIdentifier, rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = CV_MAX_BYTES + 256 * 1024;
const MIN_FILL_MS = 8_000; // a real person can't complete six steps faster than this

const json = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const fakeReference = () => `DL-${new Date().toISOString().slice(2, 7).replace("-", "")}-${randomInt(10000, 99999)}`;

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return json({ error: "Applications are temporarily unavailable. Please try again later." }, 503);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY) return json({ error: "Your upload is too large. CVs must be 4 MB or smaller." }, 413);

  const ipHash = hashIdentifier(clientIp(request.headers));
  try {
    const [hourly, daily] = await Promise.all([
      rateLimit(`apply:h:${ipHash}`, 5, 3600),
      rateLimit(`apply:d:${ipHash}`, 15, 86400),
    ]);
    if (!hourly || !daily) {
      return json({ error: "Too many applications from this connection. Please try again later." }, 429);
    }
  } catch (error) {
    console.error("[recruitment] rate limit unavailable", error);
    return json({ error: "Applications are temporarily unavailable. Please try again shortly." }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "We couldn't read your application. Please try again." }, 400);
  }

  const submissionId = String(form.get("submissionId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return json({ error: "Invalid submission. Please refresh and try again." }, 400);

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return json({ error: "We couldn't read your application. Please try again." }, 400);
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "Some answers need attention.", fieldErrors: issuesToFieldErrors(parsed.error) }, 422);
  }
  const data = parsed.data;

  // Bots: honeypot filled or impossibly fast. Respond as if successful so they learn nothing.
  if (data.website || (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS)) {
    return json({ reference: fakeReference() }, 201);
  }

  // Retried submission (e.g. double click or flaky network): return the original reference.
  const existing = await findReferenceBySubmission(submissionId);
  if (existing) return json({ reference: existing, replay: true }, 200);

  const file = form.get("cv");
  let cv = null;
  if (file instanceof File && file.size > 0) {
    try {
      cv = await storeCv(await validateCv(file), file.name, submissionId);
    } catch (error) {
      if (error instanceof CvValidationError) {
        return json({ error: error.message, fieldErrors: { "skills.cv": error.message } }, 422);
      }
      console.error("[recruitment] CV upload failed", error);
      return json({ error: "Your CV couldn't be uploaded. Please try again." }, 500);
    }
  }

  try {
    const result = await createApplication(data, { submissionId, cv, ipHash });
    if (result.replay && cv) await deleteCv(cv.fileId);
    if (!result.replay) {
      after(() =>
        sendApplicationEmails({
          name: data.personal.fullName,
          email: data.personal.email,
          reference: result.reference,
          department: data.career.department,
        }),
      );
    }
    return json({ reference: result.reference }, result.replay ? 200 : 201);
  } catch (error) {
    if (cv) await deleteCv(cv.fileId);
    console.error("[recruitment] failed to save application", error);
    return json({ error: "Your application couldn't be saved. Please try again." }, 500);
  }
}
