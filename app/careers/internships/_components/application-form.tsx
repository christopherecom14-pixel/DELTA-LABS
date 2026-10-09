"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { analytics, readAttribution } from "@/lib/analytics";
import {
  AVAILABILITY,
  COMMITMENT,
  CV_MAX_BYTES,
  CV_MAX_LABEL,
  DAILY_HOURS,
  DEPARTMENTS,
  EDUCATION_LEVELS,
  EXPERIENCE_LEVELS,
  GENERAL_QUESTIONS,
  OPPORTUNITY,
  SALARY_RANGES,
  STIPEND_COMFORT,
  WORKING_HOURS,
  YES_NO_MAYBE,
  departmentById,
  formatPkr,
  labelFor,
} from "@/lib/recruitment/config";
import { STEP_SCHEMAS, conditionalSkillIssues, issuesToFieldErrors } from "@/lib/recruitment/schema";
import { CheckboxPills, Field, RadioCards, Select, TagInput, TextArea, TextInput, fieldId } from "./fields";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface FormState {
  personal: { fullName: string; email: string; phone: string; city: string; education: string; institute: string; semesterOrYear: string };
  career: { department: string; experienceLevel: string; availability: string; workingHours: string; joiningDate: string; commitment: string };
  skills: { topSkills: string[]; platforms: string[]; projects: string; workExperience: string; linkedin: string; portfolio: string; github: string; behance: string };
  // Department answers are kept per department so switching doesn't lose work.
  screening: { byDepartment: Record<string, string>; general_problem: string; general_learning: string };
  commitment: { stipendComfort: string; canWorkOnsite: string; dailyHours: string; openToFullTime: string; salaryExpectation: string };
  consent: boolean;
}

const EMPTY: FormState = {
  personal: { fullName: "", email: "", phone: "", city: "Multan", education: "", institute: "", semesterOrYear: "" },
  career: { department: "", experienceLevel: "", availability: "", workingHours: "", joiningDate: "", commitment: "" },
  skills: { topSkills: [], platforms: [], projects: "", workExperience: "", linkedin: "", portfolio: "", github: "", behance: "" },
  screening: { byDepartment: {}, general_problem: "", general_learning: "" },
  commitment: { stipendComfort: "", canWorkOnsite: "", dailyHours: "", openToFullTime: "", salaryExpectation: "" },
  consent: false,
};

const STEPS = [
  { key: "personal", title: "Personal information", short: "You" },
  { key: "career", title: "Career preferences", short: "Role" },
  { key: "skills", title: "Skills & experience", short: "Skills" },
  { key: "screening", title: "Screening questions", short: "Questions" },
  { key: "commitment", title: "Stipend & commitment", short: "Commitment" },
  { key: "review", title: "Review & submit", short: "Submit" },
] as const;

const DRAFT_KEY = "dl_internship_draft_v1";
const DRAFT_TTL_MS = 14 * 24 * 3600 * 1000;
export const SELECT_DEPARTMENT_EVENT = "dl:select-department";

type Errors = Record<string, string>;
type Status = "idle" | "submitting" | "success";

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16));

const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const maxDateIso = () => new Date(Date.now() + 364 * 24 * 3600 * 1000).toISOString().slice(0, 10);

const formatDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

/** Builds the API payload shape from the form state. */
function toPayload(s: FormState) {
  return {
    personal: s.personal,
    career: s.career,
    skills: s.skills,
    screening: {
      department: s.screening.byDepartment[s.career.department] ?? "",
      general_problem: s.screening.general_problem,
      general_learning: s.screening.general_learning,
    },
    commitment: s.commitment,
    consent: s.consent,
  };
}

function validateStep(stepIndex: number, s: FormState): Errors {
  const payload = toPayload(s);
  const key = STEPS[stepIndex].key;
  if (key === "review") return s.consent ? {} : { consent: "Please confirm you have read the privacy notice." };

  const schema = STEP_SCHEMAS[key];
  const result = schema.safeParse(payload[key]);
  const errors: Errors = result.success ? {} : issuesToFieldErrors(result.error, key);

  if (key === "skills") {
    for (const issue of conditionalSkillIssues(s.career, s.skills)) errors[`skills.${issue.field}`] ??= issue.message;
  }
  if (key === "commitment") {
    // The joining date is confirmed again on this step.
    const date = STEP_SCHEMAS.career.shape.joiningDate.safeParse(s.career.joiningDate);
    if (!date.success) errors["career.joiningDate"] = date.error.issues[0].message;
  }
  return errors;
}

const stepOfField = (field: string) => {
  if (field === "career.joiningDate") return 1;
  const idx = STEPS.findIndex((st) => field.startsWith(`${st.key}.`));
  return idx === -1 ? STEPS.length - 1 : idx;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ApplicationForm() {
  const [state, setState] = useState<FormState>(EMPTY);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState("");
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const meta = useRef({ submissionId: "", startedAt: 0 });
  const submitting = useRef(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const formTop = useRef<HTMLDivElement>(null);
  const movedStep = useRef(false);

  // Restore a saved draft (CV files are never stored on the device).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && Date.now() - saved.savedAt < DRAFT_TTL_MS && saved.state) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from device storage
        setState({ ...EMPTY, ...saved.state, consent: false });
        setStep(Math.min(saved.step ?? 0, STEPS.length - 1));
        meta.current = { submissionId: saved.submissionId || uuid(), startedAt: saved.startedAt || 0 };
        setRestored(true);
      }
    } catch {
      // Ignore unreadable drafts.
    }
    if (!meta.current.submissionId) meta.current.submissionId = uuid();
    setHydrated(true);
  }, []);

  // Auto-save the draft while the applicant works.
  useEffect(() => {
    if (!hydrated || status === "success" || !meta.current.startedAt) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ state: { ...state, consent: false }, step, savedAt: Date.now(), ...meta.current }),
        );
      } catch {
        // Storage full or blocked: the form still works without drafts.
      }
    }, 400);
    return () => clearTimeout(t);
  }, [state, step, hydrated, status]);

  // "Apply for <department>" buttons elsewhere on the page preselect a department.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!departmentById(id)) return;
      setState((s) => (s.career.department ? s : { ...s, career: { ...s.career, department: id } }));
    };
    window.addEventListener(SELECT_DEPARTMENT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_DEPARTMENT_EVENT, onSelect);
  }, []);

  // Move focus to the step heading after navigating between steps.
  useEffect(() => {
    if (!movedStep.current) return;
    movedStep.current = false;
    stepHeading.current?.focus({ preventScroll: true });
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, status]);

  const markStarted = useCallback(() => {
    if (meta.current.startedAt) return;
    meta.current.startedAt = Date.now();
    analytics.formStart();
  }, []);

  const update = <K extends keyof FormState>(section: K, patch: Partial<FormState[K]>) => {
    markStarted();
    setState((s) => ({ ...s, [section]: { ...(s[section] as object), ...patch } }));
    const keys = Object.keys(patch).map((k) => `${section}.${k}`);
    setErrors((e) => {
      if (!keys.some((k) => e[k])) return e;
      const next = { ...e };
      for (const k of keys) delete next[k];
      return next;
    });
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(fieldId(first));
      const target = el?.matches("input,select,textarea") ? el : el?.querySelector<HTMLElement>("input,select,textarea");
      (target ?? el)?.focus();
      (target ?? el)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const goTo = (index: number) => {
    movedStep.current = true;
    setErrors({});
    setSubmitError("");
    setStep(index);
  };

  const next = () => {
    const errs = validateStep(step, state);
    if (step === 2 && cv && cv.size > CV_MAX_BYTES) errs["skills.cv"] = `CV must be ${CV_MAX_LABEL} or smaller.`;
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }
    analytics.stepComplete(step + 1, STEPS[step].key);
    if (step === 1) analytics.departmentSelected(state.career.department);
    goTo(step + 1);
  };

  const startOver = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setState(EMPTY);
    setCv(null);
    meta.current = { submissionId: uuid(), startedAt: 0 };
    setRestored(false);
    goTo(0);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== STEPS.length - 1) return next();
    if (submitting.current) return; // guards against double clicks before re-render

    // Re-validate everything; jump to the first step with a problem.
    const all: Errors = {};
    STEPS.forEach((_, i) => Object.assign(all, validateStep(i, state)));
    if (Object.keys(all).length) {
      const first = Math.min(...Object.keys(all).map(stepOfField));
      if (first !== step) goTo(first);
      setErrors(all);
      focusFirstError(all);
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setSubmitError("");

    const body = new FormData();
    body.append("submissionId", meta.current.submissionId);
    body.append(
      "payload",
      JSON.stringify({ ...toPayload(state), attribution: readAttribution(), website: honeypot, startedAt: meta.current.startedAt || undefined }),
    );
    if (cv) body.append("cv", cv, cv.name);

    try {
      const res = await fetch("/api/careers/applications", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reference) {
        setReference(data.reference);
        setStatus("success");
        movedStep.current = true;
        analytics.lead(meta.current.submissionId, state.career.department);
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {}
        return;
      }
      if (res.status === 422 && data.fieldErrors) {
        const errs = data.fieldErrors as Errors;
        const first = Math.min(...Object.keys(errs).map(stepOfField));
        if (first !== step) goTo(first);
        setErrors(errs);
        focusFirstError(errs);
      }
      setSubmitError(data.error || "Something went wrong. Please try again.");
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again — your answers are saved.");
    } finally {
      submitting.current = false;
      setStatus((s) => (s === "success" ? s : "idle"));
    }
  };

  // -------------------------------------------------------------------------

  if (status === "success") {
    return (
      <div ref={formTop} className="scroll-mt-28">
        <SuccessPanel reference={reference} department={state.career.department} headingRef={stepHeading} />
      </div>
    );
  }

  const department = departmentById(state.career.department);
  const err = (name: string) => errors[name];
  const errorCount = Object.keys(errors).length;

  return (
    <div ref={formTop} className="scroll-mt-24 sm:scroll-mt-28">
      <Progress step={step} onJump={(i) => i < step && goTo(i)} />

      {restored && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#cdd6ff] bg-[#eef1ff] px-4 py-3 text-sm text-[#1d33b8]">
          <span>We restored your saved draft on this device{cv ? "" : ". If you added a CV, please attach it again"}.</span>
          <button type="button" onClick={startOver} className="font-semibold underline underline-offset-2 cursor-pointer min-h-10">
            Start over
          </button>
        </div>
      )}

      <form noValidate onSubmit={submit} onFocus={markStarted} className="mt-6 sm:mt-8" aria-describedby="form-status">
        {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
        </div>

        <h3 ref={stepHeading} tabIndex={-1} className="font-display text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] text-[#171a21] focus:outline-none">
          {STEPS[step].title}
        </h3>

        <div id="form-status" aria-live="polite" className="sr-only">
          {errorCount ? `${errorCount} ${errorCount === 1 ? "answer needs" : "answers need"} attention.` : ""}
        </div>
        {errorCount > 0 && (
          <div role="alert" className="mt-4 rounded-[4px] border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
            Please check the {errorCount === 1 ? "highlighted answer" : `${errorCount} highlighted answers`} below.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-6">
          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="personal.fullName" label="Full name" required error={err("personal.fullName")}>
                  <TextInput name="personal.fullName" autoComplete="name" value={state.personal.fullName} onChange={(v) => update("personal", { fullName: v })} error={err("personal.fullName")} required />
                </Field>
                <Field name="personal.email" label="Email address" required error={err("personal.email")}>
                  <TextInput name="personal.email" type="email" inputMode="email" autoComplete="email" value={state.personal.email} onChange={(v) => update("personal", { email: v })} error={err("personal.email")} required />
                </Field>
                <Field name="personal.phone" label="WhatsApp number" required hint="We'll use this to arrange interviews." error={err("personal.phone")}>
                  <TextInput name="personal.phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0300 1234567" value={state.personal.phone} onChange={(v) => update("personal", { phone: v })} error={err("personal.phone")} hint required />
                </Field>
                <Field name="personal.city" label="City you live in" required error={err("personal.city")}>
                  <TextInput name="personal.city" autoComplete="address-level2" value={state.personal.city} onChange={(v) => update("personal", { city: v })} error={err("personal.city")} required />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="personal.education" label="Education" required error={err("personal.education")}>
                  <Select name="personal.education" value={state.personal.education} onChange={(v) => update("personal", { education: v })} options={EDUCATION_LEVELS} error={err("personal.education")} required placeholder="Highest or current level" />
                </Field>
                <Field name="personal.institute" label="Institute" required error={err("personal.institute")}>
                  <TextInput name="personal.institute" placeholder="University, college or institute" value={state.personal.institute} onChange={(v) => update("personal", { institute: v })} error={err("personal.institute")} required />
                </Field>
                <Field name="personal.semesterOrYear" label="Current semester or graduation year" required error={err("personal.semesterOrYear")}>
                  <TextInput name="personal.semesterOrYear" placeholder="e.g. 6th semester, or Graduated 2025" value={state.personal.semesterOrYear} onChange={(v) => update("personal", { semesterOrYear: v })} error={err("personal.semesterOrYear")} required />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field as="fieldset" name="career.department" label="Which department are you applying for?" required error={err("career.department")}>
                <RadioCards
                  name="career.department"
                  value={state.career.department}
                  onChange={(v) => update("career", { department: v })}
                  options={DEPARTMENTS.map((d) => ({ id: d.id, label: d.name, description: d.summary }))}
                  error={err("career.department")}
                />
              </Field>
              <Field as="fieldset" name="career.experienceLevel" label="Experience level" required error={err("career.experienceLevel")}>
                <RadioCards name="career.experienceLevel" value={state.career.experienceLevel} onChange={(v) => update("career", { experienceLevel: v })} options={EXPERIENCE_LEVELS} error={err("career.experienceLevel")} columns={4} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="career.availability" label="Availability" required error={err("career.availability")}>
                  <Select name="career.availability" value={state.career.availability} onChange={(v) => update("career", { availability: v })} options={AVAILABILITY} error={err("career.availability")} required />
                </Field>
                <Field name="career.workingHours" label="Preferred working hours" required error={err("career.workingHours")}>
                  <Select name="career.workingHours" value={state.career.workingHours} onChange={(v) => update("career", { workingHours: v })} options={WORKING_HOURS} error={err("career.workingHours")} required />
                </Field>
                <Field name="career.joiningDate" label="Earliest joining date" required error={err("career.joiningDate")}>
                  <TextInput name="career.joiningDate" type="date" min={todayIso()} max={maxDateIso()} value={state.career.joiningDate} onChange={(v) => update("career", { joiningDate: v })} error={err("career.joiningDate")} required />
                </Field>
                <Field name="career.commitment" label="Minimum internship commitment" required error={err("career.commitment")}>
                  <Select name="career.commitment" value={state.career.commitment} onChange={(v) => update("career", { commitment: v })} options={COMMITMENT} error={err("career.commitment")} required />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field name="skills.topSkills" label="Your top skills" required hint="Type a skill and press Enter. Up to 10." error={err("skills.topSkills")}>
                <TagInput name="skills.topSkills" values={state.skills.topSkills} onChange={(v) => update("skills", { topSkills: v })} error={err("skills.topSkills")} hint placeholder="e.g. Copywriting, Canva, Cold calling" />
              </Field>

              {department && (
                <Field as="fieldset" name="skills.platforms" label={`Tools and platforms you've used for ${department.name}`} hint="Select any that apply." error={err("skills.platforms")}>
                  <CheckboxPills
                    name="skills.platforms"
                    options={department.platforms}
                    values={state.skills.platforms.filter((p) => (department.platforms as readonly string[]).includes(p))}
                    onChange={(selected) =>
                      update("skills", { platforms: [...selected, ...state.skills.platforms.filter((p) => !(department.platforms as readonly string[]).includes(p))] })
                    }
                  />
                </Field>
              )}
              <Field name="skills.otherPlatforms" label="Other tools or technologies" hint="Type and press Enter.">
                <TagInput
                  name="skills.otherPlatforms"
                  values={state.skills.platforms.filter((p) => !(department?.platforms as readonly string[] | undefined)?.includes(p))}
                  onChange={(others) =>
                    update("skills", { platforms: [...state.skills.platforms.filter((p) => (department?.platforms as readonly string[] | undefined)?.includes(p)), ...others] })
                  }
                  hint
                  max={10}
                  placeholder="e.g. WordPress, ChatGPT, Excel"
                />
              </Field>

              <Field name="skills.projects" label="Practical projects" required hint="Coursework, freelance, personal or volunteer work. What did you make and what was the result?" error={err("skills.projects")}>
                <TextArea name="skills.projects" value={state.skills.projects} onChange={(v) => update("skills", { projects: v })} error={err("skills.projects")} hint required min={20} max={1500} />
              </Field>

              {(() => {
                const required = state.career.experienceLevel === "some-experience" || state.career.experienceLevel === "experienced";
                return (
                  <Field name="skills.workExperience" label="Relevant work experience" required={required} hint="Role, organisation, duration and what you were responsible for." error={err("skills.workExperience")}>
                    <TextArea name="skills.workExperience" value={state.skills.workExperience} onChange={(v) => update("skills", { workExperience: v })} error={err("skills.workExperience")} hint required={required} min={required ? 20 : undefined} max={1500} rows={4} />
                  </Field>
                );
              })()}

              <LinkFields
                state={state}
                update={(patch) => update("skills", patch)}
                errors={errors}
              />

              <CvUpload file={cv} onChange={(f) => { markStarted(); setCv(f); setErrors((e) => { const n = { ...e }; delete n["skills.cv"]; return n; }); }} error={err("skills.cv")} />
            </>
          )}

          {step === 3 && department && (
            <>
              <Field name="screening.department" label={department.question.prompt} required hint={department.question.hint} error={err("screening.department")}>
                <TextArea
                  name="screening.department"
                  value={state.screening.byDepartment[department.id] ?? ""}
                  onChange={(v) => update("screening", { byDepartment: { ...state.screening.byDepartment, [department.id]: v } })}
                  error={err("screening.department")}
                  hint
                  required
                  min={60}
                  max={2000}
                  rows={7}
                />
              </Field>
              {GENERAL_QUESTIONS.map((q) => (
                <Field key={q.id} name={`screening.${q.id}`} label={q.prompt} required error={err(`screening.${q.id}`)}>
                  <TextArea name={`screening.${q.id}`} value={state.screening[q.id]} onChange={(v) => update("screening", { [q.id]: v })} error={err(`screening.${q.id}`)} required min={40} max={1200} />
                </Field>
              ))}
              <p className="text-[13px] text-[#636873]">Answer in your own words — there are no trick questions. Clear thinking matters more than perfect English.</p>
            </>
          )}

          {step === 4 && (
            <>
              <StipendCard />
              <Field as="fieldset" name="commitment.stipendComfort" label="Are you comfortable with the published stipend structure?" required error={err("commitment.stipendComfort")}>
                <RadioCards name="commitment.stipendComfort" value={state.commitment.stipendComfort} onChange={(v) => update("commitment", { stipendComfort: v })} options={STIPEND_COMFORT} error={err("commitment.stipendComfort")} columns={3} />
              </Field>
              <Field as="fieldset" name="commitment.canWorkOnsite" label={`Can you work on-site from our Multan office (${OPPORTUNITY.location})?`} required error={err("commitment.canWorkOnsite")}>
                <RadioCards name="commitment.canWorkOnsite" value={state.commitment.canWorkOnsite} onChange={(v) => update("commitment", { canWorkOnsite: v })} options={[{ id: "yes", label: "Yes" }, { id: "no", label: "No" }]} error={err("commitment.canWorkOnsite")} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="career.joiningDate" label="What date can you join?" required hint="Confirm or update the date from step 2." error={err("career.joiningDate")}>
                  <TextInput name="career.joiningDate" type="date" min={todayIso()} max={maxDateIso()} value={state.career.joiningDate} onChange={(v) => update("career", { joiningDate: v })} error={err("career.joiningDate")} hint required />
                </Field>
                <Field name="commitment.dailyHours" label="How many hours can you commit daily?" required error={err("commitment.dailyHours")}>
                  <Select name="commitment.dailyHours" value={state.commitment.dailyHours} onChange={(v) => update("commitment", { dailyHours: v })} options={DAILY_HOURS} error={err("commitment.dailyHours")} required />
                </Field>
              </div>
              <Field as="fieldset" name="commitment.openToFullTime" label="Are you open to future full-time employment?" required error={err("commitment.openToFullTime")}>
                <RadioCards name="commitment.openToFullTime" value={state.commitment.openToFullTime} onChange={(v) => update("commitment", { openToFullTime: v })} options={YES_NO_MAYBE} error={err("commitment.openToFullTime")} columns={3} />
              </Field>
              <Field
                name="commitment.salaryExpectation"
                label="If considered for a future paid position, what monthly salary range would you expect?"
                required
                hint="This is for future planning only. It does not affect the internship stipend or your eligibility."
                error={err("commitment.salaryExpectation")}
              >
                <Select name="commitment.salaryExpectation" value={state.commitment.salaryExpectation} onChange={(v) => update("commitment", { salaryExpectation: v })} options={SALARY_RANGES} error={err("commitment.salaryExpectation")} hint required />
              </Field>
            </>
          )}

          {step === 5 && <Review state={state} cv={cv} onEdit={goTo} consentError={err("consent")} onConsent={(v) => { setState((s) => ({ ...s, consent: v })); setErrors((e) => { const n = { ...e }; delete n.consent; return n; }); }} />}
        </div>

        {submitError && (
          <div role="alert" className="mt-6 rounded-[4px] border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
            {submitError}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#dfe2e9] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} disabled={status === "submitting"} className="h-12 px-5 rounded-[3px] border border-[#d5dae3] bg-white text-sm font-semibold text-[#171a21] hover:border-[#171a21] transition-colors cursor-pointer disabled:opacity-50">
              ← Back
            </button>
          ) : (
            <span className="text-[13px] text-[#636873]">Takes about 10–15 minutes. Your progress saves automatically on this device.</span>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className="h-12 sm:h-[52px] px-6 rounded-[3px] bg-[#2e4dff] text-white text-sm font-semibold inline-flex items-center justify-center gap-6 hover:bg-[#1534dc] transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-80"
          >
            {status === "submitting" ? (
              <>
                <Spinner /> {cv ? "Uploading and submitting…" : "Submitting…"}
              </>
            ) : step === STEPS.length - 1 ? (
              <>Submit application <span aria-hidden="true">↗</span></>
            ) : (
              <>Continue <span aria-hidden="true">→</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Progress({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[13px]">
        <span className="font-semibold text-[#171a21]">
          Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-[#636873]">{STEPS[step].title}</span>
      </div>
      <div className="mt-2.5 h-1 w-full rounded-full bg-[#e4e8f0] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Application progress">
        <div className="h-full bg-[#2e4dff] transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-3 hidden sm:grid grid-cols-6 gap-2 text-[12px]">
        {STEPS.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i >= step}
              aria-current={i === step ? "step" : undefined}
              className={`w-full text-left py-1 ${i === step ? "text-[#2e4dff] font-semibold" : i < step ? "text-[#171a21] hover:text-[#2e4dff] cursor-pointer" : "text-[#87909f]"}`}
            >
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {s.short}
              {i < step && <span className="sr-only"> (completed, go back to edit)</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LinkFields({ state, update, errors }: { state: FormState; update: (p: Partial<FormState["skills"]>) => void; errors: Errors }) {
  const dept = departmentById(state.career.department);
  const isDesign = dept?.id === "graphic-design";
  const primary: readonly string[] = dept?.links ?? ["linkedin", "portfolio"];
  const LINKS = [
    { id: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/your-name" },
    { id: "portfolio", label: isDesign ? "Portfolio (portfolio or Behance required)" : "Portfolio or website", placeholder: "your-portfolio.com" },
    { id: "behance", label: "Behance", placeholder: "behance.net/your-name" },
    { id: "github", label: "GitHub", placeholder: "github.com/your-name" },
  ] as const;
  const ordered = [...LINKS.filter((l) => primary.includes(l.id)), ...LINKS.filter((l) => !primary.includes(l.id))];
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-semibold text-[#171a21] mb-1">
        Profile & work links <span className="font-normal text-[#87909f]">{isDesign ? "(portfolio or Behance required)" : "(optional)"}</span>
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {ordered.map((l) => (
          <div key={l.id} className="flex flex-col gap-1.5 min-w-0">
            <label htmlFor={fieldId(`skills.${l.id}`)} className="text-[13px] font-medium text-[#636873]">
              {l.label}
            </label>
            <TextInput
              name={`skills.${l.id}`}
              type="url"
              inputMode="url"
              placeholder={l.placeholder}
              value={state.skills[l.id]}
              onChange={(v) => update({ [l.id]: v })}
              error={errors[`skills.${l.id}`]}
            />
            {errors[`skills.${l.id}`] && (
              <p id={`${fieldId(`skills.${l.id}`)}-error`} className="text-[13px] font-medium text-[#b42318]">
                {errors[`skills.${l.id}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function CvUpload({ file, onChange, error }: { file: File | null; onChange: (f: File | null) => void; error?: string }) {
  const [localError, setLocalError] = useState("");
  const shown = localError || error;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Field name="skills.cv" label="CV / résumé (PDF)" hint={`PDF only, up to ${CV_MAX_LABEL}. Optional, but it helps us review your application.`} error={shown}>
      <div className={`rounded-[4px] border border-dashed p-4 flex flex-wrap items-center gap-3 justify-between ${shown ? "border-[#d92d20] bg-[#fef3f2]" : "border-[#b9c0cc] bg-[#f7f8fb]"}`}>
        {file ? (
          <span className="text-sm text-[#171a21] min-w-0 break-all">
            <span aria-hidden="true">📄 </span>
            {file.name} <span className="text-[#636873]">· {(file.size / 1024 / 1024).toFixed(1)} MB</span>
          </span>
        ) : (
          <span className="text-sm text-[#636873]">No file selected</span>
        )}
        <div className="flex gap-2">
          {file && (
            <button type="button" onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }} className="h-10 px-3 text-sm font-semibold text-[#b42318] cursor-pointer">
              Remove
            </button>
          )}
          <label className="h-10 px-4 inline-flex items-center rounded-[3px] border border-[#171a21] bg-white text-sm font-semibold cursor-pointer hover:bg-[#171a21] hover:text-white transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2e4dff]/40">
            {file ? "Replace file" : "Choose PDF"}
            <input
              ref={inputRef}
              id={fieldId("skills.cv")}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              aria-describedby={`${fieldId("skills.cv")}-hint`}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setLocalError("");
                if (!f) return;
                if (!/\.pdf$/i.test(f.name) || (f.type && f.type !== "application/pdf")) {
                  setLocalError("Please choose a PDF file.");
                  e.target.value = "";
                  return;
                }
                if (f.size > CV_MAX_BYTES) {
                  setLocalError(`That file is ${(f.size / 1024 / 1024).toFixed(1)} MB. Please upload a PDF of ${CV_MAX_LABEL} or less.`);
                  e.target.value = "";
                  return;
                }
                onChange(f);
              }}
            />
          </label>
        </div>
      </div>
    </Field>
  );
}

export function StipendCard() {
  return (
    <div className="rounded-[4px] border border-[#cdd6ff] bg-[#f3f5ff] p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2e4dff]">Published stipend structure</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-[13px] text-[#636873]">Monthly stipend</p>
          <p className="font-display text-2xl font-semibold text-[#171a21]">{formatPkr(OPPORTUNITY.stipendBase)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#636873]">Possible increase</p>
          <p className="font-display text-2xl font-semibold text-[#171a21]">up to {formatPkr(OPPORTUNITY.stipendUpper)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#636873]">Arrangement</p>
          <p className="font-display text-2xl font-semibold text-[#171a21]">On-site, Multan</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-[#4b5263]">
        The higher stipend depends on your skills, role and evaluation. Internship completion does not guarantee employment.
      </p>
    </div>
  );
}

function ReviewSection({ title, step, onEdit, rows }: { title: string; step: number; onEdit: (i: number) => void; rows: [string, React.ReactNode][] }) {
  return (
    <section className="rounded-[4px] border border-[#dfe2e9] bg-white">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#dfe2e9]">
        <h4 className="text-sm font-semibold text-[#171a21]">{title}</h4>
        <button type="button" onClick={() => onEdit(step)} className="text-sm font-semibold text-[#2e4dff] hover:underline min-h-10 px-1 cursor-pointer">
          Edit<span className="sr-only"> {title}</span>
        </button>
      </div>
      <dl className="px-4 sm:px-5 py-2 divide-y divide-[#eef0f4]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-2.5 text-sm">
            <dt className="text-[#636873]">{k}</dt>
            <dd className="text-[#171a21] break-words whitespace-pre-line min-w-0">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const truncate = (s: string, n = 220) => (s.length > n ? `${s.slice(0, n).trim()}…` : s);

function Review({ state, cv, onEdit, consentError, onConsent }: { state: FormState; cv: File | null; onEdit: (i: number) => void; consentError?: string; onConsent: (v: boolean) => void }) {
  const dept = departmentById(state.career.department);
  const links = (["linkedin", "portfolio", "behance", "github"] as const).map((k) => state.skills[k]).filter(Boolean).join("\n");
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#636873]">Check your answers before submitting. You can edit any section.</p>
      <ReviewSection title="Personal information" step={0} onEdit={onEdit} rows={[
        ["Name", state.personal.fullName],
        ["Email", state.personal.email],
        ["WhatsApp", state.personal.phone],
        ["City", state.personal.city],
        ["Education", `${labelFor(EDUCATION_LEVELS, state.personal.education)} · ${state.personal.institute} · ${state.personal.semesterOrYear}`],
      ]} />
      <ReviewSection title="Career preferences" step={1} onEdit={onEdit} rows={[
        ["Department", dept?.name],
        ["Experience", labelFor(EXPERIENCE_LEVELS, state.career.experienceLevel)],
        ["Availability", `${labelFor(AVAILABILITY, state.career.availability)} · ${labelFor(WORKING_HOURS, state.career.workingHours)}`],
        ["Minimum commitment", labelFor(COMMITMENT, state.career.commitment)],
      ]} />
      <ReviewSection title="Skills & experience" step={2} onEdit={onEdit} rows={[
        ["Top skills", state.skills.topSkills.join(", ")],
        ["Tools & platforms", state.skills.platforms.join(", ")],
        ["Projects", truncate(state.skills.projects)],
        ["Work experience", truncate(state.skills.workExperience)],
        ["Links", links],
        ["CV", cv ? cv.name : "Not attached"],
      ]} />
      <ReviewSection title="Screening questions" step={3} onEdit={onEdit} rows={[
        [dept?.name ?? "Department", truncate(state.screening.byDepartment[state.career.department] ?? "")],
        ["Problem solving", truncate(state.screening.general_problem)],
        ["Learning", truncate(state.screening.general_learning)],
      ]} />
      <ReviewSection title="Stipend & commitment" step={4} onEdit={onEdit} rows={[
        ["Stipend structure", labelFor(STIPEND_COMFORT, state.commitment.stipendComfort)],
        ["On-site in Multan", state.commitment.canWorkOnsite === "yes" ? "Yes" : state.commitment.canWorkOnsite === "no" ? "No" : ""],
        ["Joining date", formatDate(state.career.joiningDate)],
        ["Daily hours", labelFor(DAILY_HOURS, state.commitment.dailyHours)],
        ["Open to full-time", labelFor(YES_NO_MAYBE, state.commitment.openToFullTime)],
        ["Future salary expectation", labelFor(SALARY_RANGES, state.commitment.salaryExpectation)],
      ]} />

      <div className="rounded-[4px] bg-[#f0f3f8] p-4 sm:p-5 text-[13px] leading-relaxed text-[#4b5263]">
        <h4 className="text-sm font-semibold text-[#171a21] mb-2">Privacy notice</h4>
        <p>
          Delta Labs uses the information in this application only to assess you for internships and related roles. It is visible to our recruitment team only, is
          never sold, and is never shared with advertising platforms. We keep applications for up to 12 months — or up to 24 months if you are added to our talent pool
          for future openings — and then delete them. You can ask us to see, correct or delete your application at any time by emailing{" "}
          <a className="text-[#2e4dff] underline" href="mailto:subhan@deltalabs.tech">subhan@deltalabs.tech</a> with your reference number. Our website uses analytics to
          understand which campaigns bring applicants; those tools never receive your answers, CV or contact details.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={`flex gap-3 items-start rounded-[4px] border p-4 cursor-pointer ${consentError ? "border-[#d92d20] bg-[#fef3f2]" : "border-[#d5dae3] bg-white"}`}>
          <input
            id={fieldId("consent")}
            type="checkbox"
            checked={state.consent}
            onChange={(e) => onConsent(e.target.checked)}
            aria-invalid={consentError ? true : undefined}
            aria-describedby={consentError ? `${fieldId("consent")}-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#2e4dff]"
          />
          <span className="text-sm text-[#171a21]">
            I confirm the information is accurate, and I agree to Delta Labs processing my application as described in the privacy notice. <span className="text-[#2e4dff]" aria-hidden="true">*</span>
          </span>
        </label>
        {consentError && (
          <p id={`${fieldId("consent")}-error`} className="text-[13px] font-medium text-[#b42318]">
            {consentError}
          </p>
        )}
      </div>
    </div>
  );
}

function SuccessPanel({ reference, department, headingRef }: { reference: string; department: string; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-[4px] border border-[#b7e4c7] bg-white p-6 sm:p-10" role="status">
      <div className="w-12 h-12 rounded-full bg-[#e7f6ec] text-[#1f7a4d] flex items-center justify-center text-xl font-bold" aria-hidden="true">
        ✓
      </div>
      <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#171a21] focus:outline-none">
        Application submitted
      </h3>
      <p className="mt-3 text-[#636873] max-w-xl">
        {`Thank you for applying for the ${departmentById(department)?.name ?? ""} internship.`} Save your reference number — you&apos;ll need it if you contact us about your application.
      </p>
      <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-[4px] border border-[#cdd6ff] bg-[#f3f5ff] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2e4dff]">Application reference</p>
          <p className="font-mono text-xl sm:text-2xl font-semibold tracking-wider text-[#171a21]">{reference}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(reference).then(() => setCopied(true), () => undefined);
          }}
          className="h-10 px-3 rounded-[3px] border border-[#2e4dff] text-sm font-semibold text-[#2e4dff] hover:bg-[#2e4dff] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <h4 className="mt-8 text-sm font-semibold text-[#171a21]">What happens next</h4>
      <ol className="mt-3 space-y-2 text-sm text-[#4b5263] list-decimal pl-5">
        <li>Our team reviews every application.</li>
        <li>If your profile matches, we&apos;ll contact you on WhatsApp or email to schedule an interview.</li>
        <li>Shortlisted applicants complete a short practical assessment.</li>
      </ol>
      <p className="mt-6 text-[13px] text-[#636873]">If you gave us an email address, a confirmation may arrive shortly — check your spam folder too.</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
