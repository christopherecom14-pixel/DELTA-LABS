import type { Metadata } from "next";
import { AccordionItem } from "../components/accordion-item";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "Methodology & Philosophy | Delta Labs",
  description:
    "Learn about the Delta Labs methodology: human-centric architecture, deep scoping, conscious engineering, and the 4-stage build cycle.",
};

const FAQS = [
  {
    question: "How do you scope a project?",
    answer:
      "We begin with a deep dive discovery phase, engaging stakeholders to define the core operational problem rather than just listing arbitrary features. We map out user journeys, technical constraints, and business goals to create a robust, phased architecture plan.",
    defaultOpen: true,
  },
  {
    question: "What is your typical timeline?",
    answer:
      "Timelines vary based on complexity, but a typical engagement starts with a 2–3 week strategy and architecture blueprint, followed by 6–10 weeks of rapid, iterative development. We prioritize shipping a functional MVP early to gather real-world data and operational feedback.",
    defaultOpen: false,
  },
  {
    question: "How do you handle technical debt?",
    answer:
      "We believe in conscious engineering. While speed to market is critical, we establish a scalable foundation from day one. We allocate specific cycles during the build process to refactor, write modular tests, and optimize data models, ensuring long-term maintainability without vendor lock-in.",
    defaultOpen: false,
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes. Launch is just the beginning. We offer dedicated SLA agreements for ongoing maintenance, feature iteration, model fine-tuning, and performance monitoring. We act as long-term strategic partners, not temporary contractors.",
    defaultOpen: false,
  },
  {
    question: "How does the Delta (Δ) 4-Step Cycle work?",
    answer:
      "Δ means change. We follow a strict 4-step framework: 01 / Experiment (prototype low-risk solutions to validate signals) → 02 / Test (harden against real edge cases and live data) → 03 / Finalize (build enterprise-grade code, databases, and safeguards) → 04 / Ship (deploy into production with monitoring and training).",
    defaultOpen: false,
  },
  {
    question: "Can you integrate with our existing stack?",
    answer:
      "Always. We do not believe in tearing down systems that already work. We connect directly into your existing CRMs (HubSpot, Salesforce), databases (PostgreSQL, MySQL, D1), email tools, APIs, and custom legacy tools to unify your workflows.",
    defaultOpen: false,
  },
];

export default function MethodologyPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#fafbfc]">
      <section className="pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-20 md:pb-32 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-24 relative">
          {/* Left Sticky Column */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-36 flex flex-col gap-4 sm:gap-6 md:gap-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-[1px] w-8 sm:w-12 bg-[#171a21]" />
                <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#2e4dff] font-body">
                  Methodology & Philosophy
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold leading-tight sm:leading-[1.02] tracking-tight text-[#171a21] uppercase">
                Before we write a single line of code, we align on human impact.
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#636873] leading-relaxed font-body">
                Technology is a multiplier, but only if applied to the right bottleneck. We partner directly with founders and CTOs to ensure every dollar spent builds compounding operational leverage.
              </p>

              <div className="p-4 sm:p-6 bg-white border border-[#171a21]/15 rounded-[4px] mt-2 sm:mt-4 shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#2e4dff] block mb-1.5 sm:mb-2">
                  The Delta Framework
                </span>
                <div className="text-base sm:text-xl md:text-2xl font-display font-bold text-[#171a21]">
                  Δ Experiment → Test → Finalize → Ship
                </div>
              </div>
            </div>
          </div>

          {/* Right Scrollable Column (Accordion FAQ) */}
          <div className="lg:col-span-7 flex flex-col border-t border-[#171a21]">
            {FAQS.map((faq) => (
              <AccordionItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                defaultOpen={faq.defaultOpen}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
