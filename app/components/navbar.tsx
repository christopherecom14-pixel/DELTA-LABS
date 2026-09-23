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

function BrandLockup() {
  return (
    <svg className="w-[150px] sm:w-[170px] h-auto text-[#171a21]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 108" aria-hidden="true">
      <path d="M49 8 13 73h24L62 28Z" fill="currentColor" />
      <path d="m65 35-12 22 10 17H43L31 94h66Z" fill="currentColor" />
      <text x="126" y="61" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="31" letterSpacing="1.1" fill="currentColor">DELTA LABS</text>
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

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
    // The home page ships its own header (see HomeHeader).
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fafbfc]/90 backdrop-blur-md border-b border-[#171a21]/[0.08] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 text-[#171a21] group z-50">
            <BrandLockup />
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
                        ? "text-[#2e4dff] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2e4dff] after:rounded-full"
                        : "text-[#636873] hover:text-[#171a21]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 lg:h-11 px-5 lg:px-6 bg-[#2e4dff] text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:bg-[#1534dc] hover:scale-[1.02] shadow-[0_0_20px_rgba(46,77,255,0.25)] rounded-[4px]"
            >
              Map the Gap ↗
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#636873] hover:text-[#171a21] focus:outline-none z-50 rounded-sm hover:bg-[#171a21]/5 transition-colors"
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
        <div className="md:hidden fixed inset-0 top-16 bg-[#fafbfc] z-40 px-6 py-8 flex flex-col justify-between overflow-y-auto border-t border-[#171a21]/[0.08] animate-in fade-in duration-200">
          <nav className="flex flex-col gap-6 pt-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl sm:text-2xl font-display uppercase tracking-widest font-extrabold pb-3 border-b border-[#171a21]/[0.08] flex items-center justify-between transition-colors ${
                    isActive ? "text-[#2e4dff]" : "text-[#636873] hover:text-[#171a21]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-sm font-body text-[#2e4dff]">●</span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 pb-12 flex flex-col gap-4">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-[#2e4dff] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-[4px] shadow-[0_0_24px_rgba(46,77,255,0.25)] hover:bg-[#1534dc] transition-colors"
            >
              Map the Operational Gap ↗
            </Link>
            <div className="text-center text-[10px] uppercase tracking-widest text-[#87909f] font-mono font-semibold pt-2">
              Delta Labs · Engineering Change
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
