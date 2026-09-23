import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "../components/contact-form";

export const metadata: Metadata = {
  title: "Contact & Project Intake | Delta Labs",
  description:
    "Start a conversation with Delta Labs. Share your project, workflow bottleneck, or custom software requirements directly with our engineering team.",
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen pt-16 sm:pt-20 flex flex-col lg:flex-row bg-[#fafbfc] overflow-x-hidden">
      {/* Left Panel: Dark Informational Monolith */}
      <div className="w-full lg:w-1/2 min-h-[380px] sm:min-h-[440px] lg:min-h-[calc(100vh-80px)] bg-[#171a21] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 xl:p-20 relative overflow-hidden">
        {/* Abstract Background Gradient matching Logo colors */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(46, 77, 255, 0.45) 0%, transparent 60%), radial-gradient(circle at 85% 85%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Top Return Link with Delta Logo */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#ffffff]/80 hover:text-[#ffffff] transition-colors text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] group"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1 text-[#5c78ff]">←</span>
            <span>Return to Home</span>
          </Link>
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white border border-white/20 rounded-[4px] p-0.5 shadow-sm flex-shrink-0">
            <img src="/delta-logo.png" alt="Delta Labs Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Center Oversized Email & Tagline */}
        <div className="relative z-10 my-auto py-8 sm:py-12">
          <span className="text-[10px] sm:text-xs md:text-sm text-[#5c78ff] uppercase tracking-[0.22em] mb-3 sm:mb-6 block font-body font-bold">
            Let&apos;s Build Something
          </span>
          <a
            href="mailto:subhan@deltalabs.tech"
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white border-b-2 border-white hover:text-[#5c78ff] hover:border-[#5c78ff] transition-colors duration-300 break-all block py-2"
          >
            subhan@deltalabs.tech
          </a>
          <p className="mt-4 sm:mt-8 text-xs sm:text-sm md:text-base text-[#9aa0ab] max-w-md leading-relaxed font-body">
            Direct access to our senior engineering leads. No account executives, no sales fluff.
          </p>
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-xs uppercase tracking-widest text-[#9aa0ab] pt-6 sm:pt-8 border-t border-[#ffffff]/10">
          <span className="text-white font-bold">Δ Delta Labs Global</span>
          <span>Fast Turnaround</span>
        </div>
      </div>

      {/* Right Panel: Light Inquiry Form */}
      <div className="w-full lg:w-1/2 min-h-[480px] lg:min-h-[calc(100vh-80px)] bg-white flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-14">
        <ContactForm />
      </div>
    </main>
  );
}
