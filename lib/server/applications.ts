import "server-only";
import { randomInt } from "node:crypto";
import { ObjectId, type Filter } from "mongodb";
import {
  GENERAL_QUESTIONS,
  PIPELINE,
  SCORE_CRITERIA,
  departmentById,
  type PipelineStatus,
  type ScoreKey,
  type Scores,
} from "@/lib/recruitment/config";
import type { ApplicationData } from "@/lib/recruitment/schema";
import { COLLECTIONS, getCvBucket, getDb } from "./db";
import { rateLimit } from "./rate-limit";

const MONTH_MS = 30 * 24 * 3600 * 1000;
const retentionMonths = () => Number(process.env.APPLICATION_RETENTION_MONTHS || 12);
const talentPoolMonths = () => Number(process.env.TALENT_POOL_RETENTION_MONTHS || 24);

export interface CvRef {
  fileId: ObjectId;
  originalName: string;
  size: number;
  uploadedAt: Date;
}

export interface Interview {
  scheduledAt?: Date | null;
  mode?: "in-person" | "phone" | "video" | "";
  interviewer?: string;
  location?: string;
  outcome?: string;
}

export interface ApplicationDoc {
  _id: ObjectId;
  reference: string;
  submissionId: string;
  createdAt: Date;
  updatedAt: Date;
  status: PipelineStatus;
  // Denormalised, indexed fields for filtering.
  department: string;
  experienceLevel: string;
  availability: string;
  emailNormalized: string;
  phoneNormalized: string;
  cityNormalized: string;
  skillsNormalized: string[];
  // Applicant answers.
  personal: ApplicationData["personal"];
  career: ApplicationData["career"];
  skills: ApplicationData["skills"];
  screening: { questionId: string; prompt: string; answer: string }[];
  commitment: ApplicationData["commitment"];
  attribution: ApplicationData["attribution"];
  cv: CvRef | null;
  consentAt: Date;
  // Recruiter-only fields.
  scores: Scores;
  totalScore: number | null;
  interview: Interview;
  duplicateRefs: string[];
  retainUntil: Date;
  ipHash: string;
}

export interface ActivityDoc {
  _id: ObjectId;
  applicationId: ObjectId;
  at: Date;
  actor: { id: string; name: string } | null;
  type: "submitted" | "status" | "note" | "score" | "interview" | "duplicate";
  message: string;
}

const apps = async () => (await getDb()).collection<ApplicationDoc>(COLLECTIONS.applications);
const activity = async () => (await getDb()).collection<ActivityDoc>(COLLECTIONS.activity);

// ---------------------------------------------------------------------------
// Reference numbers: DL-2610-7KQ4M (year+month, 5 unambiguous characters)
// ---------------------------------------------------------------------------

const REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
function makeReference(now = new Date()) {
  const yymm = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `DL-${yymm}-${suffix}`;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Suggests the two criteria that follow directly from the applicant's answers.
 * Everything else is left for a recruiter. Suggestions are editable and never
 * used to reject anyone automatically.
 */
export function suggestScores(data: ApplicationData): Scores {
  const availability = { "full-time": 4, "part-time": 2 }[data.career.availability] ?? 0;
  const commitment = { "1-month": 0, "2-months": 1, "3-months": 2, "6-months": 3 }[data.career.commitment] ?? 0;
  const hours = { "2-4": 1, "4-6": 2, "6-8": 3 }[data.commitment.dailyHours] ?? 0;
  const budget = { yes: 5, discuss: 3, no: 1 }[data.commitment.stipendComfort] ?? 0;
  return { availabilityCommitment: availability + commitment + hours, budgetAlignment: budget };
}

export function totalOf(scores: Scores): number | null {
  const values = SCORE_CRITERIA.map((c) => scores[c.id]).filter((v): v is number => typeof v === "number");
  return values.length ? values.reduce((a, b) => a + b, 0) : null;
}

export function clampScores(input: Record<string, unknown>): Scores {
  const out: Scores = {};
  for (const c of SCORE_CRITERIA) {
    const raw = input[c.id];
    if (raw === "" || raw === null || raw === undefined) continue;
    const n = Math.round(Number(raw));
    if (Number.isFinite(n)) out[c.id as ScoreKey] = Math.min(c.max, Math.max(0, n));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function findReferenceBySubmission(submissionId: string) {
  const doc = await (await apps()).findOne({ submissionId }, { projection: { reference: 1 } });
  return doc?.reference ?? null;
}

export type CreateResult = { reference: string; duplicate: boolean; replay: boolean };

export async function createApplication(
  data: ApplicationData,
  opts: { submissionId: string; cv: CvRef | null; ipHash: string },
): Promise<CreateResult> {
  const collection = await apps();

  // Idempotency: a retried or double-clicked submission returns the original reference.
  const replay = await collection.findOne({ submissionId: opts.submissionId }, { projection: { reference: 1 } });
  if (replay) return { reference: replay.reference, duplicate: false, replay: true };

  const emailNormalized = data.personal.email.toLowerCase();
  const phoneNormalized = data.personal.phone;
  const previous = await collection
    .find({ $or: [{ emailNormalized }, { phoneNormalized }] }, { projection: { reference: 1 } })
    .toArray();
  const duplicateRefs = previous.map((p) => p.reference);

  const dept = departmentById(data.career.department)!;
  const screening = [
    { questionId: dept.question.id, prompt: dept.question.prompt, answer: data.screening.department },
    ...GENERAL_QUESTIONS.map((q) => ({ questionId: q.id, prompt: q.prompt, answer: data.screening[q.id] })),
  ];

  const scores = suggestScores(data);
  const now = new Date();
  const base = {
    submissionId: opts.submissionId,
    createdAt: now,
    updatedAt: now,
    status: "new" as const,
    department: data.career.department,
    experienceLevel: data.career.experienceLevel,
    availability: data.career.availability,
    emailNormalized,
    phoneNormalized,
    cityNormalized: data.personal.city.trim().toLowerCase(),
    skillsNormalized: [...new Set([...data.skills.topSkills, ...data.skills.platforms].map((s) => s.trim().toLowerCase()))],
    personal: data.personal,
    career: data.career,
    skills: data.skills,
    screening,
    commitment: data.commitment,
    attribution: data.attribution,
    cv: opts.cv,
    consentAt: now,
    scores, // pre-filled suggestions only
    totalScore: null, // set when a recruiter saves an evaluation
    interview: {},
    duplicateRefs,
    retainUntil: new Date(now.getTime() + retentionMonths() * MONTH_MS),
    ipHash: opts.ipHash,
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = makeReference(now);
    try {
      const { insertedId } = await collection.insertOne({ ...base, reference } as ApplicationDoc);
      const log = await activity();
      await log.insertOne({
        _id: new ObjectId(),
        applicationId: insertedId,
        at: now,
        actor: null,
        type: "submitted",
        message: `Application submitted for ${dept.name}.`,
      });
      if (previous.length) {
        await collection.updateMany({ _id: { $in: previous.map((p) => p._id) } }, { $addToSet: { duplicateRefs: reference } });
        await log.insertOne({
          _id: new ObjectId(),
          applicationId: insertedId,
          at: now,
          actor: null,
          type: "duplicate",
          message: `Possible duplicate of ${duplicateRefs.join(", ")} (same email or phone).`,
        });
      }
      return { reference, duplicate: previous.length > 0, replay: false };
    } catch (error) {
      const code = (error as { code?: number }).code;
      const keys = Object.keys((error as { keyPattern?: object }).keyPattern ?? {});
      if (code === 11000 && keys.includes("submissionId")) {
        const existing = await collection.findOne({ submissionId: opts.submissionId });
        if (existing) return { reference: existing.reference, duplicate: false, replay: true };
      }
      if (code !== 11000 || !keys.includes("reference")) throw error;
    }
  }
  throw new Error("Could not allocate an application reference.");
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export interface ListFilters {
  q?: string;
  status?: string;
  department?: string;
  experience?: string;
  availability?: string;
  city?: string;
  skill?: string;
  source?: string;
  duplicates?: string;
  sort?: string;
  page?: number;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function buildFilter(f: ListFilters): Filter<ApplicationDoc> {
  const filter: Filter<ApplicationDoc> = {};
  if (f.status && PIPELINE.some((p) => p.id === f.status)) filter.status = f.status as PipelineStatus;
  if (f.department) filter.department = f.department;
  if (f.experience) filter.experienceLevel = f.experience;
  if (f.availability) filter.availability = f.availability;
  if (f.city) filter.cityNormalized = { $regex: `^${escapeRegex(f.city.trim().toLowerCase())}` };
  if (f.skill) filter.skillsNormalized = { $regex: escapeRegex(f.skill.trim().toLowerCase()) };
  if (f.source) filter["attribution.utm_source"] = { $regex: `^${escapeRegex(f.source.trim())}$`, $options: "i" };
  if (f.duplicates === "1") filter["duplicateRefs.0"] = { $exists: true };
  if (f.q?.trim()) {
    const rx = { $regex: escapeRegex(f.q.trim()), $options: "i" };
    const digits = f.q.replace(/\D/g, "").replace(/^(?:92|0)/, "");
    filter.$or = [
      { reference: rx },
      { "personal.fullName": rx },
      { emailNormalized: rx },
      { "personal.institute": rx },
      ...(digits.length >= 4 ? [{ phoneNormalized: { $regex: digits } }] : []),
    ];
  }
  return filter;
}

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  score: { totalScore: -1, createdAt: -1 },
  name: { "personal.fullName": 1 },
  joining: { "career.joiningDate": 1 },
} as const;

export const PAGE_SIZE = 25;

export async function listApplications(f: ListFilters) {
  const collection = await apps();
  const filter = buildFilter(f);
  const sort = SORTS[(f.sort as keyof typeof SORTS) ?? "newest"] ?? SORTS.newest;
  const page = Math.max(1, f.page ?? 1);
  const [items, total, counts] = await Promise.all([
    collection
      .find(filter, {
        projection: { reference: 1, createdAt: 1, status: 1, department: 1, experienceLevel: 1, availability: 1, "personal.fullName": 1, "personal.city": 1, "personal.email": 1, totalScore: 1, duplicateRefs: 1, cv: 1, "attribution.utm_source": 1, "career.joiningDate": 1 },
      })
      .sort(sort)
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    collection.countDocuments(filter),
    collection.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
  ]);
  return {
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    statusCounts: Object.fromEntries(counts.map((c) => [c._id, c.n])) as Record<string, number>,
  };
}

export async function exportApplications(f: ListFilters) {
  const collection = await apps();
  const sort = SORTS[(f.sort as keyof typeof SORTS) ?? "newest"] ?? SORTS.newest;
  return collection.find(buildFilter(f)).sort(sort).limit(10_000).toArray();
}

export async function getApplication(id: string) {
  if (!ObjectId.isValid(id)) return null;
  return (await apps()).findOne({ _id: new ObjectId(id) });
}

export async function getActivity(id: ObjectId) {
  return (await activity()).find({ applicationId: id }).sort({ at: -1 }).limit(200).toArray();
}

export async function findByReferences(refs: string[]) {
  if (!refs.length) return [];
  return (await apps()).find({ reference: { $in: refs } }, { projection: { reference: 1, status: 1, department: 1, createdAt: 1 } }).toArray();
}

// ---------------------------------------------------------------------------
// Recruiter updates (all logged to the activity history)
// ---------------------------------------------------------------------------

type Actor = { id: string; name: string };

async function log(applicationId: ObjectId, actor: Actor, type: ActivityDoc["type"], message: string) {
  await (await activity()).insertOne({ _id: new ObjectId(), applicationId, at: new Date(), actor, type, message });
}

export async function updateStatus(id: ObjectId, status: PipelineStatus, actor: Actor) {
  const collection = await apps();
  const current = await collection.findOne({ _id: id }, { projection: { status: 1, createdAt: 1, retainUntil: 1 } });
  if (!current || current.status === status) return;
  const set: Partial<ApplicationDoc> = { status, updatedAt: new Date() };
  if (status === "talent-pool" || status === "selected") {
    const extended = new Date(Date.now() + talentPoolMonths() * MONTH_MS);
    if (extended > current.retainUntil) set.retainUntil = extended;
  }
  await collection.updateOne({ _id: id }, { $set: set });
  const from = PIPELINE.find((p) => p.id === current.status)?.label;
  const to = PIPELINE.find((p) => p.id === status)?.label;
  await log(id, actor, "status", `Status changed from ${from} to ${to}.`);
}

export async function addNote(id: ObjectId, note: string, actor: Actor) {
  await (await apps()).updateOne({ _id: id }, { $set: { updatedAt: new Date() } });
  await log(id, actor, "note", note);
}

export async function updateScores(id: ObjectId, scores: Scores, actor: Actor) {
  const total = totalOf(scores);
  await (await apps()).updateOne({ _id: id }, { $set: { scores, totalScore: total, updatedAt: new Date() } });
  await log(id, actor, "score", `Evaluation updated — total ${total ?? "not scored"}/100.`);
}

export async function updateInterview(id: ObjectId, interview: Interview, actor: Actor) {
  await (await apps()).updateOne({ _id: id }, { $set: { interview, updatedAt: new Date() } });
  const when = interview.scheduledAt
    ? interview.scheduledAt.toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })
    : "unscheduled";
  await log(id, actor, "interview", `Interview details updated (${when}).`);
}

/** Permanently removes an application, its CV and its history. */
export async function deleteApplication(id: ObjectId) {
  const collection = await apps();
  const doc = await collection.findOne({ _id: id }, { projection: { cv: 1, reference: 1 } });
  if (!doc) return;
  if (doc.cv?.fileId) {
    const bucket = await getCvBucket();
    await bucket.delete(doc.cv.fileId).catch(() => undefined);
  }
  await collection.deleteOne({ _id: id });
  await collection.updateMany({ duplicateRefs: doc.reference }, { $pull: { duplicateRefs: doc.reference } });
  await (await activity()).deleteMany({ applicationId: id });
}

/** Deletes applications whose retention period has ended. Returns the count removed. */
export async function purgeExpired(now = new Date()) {
  const expired = await (await apps()).find({ retainUntil: { $lt: now } }, { projection: { _id: 1 } }).toArray();
  for (const doc of expired) await deleteApplication(doc._id);
  return expired.length;
}

/** Runs the retention purge at most once per day (triggered by dashboard visits). */
export async function purgeExpiredDaily() {
  try {
    if (await rateLimit("retention-purge", 1, 86400)) await purgeExpired();
  } catch (error) {
    console.error("[recruitment] retention purge failed", error);
  }
}
