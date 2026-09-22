"use client";

import Link from "next/link";

interface CaseStudyCardProps {
  category: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  linkHref?: string;
  badge?: string;
}

export function CaseStudyCard({
  category,
  title,
  imageSrc,
  imageAlt,
  linkHref = "/contact",
  badge,
}: CaseStudyCardProps) {
  return (
    <Link
      href={linkHref}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] overflow-hidden group kinetic-hover cursor-pointer rounded-[6px] block border border-white/[0.08] bg-[#111318]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0A0B0D]/55 transition-opacity duration-500 group-hover:bg-[#0A0B0D]/70" />

      {/* Top Badge */}
      {badge && (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
          <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#111318]/90 border border-[#3B8BFF]/30 text-[#3B8BFF] text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-[0.15em] rounded-[3px] backdrop-blur-md">
            {badge}
          </span>
        </div>
      )}

      {/* Hover Reveal Arrow */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10 opacity-75 sm:opacity-0 transform translate-x-0 sm:-translate-x-3 sm:translate-y-3 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:group-hover:translate-y-0 text-[#3B8BFF]">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end overflow-hidden z-10">
        <div className="reveal-text">
          <span className="text-[#9CA3AF] text-[10px] sm:text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.18em] mb-2 sm:mb-3 block">
            {category}
          </span>
          <h3 className="text-[#F0F2F5] group-hover:text-[#3B8BFF] transition-colors duration-300 font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight break-words">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
