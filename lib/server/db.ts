import "server-only";
import { GridFSBucket, MongoClient, type Db } from "mongodb";

declare global {
  // Reused across hot reloads in development and warm serverless invocations.
  var __deltaMongo: { client: MongoClient; ready: Promise<Db> } | undefined;
}

export const COLLECTIONS = {
  applications: "internship_applications",
  activity: "internship_activity",
  admins: "admin_users",
  sessions: "admin_sessions",
  rateLimits: "rate_limits",
} as const;

export const CV_BUCKET = "internship_cvs";

async function ensureIndexes(db: Db) {
  const apps = db.collection(COLLECTIONS.applications);
  await Promise.all([
    apps.createIndex({ reference: 1 }, { unique: true }),
    apps.createIndex({ submissionId: 1 }, { unique: true }),
    apps.createIndex({ createdAt: -1 }),
    apps.createIndex({ status: 1, createdAt: -1 }),
    apps.createIndex({ department: 1, createdAt: -1 }),
    apps.createIndex({ emailNormalized: 1 }),
    apps.createIndex({ phoneNormalized: 1 }),
    apps.createIndex({ cityNormalized: 1 }),
    apps.createIndex({ experienceLevel: 1 }),
    apps.createIndex({ availability: 1 }),
    apps.createIndex({ skillsNormalized: 1 }),
    apps.createIndex({ "attribution.utm_source": 1, "attribution.utm_campaign": 1 }),
    apps.createIndex({ retainUntil: 1 }),
    db.collection(COLLECTIONS.activity).createIndex({ applicationId: 1, at: -1 }),
    db.collection(COLLECTIONS.admins).createIndex({ email: 1 }, { unique: true }),
    db.collection(COLLECTIONS.sessions).createIndex({ tokenHash: 1 }, { unique: true }),
    db.collection(COLLECTIONS.sessions).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    db.collection(COLLECTIONS.rateLimits).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export function getDb(): Promise<Db> {
  if (!globalThis.__deltaMongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not configured.");
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    const ready = client.connect().then(async (c) => {
      const db = c.db(process.env.MONGODB_DATABASE || "deltalabs");
      await ensureIndexes(db);
      return db;
    });
    // Let a failed connection be retried on the next request.
    ready.catch(() => {
      globalThis.__deltaMongo = undefined;
    });
    globalThis.__deltaMongo = { client, ready };
  }
  return globalThis.__deltaMongo.ready;
}

export async function getCvBucket() {
  return new GridFSBucket(await getDb(), { bucketName: CV_BUCKET });
}
