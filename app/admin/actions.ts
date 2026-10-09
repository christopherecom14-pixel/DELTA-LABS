"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { PIPELINE_IDS, type PipelineStatus } from "@/lib/recruitment/config";
import {
  addNote,
  clampScores,
  deleteApplication,
  purgeExpired,
  updateInterview,
  updateScores,
  updateStatus,
  type Interview,
} from "@/lib/server/applications";
import {
  ROLES,
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyAgainstDummy,
  verifyPassword,
  type AdminUser,
  type Role,
} from "@/lib/server/auth";
import { COLLECTIONS, getDb } from "@/lib/server/db";
import { clientIp, hashIdentifier, rateLimit } from "@/lib/server/rate-limit";

export type ActionState = { ok?: boolean; message?: string } | undefined;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const toId = (raw: string) => {
  if (!ObjectId.isValid(raw)) throw new Error("Invalid application.");
  return new ObjectId(raw);
};
const actorOf = (u: { id: string; name: string }) => ({ id: u.id, name: u.name });

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function loginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { message: "Enter your email and password." };

  const ip = hashIdentifier(clientIp(await headers()));
  const [ipOk, emailOk] = await Promise.all([
    rateLimit(`login:ip:${ip}`, 20, 900),
    rateLimit(`login:email:${hashIdentifier(email)}`, 6, 900),
  ]);
  if (!ipOk || !emailOk) return { message: "Too many sign-in attempts. Please wait 15 minutes and try again." };

  const db = await getDb();
  const user = await db.collection<AdminUser>(COLLECTIONS.admins).findOne({ email, active: true });
  const valid = user ? await verifyPassword(password, user.passwordHash) : await verifyAgainstDummy(password);
  if (!user || !valid) return { message: "Incorrect email or password." };

  await db.collection<AdminUser>(COLLECTIONS.admins).updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  await createSession(user._id);
  const next = str(fd, "next");
  redirect(next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/recruitment");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Applicant pipeline
// ---------------------------------------------------------------------------

export async function updateStatusAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin("edit");
  const status = str(fd, "status") as PipelineStatus;
  if (!PIPELINE_IDS.includes(status)) return { message: "Choose a valid status." };
  const id = toId(str(fd, "id"));
  await updateStatus(id, status, actorOf(user));
  revalidatePath(`/admin/recruitment/${id}`);
  return { ok: true, message: "Status updated." };
}

export async function addNoteAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin("edit");
  const note = str(fd, "note");
  if (!note) return { message: "Write a note first." };
  if (note.length > 3000) return { message: "Notes must be 3,000 characters or fewer." };
  const id = toId(str(fd, "id"));
  await addNote(id, note, actorOf(user));
  revalidatePath(`/admin/recruitment/${id}`);
  return { ok: true, message: "Note added." };
}

export async function updateScoresAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin("edit");
  const id = toId(str(fd, "id"));
  await updateScores(id, clampScores(Object.fromEntries(fd.entries())), actorOf(user));
  revalidatePath(`/admin/recruitment/${id}`);
  return { ok: true, message: "Evaluation saved." };
}

export async function updateInterviewAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireAdmin("edit");
  const id = toId(str(fd, "id"));
  const when = str(fd, "scheduledAt");
  // datetime-local values are entered in Pakistan time (UTC+5, no DST).
  const scheduledAt = when ? new Date(`${when}:00+05:00`) : null;
  if (scheduledAt && Number.isNaN(scheduledAt.getTime())) return { message: "Enter a valid interview date and time." };
  const mode = str(fd, "mode");
  const interview: Interview = {
    scheduledAt,
    mode: (["in-person", "phone", "video"].includes(mode) ? mode : "") as Interview["mode"],
    interviewer: str(fd, "interviewer").slice(0, 120),
    location: str(fd, "location").slice(0, 200),
    outcome: str(fd, "outcome").slice(0, 2000),
  };
  await updateInterview(id, interview, actorOf(user));
  revalidatePath(`/admin/recruitment/${id}`);
  return { ok: true, message: "Interview details saved." };
}

export async function deleteApplicationAction(fd: FormData) {
  await requireAdmin("manage");
  if (str(fd, "confirm") !== "DELETE") throw new Error("Type DELETE to confirm.");
  await deleteApplication(toId(str(fd, "id")));
  revalidatePath("/admin/recruitment");
  redirect("/admin/recruitment?deleted=1");
}

export async function purgeExpiredAction(): Promise<ActionState> {
  await requireAdmin("manage");
  const removed = await purgeExpired();
  revalidatePath("/admin/recruitment");
  return { ok: true, message: removed ? `Deleted ${removed} expired application${removed === 1 ? "" : "s"}.` : "No applications have passed their retention date." };
}

// ---------------------------------------------------------------------------
// Admin users
// ---------------------------------------------------------------------------

export async function createUserAction(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin("manage");
  const email = str(fd, "email").toLowerCase();
  const name = str(fd, "name");
  const role = str(fd, "role") as Role;
  const password = String(fd.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { message: "Enter a valid email." };
  if (name.length < 2) return { message: "Enter a name." };
  if (!ROLES.includes(role)) return { message: "Choose a role." };
  if (password.length < 12) return { message: "Passwords must be at least 12 characters." };
  const db = await getDb();
  try {
    await db.collection(COLLECTIONS.admins).insertOne({ email, name, role, passwordHash: await hashPassword(password), active: true, createdAt: new Date() });
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return { message: "A user with that email already exists." };
    throw e;
  }
  revalidatePath("/admin/users");
  return { ok: true, message: `${name} can now sign in.` };
}

export async function updateUserAction(fd: FormData) {
  const me = await requireAdmin("manage");
  const id = toId(str(fd, "id"));
  if (id.toHexString() === me.id) throw new Error("You can't change your own access.");
  const set: Partial<AdminUser> = {};
  const role = str(fd, "role") as Role;
  if (ROLES.includes(role)) set.role = role;
  if (fd.has("active")) set.active = str(fd, "active") === "true";
  const db = await getDb();
  await db.collection<AdminUser>(COLLECTIONS.admins).updateOne({ _id: id }, { $set: set });
  if (set.active === false || set.role) await db.collection(COLLECTIONS.sessions).deleteMany({ userId: id });
  revalidatePath("/admin/users");
}

export async function changePasswordAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin("view");
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 12) return { message: "New password must be at least 12 characters." };
  const db = await getDb();
  const user = await db.collection<AdminUser>(COLLECTIONS.admins).findOne({ _id: new ObjectId(me.id) });
  if (!user || !(await verifyPassword(current, user.passwordHash))) return { message: "Your current password is incorrect." };
  await db.collection<AdminUser>(COLLECTIONS.admins).updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(next) } });
  return { ok: true, message: "Password changed." };
}
