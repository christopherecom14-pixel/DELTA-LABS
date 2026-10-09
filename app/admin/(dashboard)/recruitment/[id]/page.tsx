import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AVAILABILITY,
  COMMITMENT,
  DAILY_HOURS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  PIPELINE,
  SALARY_RANGES,
  SCORE_CRITERIA,
  STIPEND_COMFORT,
  WORKING_HOURS,
  YES_NO_MAYBE,
  departmentName,
  labelFor,
} from "@/lib/recruitment/config";
import { findByReferences, getActivity, getApplication } from "@/lib/server/applications";
import { can, requireAdmin } from "@/lib/server/auth";
import { addNoteAction, deleteApplicationAction, updateInterviewAction, updateScoresAction, updateStatusAction } from "../../../actions";
import { ActionForm, SubmitButton } from "../../../_components/action-form";
import { adminInput } from "../../../_components/styles";
import { StatusBadge } from "../../../_components/status-badge";

export const metadata: Metadata = { title: "Applicant" };

const PKT = "Asia/Karachi";
const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: PKT });
const dateOnly = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" });
const toPktInput = (d?: Date | null) => (d ? new Date(d.getTime() + 5 * 3600 * 1000).toISOString().slice(0, 16) : "");
const safeUrl = (u?: string) => (u && /^https?:\/\//i.test(u) ? u : null);

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-[6px] border border-[#dfe2e9] bg-white">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#eef0f4]">
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      <div className="px-4 sm:px-5 py-4">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-[#f0f2f5] -my-2">
      {rows.map(([k, v]) => (
        <div key={k} className="grid sm:grid-cols-[170px_1fr] gap-0.5 sm:gap-4 py-2 text-sm">
          <dt className="text-[#636873]">{k}</dt>
          <dd className="min-w-0 break-words whitespace-pre-line">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ApplicantPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin("view");
  const { id } = await params;
  const app = await getApplication(id);
  if (!app) notFound();
  const [history, duplicates] = await Promise.all([getActivity(app._id), findByReferences(app.duplicateRefs ?? [])]);
  const editable = can(user.role, "edit");
  const appId = app._id.toHexString();
  const phoneDigits = app.personal.phone.replace(/\D/g, "");
  const links = (["linkedin", "portfolio", "behance", "github"] as const)
    .map((k) => [k, safeUrl(app.skills[k])] as const)
    .filter(([, u]) => u);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/recruitment" className="text-sm font-medium text-[#636873] hover:text-[#171a21] w-fit">← All applicants</Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">{app.personal.fullName}</h1>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-sm text-[#636873]">
            <span className="font-mono">{app.reference}</span> · {departmentName(app.department)} · Applied {dateTime.format(app.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#636873]">Total score</p>
          {app.totalScore === null ? (
            <p className="text-sm font-medium text-[#636873] mt-1">Not yet evaluated</p>
          ) : (
            <p className="font-display text-3xl font-semibold tabular-nums">{app.totalScore}<span className="text-base text-[#87909f]">/100</span></p>
          )}
        </div>
      </header>

      {duplicates.length > 0 && (
        <div role="note" className="rounded-[4px] border border-[#fedf89] bg-[#fffaeb] px-4 py-3 text-sm text-[#93370d]">
          <strong>Possible duplicate.</strong> Another application uses the same email or phone:{" "}
          {duplicates.map((d, i) => (
            <span key={d.reference}>
              {i > 0 && ", "}
              <Link href={`/admin/recruitment/${d._id.toHexString()}`} className="underline font-mono">{d.reference}</Link> ({departmentName(d.department)}, {PIPELINE.find((p) => p.id === d.status)?.label})
            </span>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        {/* Applicant information */}
        <div className="flex flex-col gap-6 min-w-0">
          <Card title="Contact & education">
            <Rows
              rows={[
                ["Email", <a key="e" className="text-[#2e4dff] hover:underline" href={`mailto:${app.personal.email}`}>{app.personal.email}</a>],
                ["WhatsApp", <a key="w" className="text-[#2e4dff] hover:underline" href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer">{app.personal.phone}</a>],
                ["City", app.personal.city],
                ["Education", labelFor(EDUCATION_LEVELS, app.personal.education)],
                ["Institute", app.personal.institute],
                ["Semester / graduation", app.personal.semesterOrYear],
              ]}
            />
          </Card>

          <Card title="Career preferences & commitment">
            <Rows
              rows={[
                ["Department", departmentName(app.department)],
                ["Experience", labelFor(EXPERIENCE_LEVELS, app.career.experienceLevel)],
                ["Availability", labelFor(AVAILABILITY, app.career.availability)],
                ["Working hours", labelFor(WORKING_HOURS, app.career.workingHours)],
                ["Daily hours", labelFor(DAILY_HOURS, app.commitment.dailyHours)],
                ["Joining date", dateOnly.format(new Date(`${app.career.joiningDate}T00:00:00Z`))],
                ["Minimum commitment", labelFor(COMMITMENT, app.career.commitment)],
                ["Stipend structure", labelFor(STIPEND_COMFORT, app.commitment.stipendComfort)],
                ["On-site in Multan", app.commitment.canWorkOnsite === "yes" ? "Yes" : "No"],
                ["Open to full-time", labelFor(YES_NO_MAYBE, app.commitment.openToFullTime)],
                ["Future salary expectation", labelFor(SALARY_RANGES, app.commitment.salaryExpectation)],
              ]}
            />
          </Card>

          <Card title="Skills & experience">
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-[#636873] mb-1.5">Top skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.skills.topSkills.map((s) => <span key={s} className="rounded-[3px] bg-[#eef1ff] text-[#1d33b8] px-2 py-0.5">{s}</span>)}
                </div>
              </div>
              {app.skills.platforms.length > 0 && (
                <div>
                  <p className="text-[#636873] mb-1.5">Tools & platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.skills.platforms.map((s) => <span key={s} className="rounded-[3px] bg-[#f2f4f7] px-2 py-0.5">{s}</span>)}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[#636873] mb-1">Practical projects</p>
                <p className="whitespace-pre-line leading-relaxed">{app.skills.projects}</p>
              </div>
              {app.skills.workExperience && (
                <div>
                  <p className="text-[#636873] mb-1">Work experience</p>
                  <p className="whitespace-pre-line leading-relaxed">{app.skills.workExperience}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {links.map(([k, u]) => (
                  <a key={k} href={u!} target="_blank" rel="noopener noreferrer nofollow" className="h-9 px-3 inline-flex items-center rounded-[3px] border border-[#d5dae3] bg-white font-medium capitalize hover:border-[#171a21]">
                    {k} ↗
                  </a>
                ))}
                {app.cv ? (
                  <a href={`/api/admin/applications/${appId}/cv`} target="_blank" rel="noopener" className="h-9 px-3 inline-flex items-center rounded-[3px] bg-[#171a21] text-white font-medium">
                    View CV ({app.cv.size < 1024 * 1024 ? `${Math.max(1, Math.round(app.cv.size / 1024))} KB` : `${(app.cv.size / 1024 / 1024).toFixed(1)} MB`}) ↗
                  </a>
                ) : (
                  <span className="h-9 px-3 inline-flex items-center text-[#87909f]">No CV uploaded</span>
                )}
              </div>
            </div>
          </Card>

          <Card title="Screening answers">
            <div className="flex flex-col gap-5">
              {app.screening.map((s) => (
                <div key={s.questionId}>
                  <p className="text-sm font-semibold">{s.prompt}</p>
                  <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-[#323844]">{s.answer}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Source & attribution">
            <Rows
              rows={[
                ["UTM source / medium", [app.attribution?.utm_source, app.attribution?.utm_medium].filter(Boolean).join(" / ")],
                ["Campaign", app.attribution?.utm_campaign],
                ["Ad content / term", [app.attribution?.utm_content, app.attribution?.utm_term].filter(Boolean).join(" / ")],
                ["Click ID", app.attribution?.fbclid ? "Meta (fbclid)" : app.attribution?.gclid ? "Google (gclid)" : ""],
                ["Referrer", app.attribution?.referrer],
                ["Landing page", app.attribution?.landingPage],
                ["Retain until", dateOnly.format(app.retainUntil)],
              ]}
            />
          </Card>
        </div>

        {/* Recruiter tools */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-20">
          {editable ? (
            <>
              <Card title="Pipeline status">
                <ActionForm action={updateStatusAction} className="flex flex-col gap-2">
                  <input type="hidden" name="id" value={appId} />
                  <label htmlFor="status" className="sr-only">Status</label>
                  <div className="flex gap-2">
                    <select id="status" name="status" defaultValue={app.status} className={`${adminInput} admin-select cursor-pointer`}>
                      {PIPELINE.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    <SubmitButton>Update</SubmitButton>
                  </div>
                </ActionForm>
              </Card>

              <Card title="Evaluation">
                <ActionForm action={updateScoresAction} className="flex flex-col gap-3">
                  <input type="hidden" name="id" value={appId} />
                  {SCORE_CRITERIA.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3">
                      <label htmlFor={`score-${c.id}`} className="text-sm">
                        {c.label}
                        {(c.id === "availabilityCommitment" || c.id === "budgetAlignment") && <span className="block text-[11px] text-[#87909f]">Pre-filled from answers — adjust as needed</span>}
                      </label>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input id={`score-${c.id}`} name={c.id} type="number" min={0} max={c.max} step={1} inputMode="numeric" defaultValue={app.scores?.[c.id] ?? ""} className={`${adminInput} admin-select w-16 text-right tabular-nums`} />
                        <span className="text-xs text-[#87909f] w-7">/{c.max}</span>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#87909f] leading-snug">Scores are internal and only guide decisions. Nobody is rejected automatically based on a score or salary expectation.</p>
                  <SubmitButton className="self-start">Save evaluation</SubmitButton>
                </ActionForm>
              </Card>

              <Card title="Interview">
                <ActionForm action={updateInterviewAction} className="flex flex-col gap-3">
                  <input type="hidden" name="id" value={appId} />
                  <div className="flex flex-col gap-1">
                    <label htmlFor="scheduledAt" className="text-xs font-semibold text-[#636873]">Date & time (Pakistan time)</label>
                    <input id="scheduledAt" name="scheduledAt" type="datetime-local" defaultValue={toPktInput(app.interview?.scheduledAt)} className={adminInput} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="mode" className="text-xs font-semibold text-[#636873]">Format</label>
                      <select id="mode" name="mode" defaultValue={app.interview?.mode ?? ""} className={`${adminInput} admin-select cursor-pointer`}>
                        <option value="">—</option>
                        <option value="in-person">In person</option>
                        <option value="phone">Phone</option>
                        <option value="video">Video call</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="interviewer" className="text-xs font-semibold text-[#636873]">Interviewer</label>
                      <input id="interviewer" name="interviewer" defaultValue={app.interview?.interviewer} className={adminInput} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="location" className="text-xs font-semibold text-[#636873]">Location or link</label>
                    <input id="location" name="location" defaultValue={app.interview?.location} placeholder="BCG Chowk office" className={adminInput} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="outcome" className="text-xs font-semibold text-[#636873]">Outcome / feedback</label>
                    <textarea id="outcome" name="outcome" rows={3} defaultValue={app.interview?.outcome} className={`${adminInput} admin-select h-auto py-2`} />
                  </div>
                  <SubmitButton className="self-start">Save interview</SubmitButton>
                </ActionForm>
              </Card>

              <Card title="Add a note">
                <ActionForm action={addNoteAction} className="flex flex-col gap-2" resetOnSuccess>
                  <input type="hidden" name="id" value={appId} />
                  <label htmlFor="note" className="sr-only">Note</label>
                  <textarea id="note" name="note" rows={3} maxLength={3000} placeholder="Visible to the recruitment team only" className={`${adminInput} admin-select h-auto py-2`} />
                  <SubmitButton className="self-start">Add note</SubmitButton>
                </ActionForm>
              </Card>
            </>
          ) : (
            <Card title="Interview">
              <Rows rows={[["Scheduled", app.interview?.scheduledAt ? dateTime.format(app.interview.scheduledAt) : ""], ["Interviewer", app.interview?.interviewer], ["Outcome", app.interview?.outcome]]} />
            </Card>
          )}

          <Card title="Activity history">
            {history.length === 0 ? (
              <p className="text-sm text-[#636873]">No activity yet.</p>
            ) : (
              <ol className="flex flex-col gap-3.5">
                {history.map((h) => (
                  <li key={h._id.toHexString()} className={`text-sm border-l-2 pl-3 ${h.type === "note" ? "border-[#2e4dff]" : "border-[#dfe2e9]"}`}>
                    <p className="whitespace-pre-line break-words">{h.message}</p>
                    <p className="text-xs text-[#87909f] mt-0.5">
                      {h.actor?.name ?? "System"} · {dateTime.format(h.at)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          {can(user.role, "manage") && (
            <details className="rounded-[6px] border border-[#fecdca] bg-white">
              <summary className="px-4 sm:px-5 py-3 text-sm font-semibold text-[#b42318] cursor-pointer">Delete application</summary>
              <form action={deleteApplicationAction} className="px-4 sm:px-5 pb-4 flex flex-col gap-2">
                <input type="hidden" name="id" value={appId} />
                <p className="text-[13px] text-[#636873]">Permanently deletes this application, its CV and its history — for example after a deletion request. This cannot be undone.</p>
                <label htmlFor="confirm" className="text-xs font-semibold text-[#636873]">Type DELETE to confirm</label>
                <input id="confirm" name="confirm" required pattern="DELETE" autoComplete="off" className={adminInput} />
                <SubmitButton variant="danger" className="self-start">Delete permanently</SubmitButton>
              </form>
            </details>
          )}
        </aside>
      </div>
    </div>
  );
}
