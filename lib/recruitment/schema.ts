// Application validation, shared by the browser form (per-step feedback) and
// the API route (authoritative server-side validation).
import { z } from "zod";
import {
  AVAILABILITY,
  COMMITMENT,
  DAILY_HOURS,
  DEPARTMENT_IDS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  SALARY_RANGES,
  STIPEND_COMFORT,
  WORKING_HOURS,
  YES_NO_MAYBE,
} from "./config";

const ids = <T extends readonly { id: string }[]>(list: T) =>
  list.map((o) => o.id) as [T[number]["id"], ...T[number]["id"][]];

const choice = <T extends readonly { id: string }[]>(list: T, message: string) =>
  z.enum(ids(list), { error: message });

const text = (label: string, min: number, max: number) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(min, min <= 1 ? `${label} is required.` : `${label} needs at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, `${label} must be ${max} characters or fewer.`).optional().default("");

/** Normalises Pakistani mobile numbers to +923XXXXXXXXX; accepts other international numbers in E.164. */
export function normalizePhone(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, "");
  const pk = compact.match(/^(?:\+92|0092|92|0)?(3\d{9})$/);
  if (pk) return `+92${pk[1]}`;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;
  return null;
}

const phone = z
  .string({ error: "WhatsApp number is required." })
  .trim()
  .min(1, "WhatsApp number is required.")
  .transform((value, ctx) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid WhatsApp number, e.g. 0300 1234567." });
      return z.NEVER;
    }
    return normalized;
  });

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

const joiningDate = z
  .string({ error: "Joining date is required." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a joining date.")
  .refine((v) => {
    const today = isoDay(new Date(Date.now() - 24 * 3600 * 1000)); // allow for timezone skew
    const max = isoDay(new Date(Date.now() + 365 * 24 * 3600 * 1000));
    return v >= today && v <= max;
  }, "Choose a date between today and 12 months from now.");

const url = (label: string) =>
  z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("")
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .refine((v) => {
      if (!v) return true;
      try {
        const parsed = new URL(v);
        return parsed.hostname.includes(".");
      } catch {
        return false;
      }
    }, `Enter a valid ${label} link.`);

const tagList = (label: string, max: number) =>
  z
    .array(z.string().trim().min(1).max(60), { error: `Add at least one ${label}.` })
    .max(max, `Add no more than ${max} ${label}s.`);

// ---------------------------------------------------------------------------
// Step schemas
// ---------------------------------------------------------------------------

export const personalSchema = z.object({
  fullName: text("Full name", 3, 80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(120),
  phone,
  city: text("City", 2, 60),
  education: choice(EDUCATION_LEVELS, "Choose your education level."),
  institute: text("Institute", 2, 120),
  semesterOrYear: text("Semester or graduation year", 1, 40),
});

export const careerSchema = z.object({
  department: z.enum(DEPARTMENT_IDS, { error: "Choose a department." }),
  experienceLevel: choice(EXPERIENCE_LEVELS, "Choose your experience level."),
  availability: choice(AVAILABILITY, "Choose your availability."),
  workingHours: choice(WORKING_HOURS, "Choose your preferred working hours."),
  joiningDate,
  commitment: choice(COMMITMENT, "Choose a minimum commitment."),
});

export const skillsSchema = z.object({
  topSkills: tagList("skill", 10).min(1, "Add at least one skill."),
  platforms: tagList("platform", 20).default([]),
  projects: text("Practical projects", 20, 1500),
  workExperience: optionalText("Work experience", 1500),
  linkedin: url("LinkedIn"),
  portfolio: url("portfolio"),
  github: url("GitHub"),
  behance: url("Behance"),
});

export const screeningSchema = z.object({
  department: text("Your answer", 60, 2000),
  general_problem: text("Your answer", 40, 1200),
  general_learning: text("Your answer", 40, 1200),
});

export const commitmentSchema = z.object({
  stipendComfort: choice(STIPEND_COMFORT, "Let us know if the stipend works for you."),
  canWorkOnsite: z.enum(["yes", "no"], { error: "Let us know if you can work from the Multan office." }),
  dailyHours: choice(DAILY_HOURS, "Choose your daily hours."),
  openToFullTime: choice(YES_NO_MAYBE, "Let us know if you are open to full-time work."),
  salaryExpectation: choice(SALARY_RANGES, "Choose an expected salary range."),
});

export const attributionSchema = z
  .object({
    utm_source: z.string().max(150).optional(),
    utm_medium: z.string().max(150).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    fbclid: z.string().max(500).optional(),
    gclid: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    landingPage: z.string().max(500).optional(),
    firstSeenAt: z.string().max(40).optional(),
  })
  .partial()
  .default({});

export const applicationSchema = z
  .object({
    personal: personalSchema,
    career: careerSchema,
    skills: skillsSchema,
    screening: screeningSchema,
    commitment: commitmentSchema,
    consent: z.literal(true, { error: "Please confirm you have read the privacy notice." }),
    attribution: attributionSchema,
    // Anti-spam signals, never stored.
    website: z.string().max(200).optional(),
    startedAt: z.number().int().optional(),
  })
  .superRefine((value, ctx) => {
    for (const issue of conditionalSkillIssues(value.career, value.skills)) {
      ctx.addIssue({ code: "custom", path: ["skills", issue.field], message: issue.message });
    }
  });

/** Rules that depend on answers from other steps (used by the form and the server). */
export function conditionalSkillIssues(
  career: { department?: string; experienceLevel?: string },
  skills: { portfolio?: string; behance?: string; workExperience?: string },
) {
  const issues: { field: "portfolio" | "workExperience"; message: string }[] = [];
  if (career.department === "graphic-design" && !skills.portfolio?.trim() && !skills.behance?.trim()) {
    issues.push({ field: "portfolio", message: "Design applicants need a portfolio or Behance link." });
  }
  if ((career.experienceLevel === "some-experience" || career.experienceLevel === "experienced") && (skills.workExperience?.trim().length ?? 0) < 20) {
    issues.push({ field: "workExperience", message: "Briefly describe your relevant work experience (at least 20 characters)." });
  }
  return issues;
}

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;

export const STEP_SCHEMAS = {
  personal: personalSchema,
  career: careerSchema,
  skills: skillsSchema,
  screening: screeningSchema,
  commitment: commitmentSchema,
} as const;

/** Flattens zod issues into a { "personal.email": "message" } map (first message per field). */
export function issuesToFieldErrors(error: z.ZodError, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = [prefix, ...issue.path.map(String)].filter(Boolean).join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
