"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#approach", label: "Our approach", sectionId: "approach" },
  { href: "#work", label: "Selected work", sectionId: "work" },
  { href: "#about", label: "The lab", sectionId: "about" },
];

const CAREERS_HREF = "/careers/internships";

/**
 * Site header used on the home page and the careers page. On other pages the
 * home section links point back to "/#section".
 */
export function HomeHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onCareers = pathname.startsWith("/careers");
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(isHome ? "approach" : "");

  useEffect(() => {
    if (!isHome) return;
    const sectionIds = ["approach", "method", "work", "about", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setActiveId(id === "method" ? "approach" : id);
        });
      },
      { rootMargin: "-38% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sectionHref = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <a className="skip" href="#main-content">Skip to content</a>
      <div className="reading-progress" aria-hidden="true" />
      <header className="header">
        <Link className="brand" href={isHome ? "#" : "/"} aria-label="Delta Labs home" onClick={() => setOpen(false)}>
          <svg className="brand-lockup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 108" width="205" height="60" aria-hidden="true">
            <path d="M49 8 13 73h24L62 28Z" fill="currentColor" />
            <path d="m65 35-12 22 10 17H43L31 94h66Z" fill="currentColor" />
            <text x="126" y="61" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="31" letterSpacing="1.1" fill="currentColor">DELTA LABS</text>
          </svg>
        </Link>
        <nav aria-label="Main navigation" id="navigation" className={open ? "open" : ""}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={sectionHref(link.href)}
              aria-current={isHome && activeId === link.sectionId ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link href={CAREERS_HREF} aria-current={onCareers ? "page" : undefined} onClick={() => setOpen(false)}>
            Careers
          </Link>
          <a className="nav-cta" href={sectionHref("#contact")} onClick={() => setOpen(false)}>
            Bring us a problem <span>↗</span>
          </a>
        </nav>
        <button
          type="button"
          className="menu"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen((v) => !v)}
        >
          Menu <span>{open ? "×" : "＋"}</span>
        </button>
      </header>
    </>
  );
}
