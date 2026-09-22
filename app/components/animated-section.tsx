"use client";

import React from "react";
import { useInView } from "./use-in-view";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: React.ElementType;
}

const delayMap: Record<number, string> = {
  0: "",
  1: "anim-delay-1",
  2: "anim-delay-2",
  3: "anim-delay-3",
  4: "anim-delay-4",
};

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const [ref, isVisible] = useInView<HTMLElement>();
  const delayClass = delayMap[delay] ?? "";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`animate-on-scroll ${isVisible ? "is-visible" : ""} ${delayClass} ${className}`}
    >
      {children}
    </Tag>
  );
}
