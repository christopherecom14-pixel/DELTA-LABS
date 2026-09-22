"use client";

import { FormEvent, type MouseEvent as ReactMouseEvent, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const stepLabels = ["About you", "The gap", "Timeline"];
const TOTAL_STEPS = stepLabels.length;

function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  return {
    style: { x: springX, y: springY },
    onMouseMove: (event: ReactMouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * strength);
      y.set((event.clientY - rect.top - rect.height / 2) * strength);
    },
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
  };
}

export function OpportunityForm() {
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nextMagnetic = useMagnetic();
  const submitMagnetic = useMagnetic();

  function goNext() {
    const stepEl = stepRefs.current[step];
    if (stepEl) {
      const fields = stepEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
      for (const field of fields) {
        if (!field.reportValidity()) return;
      }
    }
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

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
      <div className="form-heading">
        <span>PROJECT INTAKE / {String(step + 1).padStart(2, "0")}</span>
        <strong>{stepLabels[step]}</strong>
      </div>
      <div className="form-progress" aria-hidden="true">
        {stepLabels.map((label, index) => (
          <span key={label} className={index <= step ? "is-done" : undefined} />
        ))}
      </div>

      <div className={`form-step${step === 0 ? " is-active" : ""}`} ref={(el) => { stepRefs.current[0] = el; }}>
        <div className="form-grid">
          <label><span>Your name</span><input name="name" autoComplete="name" placeholder="Full name" required /></label>
          <label><span>Work email</span><input type="email" name="email" autoComplete="email" placeholder="you@company.com" required /></label>
          <label><span>Company</span><input name="company" autoComplete="organization" placeholder="Company name" required /></label>
          <label><span>Company size</span><select name="size" defaultValue=""><option value="" disabled>Select size</option><option>1–10 people</option><option>11–50 people</option><option>51–200 people</option><option>201+ people</option></select></label>
        </div>
      </div>

      <div className={`form-step${step === 1 ? " is-active" : ""}`} ref={(el) => { stepRefs.current[1] = el; }}>
        <label><span>Where is the opportunity?</span><select name="opportunity" defaultValue="" required><option value="" disabled>Select one</option><option>AI agent</option><option>Workflow automation</option><option>Custom software or internal tool</option><option>Connect fragmented systems</option><option>Not sure yet</option></select></label>
        <label><span>What is slowing the business down?</span><textarea name="challenge" rows={4} placeholder="Describe the manual work, disconnected process or operational bottleneck..." required /></label>
      </div>

      <div className={`form-step${step === 2 ? " is-active" : ""}`} ref={(el) => { stepRefs.current[2] = el; }}>
        <label><span>Ideal timeline</span><select name="timeline" defaultValue=""><option value="" disabled>Select timeline</option><option>As soon as possible</option><option>Within 1–3 months</option><option>Within 3–6 months</option><option>Exploring for later</option></select></label>
      </div>

      <div className="form-nav">
        {step > 0 && <button type="button" className="form-back" onClick={goBack}>← Back</button>}
        {step < TOTAL_STEPS - 1 ? (
          <motion.button key="continue" type="button" className="button button--accent form-submit" whileTap={{ scale: 0.96 }} {...nextMagnetic} onClick={goNext}>
            Continue <span>↗</span>
          </motion.button>
        ) : (
          <motion.button key="submit" type="submit" className="button button--accent form-submit" whileTap={{ scale: 0.96 }} {...submitMagnetic}>
            Request initial assessment <span>↗</span>
          </motion.button>
        )}
      </div>
      <p className="form-note">No generic proposal. We review the process first.</p>
      <p className="form-status" aria-live="polite">{status}</p>
    </form>
  );
}
