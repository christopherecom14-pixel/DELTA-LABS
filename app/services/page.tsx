import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "../components/animated-section";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Systems & Capabilities",
  description:
    "See how Delta Labs combines operational discovery, custom business software, workflow automation, AI, integrations, and continued improvement.",
  alternates: { canonical: "/services" },
};

const CONDITIONS = [
  "Manual work repeats across people and teams",
  "Critical information is split across tools",
  "Calculations or reporting depend on fragile spreadsheets",
  "Approvals and exceptions wait without clear ownership",
  "Generic software does not fit the real operation",
  "Growth is adding coordination faster than capacity",
];

const LAYERS = [
  {
    number: "01",
    title: "Operational discovery",
    when: "Before a system is prescribed",
    meaning:
      "We map the outcome, people, steps, tools, decisions, exceptions, and cost of friction in the current operation.",
    output: "Current-state map · Problem boundary · Baseline",
  },
  {
    number: "02",
    title: "Business systems architecture",
    when: "When the required state is clear",
    meaning:
      "We decide what to retain, integrate, automate, or build, then define responsibilities, data flows, safeguards, and phased scope.",
    output: "System blueprint · Delivery plan · Risk assumptions",
  },
  {
    number: "03",
    title: "Focused software and ERPs",
    when: "When generic software cannot represent the work",
    meaning:
      "We engineer internal platforms, portals, calculation engines, and ERP modules around the operation's actual rules and roles.",
    output: "Internal tools · Portals · ERP modules · Calculators",
  },
  {
    number: "04",
    title: "Workflow and decision automation",
    when: "When stable rules and handoffs consume attention",
    meaning:
      "We connect information, actions, routing, approvals, reporting, and exception handling without removing necessary human judgment.",
    output: "Workflows · Approvals · Routing · Reporting",
  },
  {
    number: "05",
    title: "AI-assisted responsibilities",
    when: "When information-heavy work benefits from context",
    meaning:
      "We give AI a bounded role with controlled data access, a defined escalation path, and a person accountable for the result.",
    output: "Retrieval · Classification · Drafting · Decision support",
  },
  {
    number: "06",
    title: "System integration",
    when: "When useful tools should work as one",
    meaning:
      "We connect existing and new systems through reliable data flows so the solution does not become another isolated application.",
    output: "APIs · Data sync · Shared records · Event flows",
  },
  {
    number: "07",
    title: "Rollout and improvement",
    when: "When the system meets the real operation",
    meaning:
      "We test edge cases, introduce the system to users, observe adoption and performance, and improve it against the agreed change.",
    output: "Testing · Documentation · Monitoring · Iteration",
  },
];

export default function ServicesPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#0A0B0D]">
      <section className="pt-28 sm:pt-36 md:pt-44 pb-16 sm:pb-24 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl">
          <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#3B8BFF] block mb-5">
            Systems & capabilities
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F0F2F5] leading-[0.95]">
            The problem determines the system. The system determines the technology.
          </h1>
          <p className="mt-6 sm:mt-8 max-w-3xl text-sm sm:text-lg md:text-xl text-[#9CA3AF] leading-relaxed">
            Delta Labs does not begin with a service menu. We begin with the operation, define the change it needs, and combine only the capabilities required to create that change.
          </p>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#111318]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-14 sm:py-20">
          <AnimatedSection className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-10">
            <div className="lg:col-span-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3B8BFF]">A good fit when</span>
              <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold text-[#F0F2F5] tracking-tight">The operation has become the constraint.</h2>
            </div>
            <p className="lg:col-span-5 lg:col-start-8 lg:pt-8 text-sm sm:text-lg text-[#9CA3AF] leading-relaxed">
              The first signal is rarely “we need an app.” It is a recurring business condition that current tools and coordination no longer handle well.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.07] border border-white/[0.07]">
            {CONDITIONS.map((condition, index) => (
              <div key={condition} className="bg-[#111318] p-5 sm:p-7 flex gap-4">
                <span className="font-mono text-[10px] text-[#3B8BFF]">0{index + 1}</span>
                <p className="text-sm text-[#F0F2F5] leading-relaxed">{condition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 md:py-32 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <AnimatedSection className="max-w-4xl mb-10 sm:mb-16">
          <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#3B8BFF] block mb-4">Solution layers</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#F0F2F5] leading-[1.02]">
            Capabilities combined around one operational outcome.
          </h2>
        </AnimatedSection>

        <div className="border-t border-white/[0.08]">
          {LAYERS.map((layer, index) => (
            <AnimatedSection key={layer.number} delay={((index % 4) + 1) as 1 | 2 | 3 | 4}>
              <article className="grid grid-cols-[44px_1fr] lg:grid-cols-[70px_1.1fr_1.5fr_1fr] gap-4 lg:gap-8 py-7 sm:py-10 border-b border-white/[0.08] items-start">
                <span className="font-mono text-xs text-[#3B8BFF]">{layer.number}</span>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F0F2F5]">{layer.title}</h3>
                  <span className="block mt-2 font-mono text-[9px] uppercase tracking-wider text-[#636B78]">{layer.when}</span>
                </div>
                <p className="col-start-2 lg:col-start-auto text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">{layer.meaning}</p>
                <p className="col-start-2 lg:col-start-auto font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-[#636B78]">{layer.output}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-20 border-t border-white/[0.06]">
        <AnimatedSection className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#3B8BFF]">The first engagement</span>
            <h2 className="mt-4 font-display text-3xl sm:text-5xl font-extrabold text-[#F0F2F5] tracking-tight">Start by mapping the operational gap.</h2</tool>
            <p className="mt-5 max-w-2xl text-sm sm:text-lg text-[#9CA3AF] leading-relaxed">
              Bring the process that repeats, slows down, or loses information. We will review the context and determine whether a focused assessment is the sensible next step.
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <Link href="/contact" className="w-full inline-flex items-center justify-center h-13 sm:h-14 px-6 bg-[#3B8BFF] text-white text-xs font-bold uppercase tracking-[0.15em] rounded-[4px] hover:bg-[#5BA3FF] transition-colors">
              Map the Operational Gap ↗
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </main>
  );
}
