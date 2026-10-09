import "server-only";
import { OPPORTUNITY, departmentName } from "@/lib/recruitment/config";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RECRUITMENT_FROM_EMAIL);
}

async function send(to: string, subject: string, html: string, text: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RECRUITMENT_FROM_EMAIL, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

/** Sends the applicant acknowledgement and (optionally) an internal alert. Never throws. */
export async function sendApplicationEmails(input: { name: string; email: string; reference: string; department: string }) {
  if (!isEmailConfigured()) return;
  const dept = departmentName(input.department);
  const firstName = input.name.split(/\s+/)[0];
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://deltalabs.tech";

  const text = [
    `Hi ${firstName},`,
    "",
    `Thank you for applying for the ${dept} internship at Delta Labs. We have received your application.`,
    "",
    `Your application reference: ${input.reference}`,
    "",
    "What happens next: our team screens every application. If your profile matches the role, we will contact you on WhatsApp or email to arrange an interview and a short practical assessment.",
    "",
    `Location: ${OPPORTUNITY.location} (on-site).`,
    "",
    "Please keep your reference number for any questions about your application.",
    "",
    "— Delta Labs",
    site,
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#171a21;line-height:1.6;max-width:560px">
<p>Hi ${escapeHtml(firstName)},</p>
<p>Thank you for applying for the <strong>${escapeHtml(dept)}</strong> internship at Delta Labs. We have received your application.</p>
<p style="background:#f0f3f8;border-left:3px solid #2e4dff;padding:12px 16px">Your application reference<br><strong style="font-size:18px;letter-spacing:1px">${escapeHtml(input.reference)}</strong></p>
<p><strong>What happens next:</strong> our team screens every application. If your profile matches the role, we will contact you on WhatsApp or email to arrange an interview and a short practical assessment.</p>
<p>Location: ${escapeHtml(OPPORTUNITY.location)} (on-site).</p>
<p>— Delta Labs<br><a href="${escapeHtml(site)}" style="color:#2e4dff">${escapeHtml(site.replace(/^https?:\/\//, ""))}</a></p>
</div>`;

  const jobs: Promise<unknown>[] = [send(input.email, `Application received — ${input.reference}`, html, text)];

  const notify = process.env.RECRUITMENT_NOTIFY_EMAIL;
  if (notify) {
    const adminUrl = `${site}/admin/recruitment?q=${encodeURIComponent(input.reference)}`;
    // Internal alert deliberately omits applicant details; recruiters open the dashboard.
    jobs.push(
      send(
        notify,
        `New internship application — ${dept} (${input.reference})`,
        `<p>A new ${escapeHtml(dept)} application was submitted: <strong>${escapeHtml(input.reference)}</strong>.</p><p><a href="${escapeHtml(adminUrl)}">Open in the recruitment dashboard</a></p>`,
        `A new ${dept} application was submitted: ${input.reference}.\n${adminUrl}`,
      ),
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.error("[recruitment] email failed:", r.reason);
}
