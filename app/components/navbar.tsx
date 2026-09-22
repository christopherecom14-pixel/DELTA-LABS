"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Systems" },
  { href: "/methodology", label: "Method" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  if (pathname === "/") {
    // The home page ships its own light-themed header (see HomeHeader).
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0B0D]/90 backdrop-blur-md border-b border-white/[0.06] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 text-[#F0F2F5] group z-50">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-[#111318] border border-white/10 rounded-[4px] sm:rounded-[6px] p-0.5 sm:p-1 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:border-[#3B8BFF]/40 group-hover:shadow-[0_0_12px_rgba(59,139,255,0.2)]">
              <img
                src="/delta-logo.png"
                alt="Delta Labs Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg md:text-xl font-extrabold tracking-tight uppercase text-[#F0F2F5] leading-none">
                Delta <span className="text-[#3B8BFF]">Labs</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-semibold tracking-[0.18em] text-[#636B78] uppercase mt-0.5">
                Engineering Change
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <nav className="flex items-center gap-6 lg:gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-[0.15em] font-semibold transition-colors duration-200 relative py-1 ${
                      isActive
                        ? "text-[#3B8BFF] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#3B8BFF] after:rounded-full"
                        : "text-[#9CA3AF] hover:text-[#F0F2F5]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 lg:h-11 px-5 lg:px-6 bg-[#3B8BFF] text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:bg-[#5BA3FF] hover:scale-[1.02] shadow-[0_0_20px_rgba(59,139,255,0.3)] rounded-[4px]"
            >
              Map the Gap ↗
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:text-[#F0F2F5] focus:outline-none z-50 rounded-sm hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#0A0B0D] z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto border-t border-white/[0.06] animate-in fade-in duration-200">
          <nav className="flex flex-col gap-6 pt-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl sm:text-2xl font-display uppercase tracking-widest font-extrabold pb-3 border-b border-white/[0.06] flex items-center justify-between transition-colors ${
                    isActive ? "text-[#3B8BFF]" : "text-[#9CA3AF] hover:text-[#F0F2F5]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-sm font-body text-[#3B8BFF]">●</span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 pb-12 flex flex-col gap-4">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-[#3B8BFF] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-[4px] shadow-[0_0_24px_rgba(59,139,255,0.3)] hover:bg-[#5BA3FF] transition-colors"
            >
              Map the Operational Gap ↗
            </Link>
            <div className="text-center text-[10px] uppercase tracking-widest text-[#636B78] font-mono font-semibold pt-2">
              Delta Labs · Engineering Change
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
