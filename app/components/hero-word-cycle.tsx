"use client";

import { useEffect, useState } from "react";

const CYCLE_WORDS = ["Validate.", "Build.", "Ship.", "Scale."];

export function HeroWordCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLE_WORDS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      key={index}
      className="text-[#3B8BFF] inline-block"
      style={{
        animation: "word-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) 1 forwards",
      }}
    >
      {CYCLE_WORDS[index]}
    </span>
  );
}
