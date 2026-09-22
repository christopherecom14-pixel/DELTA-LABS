"use client";

import { useState } from "react";

type WorkflowState = "before" | "after";

const WORKFLOWS: Record<
  WorkflowState,
  { nodes: [string, string, string][]; label: string; outcome: string }
> = {
  before: {
    nodes: [
      ["01 / RECEIVE", "Message arrives", "A new enquiry lands in an inbox."],
      ["02 / COPY", "Update a spreadsheet", "Someone re-enters the details."],
      ["03 / CHASE", "Ask who owns it", "Context moves between people."],
      ["04 / REMEMBER", "Follow up manually", "The next step depends on memory."],
    ],
    label: "THE FRICTION",
    outcome: "Information moves. Ownership gets lost.",
  },
  after: {
    nodes: [
      ["01 / CAPTURE", "Record it once", "Capture the enquiry in one shared record."],
      ["02 / ASSIGN", "Give it an owner", "Route it using agreed business rules."],
      ["03 / CONNECT", "Keep the context", "Give the responsible person the information they need."],
      ["04 / FOLLOW THROUGH", "Make the next step clear", "Use reminders and human review to keep work moving."],
    ],
    label: "THE INTENDED CHANGE",
    outcome: "One record. Clear ownership. A visible next step.",
  },
};

export function WorkflowLab() {
  const [state, setState] = useState<WorkflowState>("before");
  const flow = WORKFLOWS[state];

  return (
    <div className={`workflow-lab ${state === "after" ? "is-after" : ""}`}>
      <div className="workflow-heading">
        <div>
          <span className="section-index">AN EXAMPLE / CLIENT ENQUIRY</span>
          <h3>Same enquiry. A different way of working.</h3>
        </div>
        <div className="workflow-controls" role="group" aria-label="Compare enquiry workflows">
          <button type="button" aria-pressed={state === "before"} onClick={() => setState("before")}>
            Before
          </button>
          <button type="button" aria-pressed={state === "after"} onClick={() => setState("after")}>
            With a system
          </button>
        </div>
      </div>
      <div aria-live="polite">
        <ol className="flow-nodes">
          {flow.nodes.map(([step, title, description]) => (
            <li key={step}>
              <span>{step}</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <div className="workflow-outcome">
          <span>{flow.label}</span>
          <p>{flow.outcome}</p>
        </div>
      </div>
      <p className="workflow-caption">Illustrative workflow, not a client result. Automation rules and human review depend on the business.</p>
    </div>
  );
}
