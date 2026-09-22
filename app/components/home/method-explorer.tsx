"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { caption: "01 / MAP THE OPERATION", nodes: ["People", "Tools", "Handoffs"], text: "Understand where the work slows down." },
  { caption: "02 / PLAN THE SYSTEM", nodes: ["Rules", "Ownership", "Data flow"], text: "Define the connections and decisions the system needs." },
  { caption: "03 / BUILD & CONNECT", nodes: ["Prototype", "Integrate", "Review"], text: "Test assumptions and put the system into real work." },
  { caption: "04 / MEASURE THE CHANGE", nodes: ["Baseline", "Feedback", "Improve"], text: "Compare against the goal and decide what to improve." },
];

const STEPS = [
  { no: "01", title: "Find the real problem.", body: "We map the people, tools and steps behind the work. Where does time disappear? Where do errors happen? What needs to change?", output: "A clear problem & success measure" },
  { no: "02", title: "Design around the operation.", body: "We define how the system should work, what it needs to connect and where people stay in control.", output: "A practical scope & system plan" },
  { no: "03", title: "Build. Connect. Put it to work.", body: "We test the difficult assumptions, build the software and integrate it into the way your team works.", output: "A working system in your workflow" },
  { no: "04", title: "Measure the difference.", body: "We review the system against the agreed goal and use real feedback to guide improvements and ongoing support.", output: "Evidence of what changed & what's next" },
];

export function MethodExplorer() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const elements = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = elements.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stage = STAGES[active];

  return (
    <div className="method-grid">
      <div className="method-sticky">
        <span className="section-index">03 / THE DELTA METHOD</span>
        <h2>First understand.<br />Then engineer.</h2>
        <p>The right answer might be a focused tool, a complete ERP, an automation—or a combination. The problem determines the build.</p>
        <div className="method-map" aria-label="The four stages of the Delta method">
          <div className="method-map-top">
            <span>{stage.caption}</span>
            <span aria-hidden="true">Δ</span>
          </div>
          <div className="method-track">
            {["Map", "Plan", "Build", "Measure"].map((label, i) => (
              <span key={label} className={i === active ? "current" : ""}>{label}</span>
            ))}
          </div>
          <div className="method-diagram">
            {stage.nodes.map((node) => (
              <span key={node}>{node}</span>
            ))}
          </div>
          <p>{stage.text}</p>
        </div>
      </div>
      <div className="steps">
        {STEPS.map((step, i) => (
          <div
            key={step.no}
            ref={(el) => { stepRefs.current[i] = el; }}
            className={`step ${i === active ? "active" : ""}`}
          >
            <span className="step-no">{step.no}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="step-output">{step.output}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
