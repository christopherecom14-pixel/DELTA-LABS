import "server-only";
import { Readable } from "node:stream";
import { ObjectId } from "mongodb";
import { CV_MAX_BYTES, CV_MAX_LABEL } from "@/lib/recruitment/config";
import type { CvRef } from "./applications";
import { getCvBucket } from "./db";

export class CvValidationError extends Error {}

/** Keeps a readable, header-safe display name; the stored GridFS name is generated. */
function sanitizeName(name: string) {
  const base = name.replace(/\.pdf$/i, "").replace(/[^\w\s.\-()]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
  return `${base || "cv"}.pdf`;
}

/**
 * Validates an uploaded CV by size and by content (PDF magic bytes) rather than
 * trusting the browser-provided type or extension.
 */
export async function validateCv(file: File): Promise<Buffer> {
  if (file.size === 0) throw new CvValidationError("The CV file is empty.");
  if (file.size > CV_MAX_BYTES) throw new CvValidationError(`CV must be ${CV_MAX_LABEL} or smaller.`);
  if (!/\.pdf$/i.test(file.name)) throw new CvValidationError("CV must be a PDF file.");
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") throw new CvValidationError("CV must be a valid PDF file.");
  return buffer;
}

export async function storeCv(buffer: Buffer, originalName: string, submissionId: string): Promise<CvRef> {
  const bucket = await getCvBucket();
  const fileId = new ObjectId();
  await new Promise<void>((resolve, reject) => {
    Readable.from(buffer)
      .pipe(bucket.openUploadStreamWithId(fileId, `${submissionId}.pdf`, { metadata: { contentType: "application/pdf", submissionId } }))
      .on("finish", () => resolve())
      .on("error", reject);
  });
  return { fileId, originalName: sanitizeName(originalName), size: buffer.length, uploadedAt: new Date() };
}

export async function deleteCv(fileId: ObjectId) {
  const bucket = await getCvBucket();
  await bucket.delete(fileId).catch(() => undefined);
}

export async function readCv(fileId: ObjectId): Promise<Buffer> {
  const bucket = await getCvBucket();
  const chunks: Buffer[] = [];
  for await (const chunk of bucket.openDownloadStream(fileId)) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}
