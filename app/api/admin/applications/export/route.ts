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
import { exportApplications, type ListFilters } from "@/lib/server/applications";
import { authorizeRequest } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quotes a CSV cell and neutralises spreadsheet formula injection. */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const auth = await authorizeRequest("export");
  if (auth instanceof Response) return auth;

  const params = Object.fromEntries(new URL(request.url).searchParams) as ListFilters & Record<string, string>;
  const rows = await exportApplications(params);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://deltalabs.tech";

  const header = [
    "Reference", "Applied (UTC)", "Status", "Total score", ...SCORE_CRITERIA.map((c) => `${c.label} (/${c.max})`),
    "Full name", "Email", "WhatsApp", "City", "Education", "Institute", "Semester / graduation",
    "Department", "Experience", "Availability", "Working hours", "Joining date", "Minimum commitment",
    "Top skills", "Tools & platforms", "LinkedIn", "Portfolio", "Behance", "GitHub", "Has CV",
    "Stipend comfort", "On-site", "Daily hours", "Open to full-time", "Salary expectation",
    "Interview at (UTC)", "Interviewer", "Possible duplicates",
    "UTM source", "UTM medium", "UTM campaign", "UTM content", "UTM term", "Click ID", "Referrer", "Profile link",
  ];

  const lines = rows.map((a) =>
    [
      a.reference, a.createdAt.toISOString(), PIPELINE.find((p) => p.id === a.status)?.label, a.totalScore ?? "", ...SCORE_CRITERIA.map((c) => a.scores?.[c.id] ?? ""),
      a.personal.fullName, a.personal.email, a.personal.phone, a.personal.city, labelFor(EDUCATION_LEVELS, a.personal.education), a.personal.institute, a.personal.semesterOrYear,
      departmentName(a.department), labelFor(EXPERIENCE_LEVELS, a.career.experienceLevel), labelFor(AVAILABILITY, a.career.availability), labelFor(WORKING_HOURS, a.career.workingHours), a.career.joiningDate, labelFor(COMMITMENT, a.career.commitment),
      a.skills.topSkills.join("; "), a.skills.platforms.join("; "), a.skills.linkedin, a.skills.portfolio, a.skills.behance, a.skills.github, a.cv ? "Yes" : "No",
      labelFor(STIPEND_COMFORT, a.commitment.stipendComfort), a.commitment.canWorkOnsite, labelFor(DAILY_HOURS, a.commitment.dailyHours), labelFor(YES_NO_MAYBE, a.commitment.openToFullTime), labelFor(SALARY_RANGES, a.commitment.salaryExpectation),
      a.interview?.scheduledAt ? new Date(a.interview.scheduledAt).toISOString() : "", a.interview?.interviewer ?? "", (a.duplicateRefs ?? []).join("; "),
      a.attribution?.utm_source, a.attribution?.utm_medium, a.attribution?.utm_campaign, a.attribution?.utm_content, a.attribution?.utm_term,
      a.attribution?.fbclid ? "fbclid" : a.attribution?.gclid ? "gclid" : "", a.attribution?.referrer, `${site}/admin/recruitment/${a._id.toHexString()}`,
    ].map(cell).join(","),
  );

  // BOM so Excel opens UTF-8 (Urdu names, etc.) correctly.
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="internship-applicants-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
