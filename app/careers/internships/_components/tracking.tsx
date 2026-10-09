"use client";

import { useEffect, type ReactNode } from "react";
import { analytics } from "@/lib/analytics";
import { SELECT_DEPARTMENT_EVENT } from "./application-form";

export function InternshipPageView() {
  useEffect(() => {
    analytics.internshipPageView();
  }, []);
  return null;
}

/** Anchor to the form that also records the click and (optionally) preselects a department. */
export function ApplyLink({
  location,
  department,
  className,
  children,
}: {
  location: string;
  department?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#apply"
      className={className}
      onClick={() => {
        analytics.applyClick(location, department);
        if (department) window.dispatchEvent(new CustomEvent(SELECT_DEPARTMENT_EVENT, { detail: department }));
      }}
    >
      {children}
    </a>
  );
}
