"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";
import deltaLogo from "../output/logo-concepts/06-interlocking-flows.png";
import { OpportunityForm } from "./opportunity-form";

const easeOut = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 42 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: easeOut } },
};

const heroCopyVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.1 } },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
};

const workflowVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.72, staggerChildren: 0.13 } },
};

const workflowItemVariants: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.48, ease: easeOut } },
};

function RevealSection({ children, className, id }: { children: ReactNode; className: string; id?: string }) {
  return (
    <motion.section
      className={className}
      id={id}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.section>
  );
}

function DeltaMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`delta-mark${compact ? " delta-mark--compact" : ""}`} aria-hidden="true">
      <Image src={deltaLogo} alt="" sizes={compact ? "38px" : "72px"} />
    </span>
  );
}

const solutions = [
  {
    number: "01",
    name: "AI agents",
    copy: "Purpose-built agents that qualify leads, coordinate work, retrieve knowledge and support decisions inside real operations.",
    tags: ["Lead handling", "Knowledge", "Decision support"],
  },
  {
    number: "02",
    name: "Workflow automation",
    copy: "Connected workflows that move information, trigger actions and remove repetitive handoffs between people and tools.",
    tags: ["Operations", "Follow-up", "Data flow"],
  },
  {
    number: "03",
    name: "Custom software",
    copy: "Internal tools and business applications designed around how your company actually works—not a generic template.",
    tags: ["Internal tools", "Portals", "Platforms"],
  },
  {
    number: "04",
    name: "Integrated systems",
    copy: "A reliable operating layer connecting your CRM, communication, data, marketing and delivery stack.",
    tags: ["Integrations", "Infrastructure", "Scale"],
  },
];

const faqs = [
  ["What exactly can Delta Labs automate?", "We focus on repetitive, rules-driven or information-heavy work across lead handling, reporting, customer operations, internal coordination, marketing and service delivery. The first step is mapping where time, information or revenue currently gets lost."],
  ["Can you work with our existing software?", "Yes. We design around your current stack wherever it makes sense, connecting APIs, databases, CRMs, communication tools and internal systems instead of forcing a complete replacement."],
  ["Do you build custom AI agents?", "Yes. We build agents around defined business responsibilities, controlled data access and clear escalation paths. The goal is dependable work inside a system—not an impressive demo with no operational role."],
  ["How long does a project take?", "A focused automation or prototype can show value in weeks. Larger software and integrated systems move through defined architecture, build and rollout phases. After discovery, we provide a realistic scope and delivery path."],
  ["What happens after launch?", "We can continue with monitoring, optimization, maintenance and new development. Intelligent systems improve when the underlying process, data and feedback loops are actively managed."],
  ["Can you work alongside our team?", "Yes. We can operate as the specialist build partner alongside your leadership, operations, marketing or internal technology team, with clear ownership and documentation."],
];

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.header className="site-header" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: easeOut }}>
        <div className="shell nav-shell">
          <a className="brand" href="#top" aria-label="Delta Labs home">
            <DeltaMark compact />
            <span className="wordmark">DELTA <span>LABS</span></span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#solutions">Solutions</a>
            <a href="#systems">Portfolio</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
          </nav>
          <a className="button button--dark nav-cta" href="#assessment">Start a project <span>↗</span></a>
        </div>
      </motion.header>

      <main id="top">
        <section className="hero section-grid">
          <div className="shell hero-layout">
            <motion.div className="hero-copy-block" variants={heroCopyVariants} initial="hidden" animate="visible">
              <motion.div className="status-pill" variants={heroItemVariants}><span /> Smarter systems for growing businesses</motion.div>
              <motion.h1 variants={heroItemVariants}>AI automation and software that make your business <em>move.</em></motion.h1>
              <motion.p className="hero-lede" variants={heroItemVariants}>Delta Labs builds AI agents, workflow automation and custom software that save your team time, connect your tools and keep work moving without constant manual follow-up.</motion.p>
              <motion.div className="hero-actions" variants={heroItemVariants}>
                <motion.a className="button button--blue" href="#assessment" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>Start a project <span>↗</span></motion.a>
                <a className="text-link" href="#systems">Explore our portfolio <span>↓</span></a>
              </motion.div>
              <motion.div className="hero-services" aria-label="Core services" variants={heroItemVariants}>
                <span>Faster follow-up</span><i />
                <span>Less admin</span><i />
                <span>Connected tools</span><i />
                <span>Room to grow</span>
              </motion.div>
            </motion.div>

            <motion.div className="command-system" aria-label="Example of an automated lead follow-up workflow" initial={{ opacity: 0, x: 36, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.82, delay: 0.24, ease: easeOut }}>
              <div className="command-chrome">
                <div className="chrome-dots"><i /><i /><i /></div>
                <span>LEAD FOLLOW-UP AUTOMATION</span>
                <span className="demo-state"><i /> EXAMPLE WORKFLOW</span>
              </div>
              <div className="command-body">
                <aside className="command-sidebar">
                  <div className="sidebar-mark"><DeltaMark compact /></div>
                  <button className="side-item side-item--active" aria-label="New leads"><span>⌁</span><small>Leads</small></button>
                  <button className="side-item" aria-label="Replies"><span>↗</span><small>Replies</small></button>
                  <button className="side-item" aria-label="Booked calls"><span>✓</span><small>Booked</small></button>
                  <button className="side-item" aria-label="Results"><span>↗</span><small>Results</small></button>
                  <button className="side-item side-item--bottom" aria-label="Settings"><span>⚙</span><small>Settings</small></button>
                </aside>
                <div className="command-main">
                  <div className="command-heading"><div><small>NEW LEAD / JUST NOW</small><strong>From new enquiry to booked call</strong></div><button>View result <span>↗</span></button></div>
                  <div className="command-layout">
                    <motion.section className="workstream-panel" variants={workflowVariants} initial="hidden" animate="visible">
                      <motion.div className="panel-title" variants={workflowItemVariants}><span>What happens automatically</span><small>LIVE</small></motion.div>
                      <motion.div className="workstream-focus" variants={workflowItemVariants}><span className="focus-icon">IN</span><div><small>NEW ENQUIRY</small><strong>A new lead fills your form</strong><p>Name · need · contact details</p></div><i>Just now</i></motion.div>
                      <motion.div className="event-line event-line--done" variants={workflowItemVariants}><span>01</span><div><strong>Details saved</strong><small>No copying or manual data entry</small></div><i>DONE</i></motion.div>
                      <motion.div className="event-line event-line--active" variants={workflowItemVariants}><span>02</span><div><strong>Personal reply sent</strong><small>The lead gets a quick, helpful response</small></div><i>SENT</i></motion.div>
                      <motion.div className="event-line" variants={workflowItemVariants}><span>03</span><div><strong>Call booking offered</strong><small>Your calendar link is sent automatically</small></div><i>NEXT</i></motion.div>
                    </motion.section>
                    <motion.aside className="intelligence-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.58, delay: 1.2, ease: easeOut }}>
                      <div className="panel-title"><span>Business outcome</span><small>RESULT</small></div>
                      <div className="analysis-score"><div className="score-ring"><span>Fast</span><small>reply</small></div><div><small>THE RESULT</small><strong>Respond while interest is high</strong><p>Your team follows up in minutes, even when everyone is busy.</p></div></div>
                      <div className="signal-list"><span><i /> Every lead gets a reply</span><span><i /> Your team saves admin time</span><span><i /> More calls get booked</span></div>
                      <div className="human-gate"><span>YOU STAY IN CONTROL</span><strong>Your team can review or take over at any time.</strong><button>See the lead <i>↗</i></button></div>
                    </motion.aside>
                  </div>
                  <motion.div className="system-health" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.42, ease: easeOut }}><div><span>WORKS WITH</span><strong>Form · Email · CRM · Calendar</strong></div><div><span>TIME SAVED</span><strong>Hours every week</strong></div><div><span>STATUS</span><strong><i /> Running</strong></div></motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <RevealSection className="signal-strip">
          <div className="shell signal-grid">
            <p>Built for companies with real operations—not experiments without ownership.</p>
            <div><strong>Business context</strong><span>before technology</span></div>
            <div><strong>Measured outcomes</strong><span>over feature volume</span></div>
            <div><strong>Systems thinking</strong><span>over isolated tools</span></div>
          </div>
        </RevealSection>

        <RevealSection className="section problem-section" id="problem">
          <div className="shell">
            <div className="split-heading">
              <div><span className="eyebrow">The operating gap</span><h2>Your business grew.<br />Its systems didn&apos;t.</h2></div>
              <div className="heading-copy"><p>Manual work, disconnected tools and slow information flow quietly become infrastructure debt. More people get added, but the underlying operation stays difficult to scale.</p><a className="text-link" href="#assessment">Map the opportunity <span>↗</span></a></div>
            </div>
            <div className="friction-grid">
              <article><span>01</span><div className="friction-icon">↻</div><h3>Work repeats</h3><p>Your team spends hours moving data, updating records and following up manually.</p></article>
              <article><span>02</span><div className="friction-icon">⌁</div><h3>Tools disconnect</h3><p>Important context sits across inboxes, spreadsheets, platforms and individual memory.</p></article>
              <article><span>03</span><div className="friction-icon">…</div><h3>Decisions wait</h3><p>Leads, approvals and operational issues slow down because the next action is unclear.</p></article>
              <article><span>04</span><div className="friction-icon">+</div><h3>Headcount absorbs it</h3><p>Growth requires more coordination instead of better leverage from the system underneath.</p></article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section solutions-section" id="solutions">
          <div className="shell">
            <div className="section-intro"><span className="eyebrow">What we engineer</span><h2>One operating problem.<br />The right system around it.</h2><p>We combine AI, automation and software according to the job—not according to the trend.</p></div>
            <div className="solution-list">
              {solutions.map((solution) => (
                <article className="solution-row" key={solution.number}>
                  <span className="solution-number">{solution.number}</span>
                  <h3>{solution.name}</h3>
                  <p>{solution.copy}</p>
                  <div className="tag-list">{solution.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <span className="row-arrow">↗</span>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section systems-section section-grid" id="systems">
          <div className="shell">
            <div className="split-heading split-heading--light">
              <div><span className="eyebrow">Products &amp; system demonstrations</span><h2>Show the work.<br />Not the buzzwords.</h2></div>
              <p>Original Delta Labs products alongside representative systems built around real operational problems.</p>
            </div>
            <div className="showcase-grid">
              <article className="showcase product-showcase">
                <div className="showcase-label"><span>PRODUCT / LIVE</span><span>PROJECT MANAGEMENT</span></div>
                <div className="housesbase-product" aria-label="HousesBase project management portal preview">
                  <div className="housesbase-chrome">
                    <div><i /><i /><i /></div>
                    <span>housesbase.com</span>
                    <small>LIVE</small>
                  </div>
                  <div className="housesbase-app">
                    <aside>
                      <strong>HB</strong>
                      <span className="is-active">Overview</span>
                      <span>Projects</span>
                      <span>Teams</span>
                      <span>Reports</span>
                    </aside>
                    <div className="housesbase-main">
                      <div className="housesbase-heading"><div><small>WORKSPACE</small><strong>Project overview</strong></div><button>+ New project</button></div>
                      <div className="housesbase-stats"><span><small>ACTIVE PROJECTS</small><strong>12</strong></span><span><small>TEAM MEMBERS</small><strong>38</strong></span><span><small>ON TRACK</small><strong>92%</strong></span></div>
                      <div className="housesbase-work"><div><small>RECENT PROJECTS</small><span><i className="hb-dot hb-dot--amber" /><b>Lakeview Residence</b><em>In progress</em></span><span><i className="hb-dot hb-dot--blue" /><b>Urban Heights</b><em>Planning</em></span><span><i className="hb-dot hb-dot--green" /><b>Park Avenue</b><em>On track</em></span></div><aside><small>THIS WEEK</small><strong>18</strong><p>tasks completed</p><i /></aside></div>
                    </div>
                  </div>
                </div>
                <div className="showcase-copy product-showcase-copy"><div><span className="eyebrow">HousesBase</span><h3>Project operations, brought into one clear workspace.</h3></div><div><p>A live Delta Labs product that gives teams a focused portal for managing projects, people and day-to-day progress.</p><a className="product-link" href="https://housesbase.com" target="_blank" rel="noreferrer">Visit housesbase.com <span>↗</span></a></div></div>
              </article>
              <article className="showcase showcase--large">
                <div className="showcase-label"><span>DEMO / 01</span><span>GROWTH OPERATIONS</span></div>
                <div className="lead-engine">
                  <div><small>01 · Capture</small><strong>Inquiry received</strong><span>Form · Ads · Email · Chat</span></div>
                  <i>→</i><div><small>02 · Understand</small><strong>AI qualification</strong><span>Fit · Need · Urgency</span></div>
                  <i>→</i><div><small>03 · Act</small><strong>Route + follow up</strong><span>CRM · Owner · Sequence</span></div>
                </div>
                <div className="showcase-copy"><div><span className="eyebrow">Lead response engine</span><h3>Every inquiry understood, routed and followed up.</h3></div><p>Replaces slow manual triage with a connected response system that keeps context and ownership intact.</p></div>
              </article>
              <article className="showcase">
                <div className="showcase-label"><span>DEMO / 02</span><span>OPERATIONS</span></div>
                <div className="ops-dashboard"><div className="ops-bars"><i /><i /><i /><i /><i /></div><div className="ops-list"><span><i /> Process healthy</span><span><i /> Exception assigned</span><span><i /> Report prepared</span></div></div>
                <div className="showcase-copy showcase-copy--stack"><div><span className="eyebrow">Operations control center</span><h3>One view of work, exceptions and decisions.</h3></div><p>Connects fragmented operational data into a clear system for action.</p></div>
              </article>
              <article className="showcase showcase--blue">
                <div className="showcase-label"><span>DEMO / 03</span><span>KNOWLEDGE</span></div>
                <div className="knowledge-flow"><span>POLICY</span><span>PROJECTS</span><span>CLIENTS</span><strong>AI</strong><span>ANSWER</span></div>
                <div className="showcase-copy showcase-copy--stack"><div><span className="eyebrow">Knowledge agent</span><h3>Answers grounded in the information your team trusts.</h3></div><p>Turns scattered internal knowledge into faster, more consistent support and decisions.</p></div>
              </article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section method-section" id="method">
          <div className="shell method-layout">
            <div className="method-sticky"><span className="eyebrow">The Delta method</span><h2>From friction<br />to infrastructure.</h2><p>Experiment where uncertainty exists. Engineer where reliability matters. Deploy with ownership.</p><div className="delta-equation"><strong>Δ</strong><span>Current state → engineered change → new state</span></div></div>
            <div className="method-steps">
              <article><span>01 / MAP</span><h3>Find the leverage</h3><p>We study the workflow, people, tools and economics behind the problem. The output is a precise opportunity—not a generic AI recommendation.</p><small>Process map · Bottlenecks · Success measure</small></article>
              <article><span>02 / ARCHITECT</span><h3>Design the system</h3><p>We define responsibilities, data flow, integrations, safeguards and the human decisions that should remain in the loop.</p><small>System design · Scope · Delivery plan</small></article>
              <article><span>03 / BUILD</span><h3>Prove, then engineer</h3><p>We test the highest-risk assumptions early, then build the dependable software and automation around what works.</p><small>Prototype · Integrations · Production build</small></article>
              <article><span>04 / COMPOUND</span><h3>Operate and improve</h3><p>After launch, we monitor performance, fix friction and extend the system as the business and its data mature.</p><small>Optimization · Support · New capability</small></article>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section why-section" id="about">
          <div className="shell">
            <div className="section-intro"><span className="eyebrow">Why Delta Labs</span><h2>Business understanding<br />meets technical execution.</h2><p>We operate across growth, operations, software and AI—so the system is designed around the business outcome, not just the build ticket.</p></div>
            <div className="why-grid">
              <article><strong>01</strong><h3>Operators, not spectators</h3><p>Our perspective comes from practical work across marketing, lead generation, business development, software and automation.</p></article>
              <article><strong>02</strong><h3>Integration-first thinking</h3><p>We look at the whole flow of work and data before recommending another disconnected tool.</p></article>
              <article><strong>03</strong><h3>Built around the result</h3><p>Every system starts with a measurable operational target: less manual work, faster response, clearer decisions or better scale.</p></article>
              <article><strong>04</strong><h3>Ownership after launch</h3><p>Documentation, support and ongoing improvement are part of creating infrastructure your company can rely on.</p></article>
            </div>
            <div className="fit-panel"><div><span className="eyebrow">Built for</span><h3>Companies with customers, operations and a real cost of inefficiency.</h3></div><div className="fit-tags"><span>Service businesses</span><span>Agencies</span><span>Technology companies</span><span>E-commerce</span><span>Growth-stage SMEs</span><span>Operational teams</span></div></div>
          </div>
        </RevealSection>

        <RevealSection className="section labs-section" id="labs">
          <div className="shell labs-layout">
            <div><span className="eyebrow">Inside the lab</span><h2>Building what businesses will operate on next.</h2><p>Delta Labs is a technology company in motion: client systems today, repeatable infrastructure and original products tomorrow.</p><a className="text-link" href="#assessment">Bring us a problem <span>↗</span></a></div>
            <div className="lab-board">
              <div className="lab-axis lab-axis--x" /><div className="lab-axis lab-axis--y" />
              <span className="lab-node lab-node--one">AGENTS</span><span className="lab-node lab-node--two">AUTOMATION</span><span className="lab-node lab-node--three">SOFTWARE</span><span className="lab-node lab-node--four">PRODUCTS</span>
              <div className="lab-core"><DeltaMark compact /><strong>DELTA</strong><small>EXPERIMENT → ENGINEER → DEPLOY</small></div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="section faq-section" id="faq">
          <div className="shell faq-layout"><div><span className="eyebrow">Common questions</span><h2>Before we build.</h2><p>Clear answers to the questions serious projects usually begin with.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></div>
        </RevealSection>

        <RevealSection className="assessment-section section-grid" id="assessment">
          <div className="shell assessment-layout">
            <div className="assessment-copy"><span className="eyebrow">AI & automation opportunity assessment</span><h2>Bring us the process that should work better.</h2><p>Tell us where work slows down, repeats or gets lost. We&apos;ll review the opportunity and respond with the most sensible next step.</p><div className="assessment-points"><span><i>01</i> Initial opportunity review</span><span><i>02</i> Practical system direction</span><span><i>03</i> No generic AI sales pitch</span></div><a href="mailto:hello@deltalabs.com">hello@deltalabs.com ↗</a></div>
            <OpportunityForm />
          </div>
        </RevealSection>
      </main>

      <footer className="site-footer">
        <div className="shell footer-top"><div><a className="brand brand--footer" href="#top"><DeltaMark compact /><span className="wordmark">DELTA <span>LABS</span></span></a><p>AI-powered business systems.</p></div><div><span>Explore</span><a href="#solutions">Solutions</a><a href="#systems">Portfolio</a><a href="#method">Method</a><a href="#about">About</a></div><div><span>Start</span><a href="#assessment">Start a project</a><a href="mailto:hello@deltalabs.com">Email us</a></div></div>
        <div className="shell footer-bottom"><span>© 2026 Delta Labs. Engineering change.</span><span>Pakistan · Serving international markets</span></div>
      </footer>
    </MotionConfig>
  );
}
