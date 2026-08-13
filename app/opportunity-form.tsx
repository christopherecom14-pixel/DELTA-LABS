"use client";

import { FormEvent, useState } from "react";

export function OpportunityForm() {
  const [status, setStatus] = useState("");

  function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Delta Labs opportunity — ${form.get("company") || "New project"}`);
    const body = encodeURIComponent([
      `Name: ${form.get("name")}`,
      `Work email: ${form.get("email")}`,
      `Company: ${form.get("company")}`,
      `Company size: ${form.get("size")}`,
      `Opportunity: ${form.get("opportunity")}`,
      `Timeline: ${form.get("timeline")}`,
      "",
      "Current friction:",
      String(form.get("challenge") || ""),
    ].join("\n"));
    setStatus("Your email application is opening with the assessment details included.");
    window.location.href = `mailto:hello@deltalabs.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="assessment-form" onSubmit={submitAssessment}>
      <div className="form-heading"><span>PROJECT INTAKE / 01</span><strong>Initial assessment</strong></div>
      <div className="form-grid">
        <label><span>Your name</span><input name="name" autoComplete="name" placeholder="Full name" required /></label>
        <label><span>Work email</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" required /></label>
        <label><span>Company</span><input name="company" autoComplete="organization" placeholder="Company name" required /></label>
        <label><span>Company size</span><select name="size" defaultValue=""><option value="" disabled>Select size</option><option>1–10 people</option><option>11–50 people</option><option>51–200 people</option><option>201+ people</option></select></label>
      </div>
      <label><span>Where is the opportunity?</span><select name="opportunity" defaultValue="" required><option value="" disabled>Select one</option><option>AI agent</option><option>Workflow automation</option><option>Custom software or internal tool</option><option>Connect fragmented systems</option><option>Not sure yet</option></select></label>
      <label><span>What is slowing the business down?</span><textarea name="challenge" rows={4} placeholder="Describe the manual work, disconnected process or operational bottleneck..." required /></label>
      <label><span>Ideal timeline</span><select name="timeline" defaultValue=""><option value="" disabled>Select timeline</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Exploring for later</option></select></label>
      <button className="button button--blue form-submit" type="submit">Request initial assessment <span>↗</span></button>
      <p className="form-note">No generic proposal. We review the process first.</p>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
