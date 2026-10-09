// Browser-side analytics helpers for GA4 and Meta Pixel.
//
// Privacy rule: only non-identifying context (department id, step number, CTA
// location, UTM attribution) is ever sent. Never pass names, emails, phone
// numbers, CVs, screening answers or salary expectations to these functions.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void; // loaded by app/components/meta-pixel-snippet.ts
    dataLayer?: unknown[];
  }
}

type Params = Record<string, string | number | undefined>;

const clean = (params: Params) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));

function gaEvent(name: string, params: Params = {}) {
  window.gtag?.("event", name, clean(params));
}

function pixel(kind: "track" | "trackCustom", name: string, params: Params = {}, eventId?: string) {
  if (!window.fbq) return;
  if (eventId) window.fbq(kind, name, clean(params), { eventID: eventId });
  else window.fbq(kind, name, clean(params));
}

const once = (key: string) => {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage unavailable: still allow the event once per page load.
  }
  return true;
};

export const analytics = {
  internshipPageView() {
    gaEvent("internship_page_view", { page_type: "careers_internships" });
    pixel("track", "ViewContent", { content_name: "Internship programme", content_category: "careers" });
  },

  applyClick(location: string, department?: string) {
    gaEvent("internship_apply_click", { cta_location: location, department });
    pixel("trackCustom", "InternshipApplyClick", { cta_location: location, department });
  },

  /** Fires once per browser session, on the first interaction with the form. */
  formStart() {
    if (!once("dl_form_start")) return;
    gaEvent("internship_form_start", { form_name: "internship_application" });
    pixel("trackCustom", "InternshipFormStart");
  },

  departmentSelected(department: string) {
    gaEvent("internship_department_selected", { department });
    pixel("trackCustom", "InternshipDepartmentSelected", { department });
  },

  stepComplete(step: number, stepName: string) {
    gaEvent("internship_form_step", { step_number: step, step_name: stepName });
  },

  /**
   * Call only after the server confirmed the application was saved. The event
   * id lets Meta de-duplicate it (e.g. against a future Conversions API feed),
   * and the session guard stops refreshes or retries from counting twice.
   */
  lead(eventId: string, department: string) {
    if (!once(`dl_lead_${eventId}`)) return;
    gaEvent("generate_lead", { form_name: "internship_application", department, currency: "PKR", value: 0 });
    pixel("track", "Lead", { content_name: "Internship application", content_category: department }, eventId);
  },
};

// ---------------------------------------------------------------------------
// Campaign attribution (stored on the device, sent only with the application)
// ---------------------------------------------------------------------------

const ATTRIBUTION_KEY = "dl_attribution";
const ATTRIBUTION_TTL_MS = 30 * 24 * 3600 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "referrer" | "landingPage" | "firstSeenAt", string>>;

/** Records campaign parameters from the current URL (latest campaign touch wins). */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const found: Attribution = {};
    for (const key of PARAMS) {
      const value = url.searchParams.get(key);
      if (value) found[key] = value.slice(0, 200);
    }
    if (!Object.keys(found).length) return;
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;
    found.referrer = referrer?.slice(0, 300);
    found.landingPage = url.pathname.slice(0, 200);
    found.firstSeenAt = new Date().toISOString();
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
  } catch {
    // Attribution is best-effort.
  }
}

export function readAttribution(): Attribution {
  try {
    const stored = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "null") as Attribution | null;
    if (stored?.firstSeenAt && Date.now() - Date.parse(stored.firstSeenAt) < ATTRIBUTION_TTL_MS) {
      return Object.fromEntries(Object.entries(stored).filter(([, v]) => typeof v === "string" && v)) as Attribution;
    }
  } catch {
    // ignore
  }
  // No stored campaign: fall back to an external referrer, if any.
  const ref = typeof document !== "undefined" && document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
  return ref ? { referrer: ref.slice(0, 300) } : {};
}
