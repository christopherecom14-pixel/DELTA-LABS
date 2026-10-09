import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "./db";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const SESSION_COOKIE = "dl_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const ROLES = ["admin", "recruiter", "viewer"] as const;
export type Role = (typeof ROLES)[number];

const PERMISSIONS = {
  view: ["admin", "recruiter", "viewer"],
  edit: ["admin", "recruiter"],
  export: ["admin", "recruiter"],
  manage: ["admin"], // users, deletion, retention purge
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export const can = (role: Role, permission: Permission) =>
  (PERMISSIONS[permission] as readonly Role[]).includes(role);

export interface AdminUser {
  _id: ObjectId;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export type SessionUser = Pick<AdminUser, "email" | "name" | "role"> & { id: string };

// ---------------------------------------------------------------------------
// Passwords (scrypt, format: scrypt$<salt b64>$<hash b64>)
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// A fixed hash to compare against when the email is unknown, so response
// timing doesn't reveal which admin emails exist.
let dummyHash: Promise<string> | undefined;
export async function verifyAgainstDummy(password: string) {
  dummyHash ??= hashPassword("not-a-real-password");
  await verifyPassword(password, await dummyHash);
  return false;
}

// ---------------------------------------------------------------------------
// Sessions (opaque random token in an HttpOnly cookie, SHA-256 hash in the DB)
// ---------------------------------------------------------------------------

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: ObjectId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const db = await getDb();
  await db.collection(COLLECTIONS.sessions).insertOne({ tokenHash: hashToken(token), userId, createdAt: new Date(), expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.collection(COLLECTIONS.sessions).deleteOne({ tokenHash: hashToken(token) });
  }
  store.delete(SESSION_COOKIE);
}

/** Resolves the signed-in admin for this request (memoised per render). */
export const getCurrentAdmin = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const session = await db.collection(COLLECTIONS.sessions).findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db.collection<AdminUser>(COLLECTIONS.admins).findOne({ _id: session.userId, active: true });
  if (!user) return null;
  return { id: user._id.toHexString(), email: user.email, name: user.name, role: user.role };
});

/** For pages and server actions: redirects to login, or throws on missing permission. */
export async function requireAdmin(permission: Permission = "view"): Promise<SessionUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  if (!can(user.role, permission)) throw new Error("You do not have permission to do that.");
  return user;
}

/** For route handlers: returns a Response to send back when access is denied. */
export async function authorizeRequest(permission: Permission): Promise<SessionUser | Response> {
  const user = await getCurrentAdmin();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!can(user.role, permission)) return new Response("Forbidden", { status: 403 });
  return user;
}
