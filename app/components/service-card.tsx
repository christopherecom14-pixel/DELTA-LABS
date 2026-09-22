"use client";

import Link from "next/link";

interface ServiceCardProps {
  number: string;
  category: string;
  title: string;
  description?: string;
  tags?: string[];
  staggerClass?: string;
  href?: string;
}

export function ServiceCard({
  number,
  category,
  title,
  description,
  tags,
  staggerClass = "stagger-1",
  href = "/contact",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={`group block relative w-full min-h-[260px] sm:min-h-[300px] md:h-[380px] lg:h-[400px] overflow-hidden rounded-[6px] ${staggerClass} service-card focus:outline-none focus:ring-2 focus:ring-[#3B8BFF]/50 p-5 sm:p-6 md:p-8 flex flex-col justify-between`}
    >
      {/* Background fill on hover */}
      <div className="absolute inset-0 card-bg z-0" />

      {/* Top Section */}
      <div className="relative z-10 flex items-start justify-between">
        <span className="block font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] card-num font-semibold transition-colors">
          {number} / {category}
        </span>
        <div className="hover-arrow">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-auto pt-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-[0.98] tracking-tight card-text transition-colors max-w-full break-words">
          {title}
        </h2>
        {description && (
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#636B78] group-hover:text-[#9CA3AF] transition-colors line-clamp-3 font-body">
            {description}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 sm:py-1 bg-white/5 text-[#9CA3AF] group-hover:bg-[#3B8BFF]/10 group-hover:text-[#3B8BFF] rounded-[2px] transition-colors font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
