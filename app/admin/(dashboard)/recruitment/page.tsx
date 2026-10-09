import type { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import { AVAILABILITY, DEPARTMENTS, EXPERIENCE_LEVELS, PIPELINE, departmentName, labelFor } from "@/lib/recruitment/config";
import { listApplications, purgeExpiredDaily, type ListFilters } from "@/lib/server/applications";
import { can, requireAdmin } from "@/lib/server/auth";
import { purgeExpiredAction } from "../../actions";
import { ActionForm, SubmitButton } from "../../_components/action-form";
import { adminInput } from "../../_components/styles";
import { StatusBadge } from "../../_components/status-badge";

export const metadata: Metadata = { title: "Applicants" };

type Search = Record<string, string | undefined>;

const FILTER_KEYS = ["q", "status", "department", "experience", "availability", "city", "skill", "source", "duplicates", "sort"] as const;

function hrefWith(params: Search, patch: Search) {
  const next = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const v = k in patch ? patch[k] : params[k];
    if (v) next.set(k, v);
  }
  if (patch.page) next.set("page", patch.page);
  const qs = next.toString();
  return `/admin/recruitment${qs ? `?${qs}` : ""}`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });

export default async function ApplicantsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await requireAdmin("view");
  after(purgeExpiredDaily);
  const params = await searchParams;
  const filters: ListFilters = { ...params, page: Number(params.page) || 1 };
  const { items, total, page, pages, statusCounts } = await listApplications(filters);
  const allCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const hasFilters = FILTER_KEYS.some((k) => k !== "sort" && k !== "status" && params[k]);
  const exportQs = new URLSearchParams(Object.entries(params).filter(([k, v]) => v && k !== "page") as [string, string][]).toString();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Applicants</h1>
          <p className="mt-1 text-sm text-[#636873]">Internship applications from deltalabs.tech/careers/internships</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can(user.role, "export") && (
            <a href={`/api/admin/applications/export${exportQs ? `?${exportQs}` : ""}`} className="h-10 px-4 inline-flex items-center rounded-[3px] border border-[#d5dae3] bg-white text-sm font-semibold hover:border-[#171a21]">
              Export CSV ({total})
            </a>
          )}
        </div>
      </div>

      {params.deleted && (
        <p role="status" className="rounded-[4px] border border-[#abefc6] bg-[#ecfdf3] px-4 py-2.5 text-sm text-[#067647]">The application was permanently deleted.</p>
      )}

      {/* Pipeline tabs */}
      <nav aria-label="Pipeline status" className="flex gap-1 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {[{ id: "", label: "All" }, ...PIPELINE].map((p) => {
          const active = (params.status ?? "") === p.id;
          const count = p.id ? statusCounts[p.id] ?? 0 : allCount;
          return (
            <Link
              key={p.id || "all"}
              href={hrefWith(params, { status: p.id || undefined })}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 h-9 px-3 inline-flex items-center gap-2 rounded-[3px] text-sm font-medium border ${active ? "bg-[#171a21] text-white border-[#171a21]" : "bg-white border-[#dfe2e9] hover:border-[#9aa3b5]"}`}
            >
              {p.label}
              <span className={`tabular-nums text-xs ${active ? "text-white/70" : "text-[#87909f]"}`}>{count}</span>
            </Link>
          );
        })}
      </nav>

      {/* Filters */}
      <form method="get" className="rounded-[6px] border border-[#dfe2e9] bg-white p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {params.status && <input type="hidden" name="status" value={params.status} />}
        <div className="lg:col-span-2 flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-semibold text-[#636873]">Search</label>
          <input id="q" name="q" defaultValue={params.q} placeholder="Name, email, phone, reference, institute" className={adminInput} />
        </div>
        <FilterSelect name="department" label="Department" value={params.department} options={DEPARTMENTS.map((d) => ({ id: d.id, label: d.name }))} />
        <FilterSelect name="experience" label="Experience" value={params.experience} options={EXPERIENCE_LEVELS} />
        <FilterSelect name="availability" label="Availability" value={params.availability} options={AVAILABILITY} />
        <FilterSelect
          name="sort"
          label="Sort by"
          value={params.sort}
          placeholder="Newest first"
          options={[
            { id: "oldest", label: "Oldest first" },
            { id: "score", label: "Highest score" },
            { id: "name", label: "Name (A–Z)" },
            { id: "joining", label: "Earliest joining" },
          ]}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-xs font-semibold text-[#636873]">City</label>
          <input id="city" name="city" defaultValue={params.city} className={adminInput} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="skill" className="text-xs font-semibold text-[#636873]">Skill or tool</label>
          <input id="skill" name="skill" defaultValue={params.skill} placeholder="e.g. Canva" className={adminInput} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source" className="text-xs font-semibold text-[#636873]">UTM source</label>
          <input id="source" name="source" defaultValue={params.source} placeholder="e.g. facebook" className={adminInput} />
        </div>
        <label className="flex items-center gap-2 text-sm self-end h-10">
          <input type="checkbox" name="duplicates" value="1" defaultChecked={params.duplicates === "1"} className="h-4 w-4 accent-[#2e4dff]" />
          Possible duplicates only
        </label>
        <div className="flex gap-2 self-end lg:col-span-2 lg:justify-end">
          <button type="submit" className="h-10 px-4 rounded-[3px] bg-[#2e4dff] text-white text-sm font-semibold hover:bg-[#1534dc] cursor-pointer">Apply filters</button>
          {(hasFilters || params.sort) && (
            <Link href={hrefWith({}, { status: params.status })} className="h-10 px-4 inline-flex items-center rounded-[3px] border border-[#d5dae3] bg-white text-sm font-semibold">
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Results */}
      <div className="rounded-[6px] border border-[#dfe2e9] bg-white overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold">{allCount === 0 ? "No applications yet" : "No applicants match these filters"}</p>
            <p className="mt-1 text-sm text-[#636873]">
              {allCount === 0 ? "New applications from the careers page will appear here." : "Try removing a filter or searching for something else."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f7f8fb] text-left text-xs font-semibold text-[#636873]">
                <tr>
                  <th scope="col" className="px-4 py-3">Applicant</th>
                  <th scope="col" className="px-4 py-3">Department</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Score</th>
                  <th scope="col" className="px-4 py-3">Experience</th>
                  <th scope="col" className="px-4 py-3">City</th>
                  <th scope="col" className="px-4 py-3">Source</th>
                  <th scope="col" className="px-4 py-3">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef0f4]">
                {items.map((a) => (
                  <tr key={a._id.toHexString()} className="hover:bg-[#f7f8fb]">
                    <td className="px-4 py-3 min-w-[220px]">
                      <Link href={`/admin/recruitment/${a._id.toHexString()}`} className="font-semibold text-[#171a21] hover:text-[#2e4dff]">
                        {a.personal.fullName}
                      </Link>
                      <div className="text-xs text-[#636873] flex flex-wrap gap-x-2">
                        <span className="font-mono">{a.reference}</span>
                        {a.cv && <span>· CV</span>}
                        {a.duplicateRefs?.length > 0 && <span className="text-[#b54708] font-medium">· Possible duplicate</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{departmentName(a.department)}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">{a.totalScore ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#4b5263]">{labelFor(EXPERIENCE_LEVELS, a.experienceLevel)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#4b5263]">{a.personal.city}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#4b5263]">{a.attribution?.utm_source || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-[#4b5263]">{dateFmt.format(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
          <span className="text-[#636873]">
            Page {page} of {pages} · {total} applicants
          </span>
          <div className="flex gap-2">
            {page > 1 && <Link className="h-9 px-3 inline-flex items-center rounded-[3px] border border-[#d5dae3] bg-white" href={hrefWith(params, { page: String(page - 1) })}>← Previous</Link>}
            {page < pages && <Link className="h-9 px-3 inline-flex items-center rounded-[3px] border border-[#d5dae3] bg-white" href={hrefWith(params, { page: String(page + 1) })}>Next →</Link>}
          </div>
        </nav>
      )}

      {can(user.role, "manage") && (
        <section className="rounded-[6px] border border-[#dfe2e9] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">Data retention</h2>
            <p className="text-[13px] text-[#636873] max-w-2xl">
              Applications are kept for {process.env.APPLICATION_RETENTION_MONTHS || 12} months; selected and talent-pool candidates for {process.env.TALENT_POOL_RETENTION_MONTHS || 24} months from that
              decision. Expired records and CVs are deleted automatically once a day, or now:
            </p>
          </div>
          <ActionForm action={purgeExpiredAction} className="flex flex-col gap-1.5 items-start sm:items-end shrink-0">
            <SubmitButton variant="secondary">Delete expired applications</SubmitButton>
          </ActionForm>
        </section>
      )}
    </div>
  );
}

function FilterSelect({ name, label, value, options, placeholder = "All" }: { name: string; label: string; value?: string; options: readonly { id: string; label: string }[]; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-semibold text-[#636873]">{label}</label>
      <select id={name} name={name} defaultValue={value ?? ""} className={`${adminInput} admin-select cursor-pointer`}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
