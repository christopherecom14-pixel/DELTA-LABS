import type { Metadata } from "next";
import { Footer } from "../../components/footer";
import { HomeHeader } from "../../components/home/home-header";
import { DEPARTMENTS, OPPORTUNITY, formatPkr } from "@/lib/recruitment/config";
import { ApplicationForm, StipendCard } from "./_components/application-form";
import { ApplyLink, InternshipPageView } from "./_components/tracking";

const title = "Internships in Multan — Marketing, Design, Sales & More";
const description =
  "Paid on-site internships at Delta Labs, BCG Chowk, Multan. Digital Marketing, Meta Ads, SEO, Graphic Design, E-commerce, Customer Support, Sales and Business Development. PKR 10,000 monthly stipend.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/careers/internships" },
  openGraph: {
    title: "Start Your Career at Delta Labs — Internships in Multan",
    description,
    url: "/careers/internships",
    type: "website",
  },
  twitter: { title: "Start Your Career at Delta Labs — Internships in Multan", description },
};

const DATE_POSTED = "2026-10-09";

const PROCESS = [
  { no: "01", title: "Application screening", body: "We read every application, including your screening answers, and contact shortlisted applicants on WhatsApp or email." },
  { no: "02", title: "Interview", body: "A conversation at our Multan office about your interests, your answers and how you approach work." },
  { no: "03", title: "Practical assessment", body: "A short, realistic task for your department so you can show how you think and work." },
];

const FAQ = [
  {
    q: "Who can apply?",
    a: "Current students, fresh graduates and people with some experience can all apply. We care more about how you think, learn and communicate than about your degree.",
  },
  {
    q: "Is the internship remote?",
    a: `No. All internships are on-site at our office at ${OPPORTUNITY.location}. Please only apply if you can attend in person.`,
  },
  {
    q: "How much is the stipend?",
    a: `The monthly stipend is ${formatPkr(OPPORTUNITY.stipendBase)}. Depending on your skills, role and evaluation, it may be up to ${formatPkr(OPPORTUNITY.stipendUpper)}.`,
  },
  {
    q: "Will the internship lead to a job?",
    a: "Completing the internship does not guarantee employment. When suitable full-time positions open, we may consider interns who performed well.",
  },
  {
    q: "Do I need previous experience or a CV?",
    a: "No. Experience helps but is not required. A CV is optional — practical projects, coursework and thoughtful screening answers carry real weight.",
  },
  {
    q: "Can I work part-time around my classes?",
    a: "Yes, tell us your availability and daily hours in the form. We'll discuss a schedule that works if you're selected.",
  },
  {
    q: "How long does the application take?",
    a: "About 10–15 minutes. Your progress is saved on your device, so you can return to it later.",
  },
  {
    q: "How will I hear back?",
    a: "Shortlisted applicants are contacted on WhatsApp or email. Keep your application reference number for any questions.",
  },
];

function jobPostingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Internship Programme — Marketing, Design, E-commerce, Support & Sales",
    description: `<p>Delta Labs offers on-site internships in Multan in ${DEPARTMENTS.map((d) => d.name).join(", ")}.</p><p>Monthly stipend of ${formatPkr(OPPORTUNITY.stipendBase)}, potentially up to ${formatPkr(OPPORTUNITY.stipendUpper)} depending on skills, role and evaluation. Students, fresh graduates and experienced applicants may apply. Selection: application screening, interview and practical assessment.</p>`,
    datePosted: DATE_POSTED,
    employmentType: "INTERN",
    hiringOrganization: { "@type": "Organization", "@id": "https://deltalabs.tech/#organization", name: "Delta Labs", sameAs: "https://deltalabs.tech", logo: "https://deltalabs.tech/delta-logo.png" },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", streetAddress: "BCG Chowk, Mumtazabad", addressLocality: "Multan", addressRegion: "Punjab", addressCountry: "PK" },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "PKR",
      value: { "@type": "QuantitativeValue", minValue: OPPORTUNITY.stipendBase, maxValue: OPPORTUNITY.stipendUpper, unitText: "MONTH" },
    },
    directApply: true,
  };
}

const wrap = "max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10";
const eyebrow = "flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#636873]";

export default function InternshipsPage() {
  return (
    <>
    {/* Same header as the home page. display:contents keeps the .home styles
        scoped to the header without boxing it, so it still sticks on scroll. */}
    <div className="home" style={{ display: "contents" }}>
      <HomeHeader />
    </div>
    <main id="main-content" className="w-full overflow-x-hidden bg-[#fafbfc] text-[#171a21]">
      <InternshipPageView />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd()).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className={`${wrap} pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16`}>
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-end">
          <div>
            <p className={eyebrow}>
              <span className="h-[2px] w-6 bg-[#2e4dff]" aria-hidden="true" /> Careers · Internship programme
            </p>
            <h1 className="mt-6 font-display text-[40px] leading-[1.08] sm:text-6xl lg:text-[68px] font-medium tracking-[-0.045em]">
              Start your career <br className="hidden sm:block" />
              at <span className="text-[#2e4dff]">Delta Labs.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#636873] max-w-[560px] leading-relaxed">
              Learn, build & grow with real-world experience — working on-site with our team in Multan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ApplyLink
                location="hero"
                className="inline-flex items-center justify-between gap-8 h-[54px] px-6 rounded-[3px] bg-[#2e4dff] text-white text-[15px] font-semibold hover:bg-[#1534dc] hover:-translate-y-0.5 transition-all"
              >
                Apply for internship <span aria-hidden="true" className="text-xl">↗</span>
              </ApplyLink>
              <a href="#departments" className="text-sm font-semibold py-3 hover:text-[#2e4dff] transition-colors">
                See open departments ↓
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 border-t border-l border-[#dfe2e9] bg-white rounded-[4px] overflow-hidden">
            {[
              ["Monthly stipend", formatPkr(OPPORTUNITY.stipendBase), `Up to ${formatPkr(OPPORTUNITY.stipendUpper)} based on evaluation`],
              ["Arrangement", "On-site", "Full-time or part-time"],
              ["Location", "Multan", "BCG Chowk, Mumtazabad"],
              ["Who can apply", "Open to all", "Students, graduates & experienced"],
            ].map(([k, v, sub]) => (
              <div key={k} className="p-4 sm:p-6 border-r border-b border-[#dfe2e9]">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#636873]">{k}</dt>
                <dd className="mt-2 font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em]">{v}</dd>
                <dd className="mt-1 text-[13px] text-[#636873] leading-snug">{sub}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="scroll-mt-[84px] border-t border-[#dfe2e9] bg-[#f0f2f6]">
        <div className={`${wrap} py-16 sm:py-20`}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className={eyebrow}>01 · Open departments</p>
              <h2 className="mt-5 font-display text-[32px] sm:text-5xl font-medium tracking-[-0.035em] leading-[1.15]">Eight ways to start.</h2>
            </div>
            <p className="text-[#636873] max-w-sm">Choose the department that fits your interests. You&apos;ll answer one practical question about it in the application.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#dfe2e9] border border-[#dfe2e9] rounded-[4px] overflow-hidden">
            {DEPARTMENTS.map((d, i) => (
              <li key={d.id} className="bg-white p-5 sm:p-6 flex flex-col">
                <span className="text-xs text-[#2e4dff] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em]">{d.name}</h3>
                <p className="mt-2 text-sm text-[#636873] leading-relaxed">{d.summary}</p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87909f]">You&apos;ll learn</p>
                <ul className="mt-2 space-y-1 text-sm text-[#171a21]">
                  {d.learn.map((l) => (
                    <li key={l} className="flex gap-2">
                      <span className="text-[#2e4dff]" aria-hidden="true">—</span>
                      {l}
                    </li>
                  ))}
                </ul>
                <ApplyLink location="department_card" department={d.id} className="mt-auto pt-5 text-sm font-semibold text-[#2e4dff] hover:underline underline-offset-4 inline-flex items-center gap-2 min-h-11">
                  Apply for {d.name} <span aria-hidden="true">→</span>
                </ApplyLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stipend & arrangement */}
      <section className={`${wrap} py-16 sm:py-20`}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <p className={eyebrow}>02 · Stipend & working arrangement</p>
            <h2 className="mt-5 font-display text-[32px] sm:text-5xl font-medium tracking-[-0.035em] leading-[1.15]">Clear terms, before you apply.</h2>
            <p className="mt-5 text-[#636873] max-w-md leading-relaxed">
              Everything about the stipend and arrangement is published here, so you can decide whether the internship fits you before you spend time on the form.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <StipendCard />
            <dl className="divide-y divide-[#dfe2e9] border-y border-[#dfe2e9] text-sm">
              {[
                ["Where", `${OPPORTUNITY.location} — on-site only`],
                ["Schedule", "Full-time or part-time around classes, agreed after selection"],
                ["Minimum commitment", "You choose from 1 to 6+ months in the application"],
                ["After the internship", "Completion does not guarantee employment. Strong interns may be considered when positions open."],
              ].map(([k, v]) => (
                <div key={k} className="grid sm:grid-cols-[180px_1fr] gap-1 py-3.5">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-[#636873]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Selection process */}
      <section className="bg-[#151c30] text-white">
        <div className={`${wrap} py-16 sm:py-20`}>
          <p className={`${eyebrow} !text-[#a3afca]`}>03 · Selection process</p>
          <h2 className="mt-5 font-display text-[32px] sm:text-5xl font-medium tracking-[-0.035em] leading-[1.15] max-w-2xl">Three steps. No surprises.</h2>
          <ol className="mt-10 grid md:grid-cols-3 gap-8 md:gap-6">
            {PROCESS.map((p) => (
              <li key={p.no} className="border-l-2 border-[#92a8ff] pl-5">
                <span className="text-[13px] text-[#b6c4f2] tabular-nums">{p.no}</span>
                <h3 className="mt-2 font-display text-2xl font-medium">{p.title}</h3>
                <p className="mt-3 text-[#c5cbd9] leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="scroll-mt-[84px] bg-[#e9eeff]/60 border-b border-[#dfe2e9]">
        <div className={`${wrap} py-16 sm:py-20`}>
          <div className="grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-10 lg:gap-14">
            <div className="lg:sticky lg:top-28 self-start">
              <p className={eyebrow}>04 · Apply</p>
              <h2 className="mt-5 font-display text-[32px] sm:text-5xl font-medium tracking-[-0.035em] leading-[1.15]">Apply for an internship.</h2>
              <p className="mt-5 text-[#4b5263] leading-relaxed max-w-md">
                Six short steps. Answer honestly and in your own words — we&apos;re looking for curiosity and clear thinking, not polished CVs.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#4b5263]">
                <li>✓ Progress saves on your device</li>
                <li>✓ CV optional (PDF, up to 4 MB)</li>
                <li>✓ You&apos;ll get an application reference number</li>
              </ul>
            </div>
            <div className="rounded-[6px] bg-white border border-[#dce2ef] p-5 sm:p-8 lg:p-10 shadow-[0_20px_45px_rgba(23,34,56,0.06)] min-w-0">
              <h2 className="sr-only">Application form</h2>
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${wrap} py-16 sm:py-20`}>
        <div className="grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-10 lg:gap-14">
          <div>
            <p className={eyebrow}>05 · Questions</p>
            <h2 className="mt-5 font-display text-[32px] sm:text-5xl font-medium tracking-[-0.035em] leading-[1.15]">Frequently asked.</h2>
            <p className="mt-5 text-[#636873]">
              Something else? Email{" "}
              <a href="mailto:subhan@deltalabs.tech" className="text-[#2e4dff] underline underline-offset-2">subhan@deltalabs.tech</a>.
            </p>
          </div>
          <div className="border-t border-[#dfe2e9]">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-[#dfe2e9]">
                <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-display text-lg sm:text-xl font-medium tracking-[-0.01em] hover:text-[#2e4dff] focus-visible:outline-2 focus-visible:outline-[#2e4dff]">
                  {f.q}
                  <span className="text-2xl font-light transition-transform group-open:rotate-45 group-open:text-[#2e4dff]" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-5 -mt-1 text-[#636873] leading-relaxed max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — keeps the primary action within reach on long mobile scrolls */}
      <section className="border-t border-[#dfe2e9]">
        <div className={`${wrap} py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6`}>
          <p className="font-display text-2xl sm:text-3xl font-medium tracking-[-0.025em]">Ready to start? Applications take about 10 minutes.</p>
          <ApplyLink location="footer_cta" className="inline-flex items-center justify-between gap-8 h-[54px] px-6 rounded-[3px] bg-[#2e4dff] text-white text-[15px] font-semibold hover:bg-[#1534dc] transition-colors shrink-0">
            Apply for internship <span aria-hidden="true" className="text-xl">↗</span>
          </ApplyLink>
        </div>
      </section>

      <Footer hideTeaser />
    </main>
    </>
  );
}
