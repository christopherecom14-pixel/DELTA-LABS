"use client";

import { useState } from "react";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#111318]">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-button w-full flex items-center justify-between py-6 sm:py-8 md:py-10 text-left focus:outline-none group cursor-pointer"
      >
        <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-display font-bold leading-snug sm:leading-tight pr-4 sm:pr-6 text-[#111318] group-hover:text-[#1665ff] transition-colors">
          {question}
        </span>
        <span
          className={`accordion-icon font-display font-light text-2xl sm:text-3xl md:text-4xl text-[#111318] transition-transform duration-300 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-45 text-[#1665ff]" : ""
          }`}
        >
          +
        </span>
      </button>
      <div className={`accordion-content ${isOpen ? "is-open" : ""}`}>
        <div className="accordion-inner">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#68717e] leading-relaxed pb-6 sm:pb-8 md:pb-10 max-w-3xl font-body">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
