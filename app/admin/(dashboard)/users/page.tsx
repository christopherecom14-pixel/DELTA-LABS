import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROLES, can, requireAdmin, type AdminUser } from "@/lib/server/auth";
import { COLLECTIONS, getDb } from "@/lib/server/db";
import { changePasswordAction, createUserAction, updateUserAction } from "../../actions";
import { ActionForm, SubmitButton } from "../../_components/action-form";
import { adminInput } from "../../_components/styles";

export const metadata: Metadata = { title: "Team" };

const ROLE_HELP: Record<string, string> = {
  admin: "Everything, plus team access, deletion and data retention",
  recruiter: "View, update status, score, schedule, add notes and export",
  viewer: "Read-only access to applicants",
};

const dateFmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });

export default async function UsersPage() {
  const me = await requireAdmin("view");
  if (!can(me.role, "manage")) redirect("/admin/recruitment");
  const db = await getDb();
  const users = await db.collection<AdminUser>(COLLECTIONS.admins).find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: 1 }).toArray();

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Team access</h1>
        <p className="mt-1 text-sm text-[#636873]">Who can sign in to the recruitment dashboard.</p>
      </div>

      <div className="rounded-[6px] border border-[#dfe2e9] bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f7f8fb] text-left text-xs font-semibold text-[#636873]">
            <tr>
              <th scope="col" className="px-4 py-3">Person</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Last sign-in</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef0f4]">
            {users.map((u) => {
              const self = u._id.toHexString() === me.id;
              return (
                <tr key={u._id.toHexString()} className={u.active ? "" : "opacity-60"}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{u.name} {self && <span className="text-xs font-normal text-[#87909f]">(you)</span>}</p>
                    <p className="text-xs text-[#636873]">{u.email}{!u.active && " · deactivated"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {self ? (
                      <span className="capitalize">{u.role}</span>
                    ) : (
                      <form action={updateUserAction} className="flex gap-2">
                        <input type="hidden" name="id" value={u._id.toHexString()} />
                        <label className="sr-only" htmlFor={`role-${u._id}`}>Role for {u.name}</label>
                        <select id={`role-${u._id}`} name="role" defaultValue={u.role} className={`${adminInput} admin-select w-32 cursor-pointer capitalize`}>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <SubmitButton variant="secondary">Save</SubmitButton>
                      </form>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#4b5263] whitespace-nowrap">{u.lastLoginAt ? dateFmt.format(u.lastLoginAt) : "Never"}</td>
                  <td className="px-4 py-3 text-right">
                    {!self && (
                      <form action={updateUserAction}>
                        <input type="hidden" name="id" value={u._id.toHexString()} />
                        <input type="hidden" name="active" value={u.active ? "false" : "true"} />
                        <SubmitButton variant="secondary">{u.active ? "Deactivate" : "Reactivate"}</SubmitButton>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-[6px] border border-[#dfe2e9] bg-white p-5">
          <h2 className="text-sm font-semibold">Add a team member</h2>
          <ActionForm action={createUserAction} className="mt-4 flex flex-col gap-3" resetOnSuccess>
            <div className="flex flex-col gap-1">
              <label htmlFor="new-name" className="text-xs font-semibold text-[#636873]">Name</label>
              <input id="new-name" name="name" required className={adminInput} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="new-email" className="text-xs font-semibold text-[#636873]">Email</label>
              <input id="new-email" name="email" type="email" required autoComplete="off" className={adminInput} />
            </div>
            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-xs font-semibold text-[#636873] mb-1">Role</legend>
              {ROLES.map((r) => (
                <label key={r} className="flex gap-2 items-start text-sm">
                  <input type="radio" name="role" value={r} defaultChecked={r === "recruiter"} className="mt-1 accent-[#2e4dff]" />
                  <span><span className="font-medium capitalize">{r}</span> <span className="text-[#636873]">— {ROLE_HELP[r]}</span></span>
                </label>
              ))}
            </fieldset>
            <div className="flex flex-col gap-1">
              <label htmlFor="new-password" className="text-xs font-semibold text-[#636873]">Temporary password (12+ characters)</label>
              <input id="new-password" name="password" type="password" minLength={12} required autoComplete="new-password" className={adminInput} />
            </div>
            <SubmitButton className="self-start">Add member</SubmitButton>
          </ActionForm>
        </section>

        <section className="rounded-[6px] border border-[#dfe2e9] bg-white p-5">
          <h2 className="text-sm font-semibold">Change your password</h2>
          <ActionForm action={changePasswordAction} className="mt-4 flex flex-col gap-3" resetOnSuccess>
            <div className="flex flex-col gap-1">
              <label htmlFor="current" className="text-xs font-semibold text-[#636873]">Current password</label>
              <input id="current" name="current" type="password" required autoComplete="current-password" className={adminInput} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="next" className="text-xs font-semibold text-[#636873]">New password (12+ characters)</label>
              <input id="next" name="next" type="password" minLength={12} required autoComplete="new-password" className={adminInput} />
            </div>
            <SubmitButton className="self-start">Change password</SubmitButton>
          </ActionForm>
        </section>
      </div>
    </div>
  );
}
