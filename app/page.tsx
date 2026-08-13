import Image from "next/image";
import deltaLogo from "../output/logo-concepts/06-interlocking-flows.png";
import { OpportunityForm } from "./opportunity-form";

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
    <>
      <header className="site-header">
        <div className="shell nav-shell">
          <a className="brand" href="#top" aria-label="Delta Labs home">
            <DeltaMark compact />
            <span className="wordmark">DELTA <span>LABS</span></span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#solutions">Solutions</a>
            <a href="#systems">Systems</a>
            <a href="#method">Method</a>
            <a href="#about">About</a>
          </nav>
          <a className="button button--dark nav-cta" href="#assessment">Start a project <span>↗</span></a>
        </div>
      </header>

      <main id="top">
        <section className="hero section-grid">
          <div className="shell hero-layout">
            <div className="hero-copy-block">
              <div className="status-pill"><span /> AI-powered business systems</div>
              <h1>Systems that make your business <em>move.</em></h1>
              <p className="hero-lede">We design and build AI agents, automation and software that eliminate manual work, connect fragmented operations and create infrastructure for scale.</p>
              <div className="hero-actions">
                <a className="button button--blue" href="#assessment">Start a project <span>↗</span></a>
                <a className="text-link" href="#systems">Explore our systems <span>↓</span></a>
              </div>
              <div className="hero-services" aria-label="Core services">
                <span>AI agents</span><i />
                <span>Automation</span><i />
                <span>Software</span><i />
                <span>Business systems</span>
              </div>
            </div>

            <div className="command-system" aria-label="Demonstration of an AI-powered operations command system">
              <div className="command-chrome">
                <div className="chrome-dots"><i /><i /><i /></div>
                <span>DELTA / OPERATIONS ENGINE</span>
                <span className="demo-state"><i /> DEMO ENVIRONMENT</span>
              </div>
              <div className="command-body">
                <aside className="command-sidebar">
                  <div className="sidebar-mark"><DeltaMark compact /></div>
                  <button className="side-item side-item--active" aria-label="Operations overview"><span>⌁</span><small>Overview</small></button>
                  <button className="side-item" aria-label="Work queue"><span>≡</span><small>Queue</small></button>
                  <button className="side-item" aria-label="AI agents"><span>AI</span><small>Agents</small></button>
                  <button className="side-item" aria-label="System integrations"><span>↔</span><small>Systems</small></button>
                  <button className="side-item side-item--bottom" aria-label="Settings"><span>⚙</span><small>Settings</small></button>
                </aside>
                <div className="command-main">
                  <div className="command-heading"><div><small>OPERATIONS / TODAY</small><strong>Work moving through the system</strong></div><button><span>+</span> New workflow</button></div>
                  <div className="command-layout">
                    <section className="workstream-panel">
                      <div className="panel-title"><span>Active workstream</span><small>LIVE</small></div>
                      <div className="workstream-focus"><span className="focus-icon">IN</span><div><small>INBOUND REQUEST</small><strong>New project inquiry</strong><p>Website · Company profile · Requirements</p></div><i>Received now</i></div>
                      <div className="event-line event-line--done"><span>01</span><div><strong>Context captured</strong><small>Company and request data normalized</small></div><i>DONE</i></div>
                      <div className="event-line event-line--active"><span>02</span><div><strong>AI agent reviewing fit</strong><small>Need · urgency · operational value</small></div><i>ACTIVE</i></div>
                      <div className="event-line"><span>03</span><div><strong>Route next action</strong><small>Owner, CRM stage and response path</small></div><i>QUEUED</i></div>
                    </section>
                    <aside className="intelligence-panel">
                      <div className="panel-title"><span>Agent analysis</span><small>EXPLAINABLE</small></div>
                      <div className="analysis-score"><div className="score-ring"><span>High</span><small>fit</small></div><div><small>RECOMMENDATION</small><strong>Schedule discovery</strong><p>Clear operational problem and meaningful integration scope.</p></div></div>
                      <div className="signal-list"><span><i /> Existing operation</span><span><i /> Manual process identified</span><span><i /> Decision owner present</span></div>
                      <div className="human-gate"><span>HUMAN REVIEW</span><strong>Approval required before outreach</strong><button>Review decision <i>↗</i></button></div>
                    </aside>
                  </div>
                  <div className="system-health"><div><span>CONNECTED SYSTEMS</span><strong>Form · CRM · Email · Calendar</strong></div><div><span>AUTOMATION MODE</span><strong>Human-controlled</strong></div><div><span>SYSTEM HEALTH</span><strong><i /> Operational</strong></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="signal-strip">
          <div className="shell signal-grid">
            <p>Built for companies with real operations—not experiments without ownership.</p>
            <div><strong>Business context</strong><span>before technology</span></div>
            <div><strong>Measured outcomes</strong><span>over feature volume</span></div>
            <div><strong>Systems thinking</strong><span>over isolated tools</span></div>
          </div>
        </section>

        <section className="section problem-section" id="problem">
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
        </section>

        <section className="section solutions-section" id="solutions">
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
        </section>

        <section className="section systems-section section-grid" id="systems">
          <div className="shell">
            <div className="split-heading split-heading--light">
              <div><span className="eyebrow">System demonstrations</span><h2>Show the work.<br />Not the buzzwords.</h2></div>
              <p>Representative systems built around the operational problems Delta Labs is designed to solve. Each engagement is scoped to the real process, stack and outcome.</p>
            </div>
            <div className="showcase-grid">
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
        </section>

        <section className="section method-section" id="method">
          <div className="shell method-layout">
            <div className="method-sticky"><span className="eyebrow">The Delta method</span><h2>From friction<br />to infrastructure.</h2><p>Experiment where uncertainty exists. Engineer where reliability matters. Deploy with ownership.</p><div className="delta-equation"><strong>Δ</strong><span>Current state → engineered change → new state</span></div></div>
            <div className="method-steps">
              <article><span>01 / MAP</span><h3>Find the leverage</h3><p>We study the workflow, people, tools and economics behind the problem. The output is a precise opportunity—not a generic AI recommendation.</p><small>Process map · Bottlenecks · Success measure</small></article>
              <article><span>02 / ARCHITECT</span><h3>Design the system</h3><p>We define responsibilities, data flow, integrations, safeguards and the human decisions that should remain in the loop.</p><small>System design · Scope · Delivery plan</small></article>
              <article><span>03 / BUILD</span><h3>Prove, then engineer</h3><p>We test the highest-risk assumptions early, then build the dependable software and automation around what works.</p><small>Prototype · Integrations · Production build</small></article>
              <article><span>04 / COMPOUND</span><h3>Operate and improve</h3><p>After launch, we monitor performance, fix friction and extend the system as the business and its data mature.</p><small>Optimization · Support · New capability</small></article>
            </div>
          </div>
        </section>

        <section className="section why-section" id="about">
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
        </section>

        <section className="section labs-section" id="labs">
          <div className="shell labs-layout">
            <div><span className="eyebrow">Inside the lab</span><h2>Building what businesses will operate on next.</h2><p>Delta Labs is a technology company in motion: client systems today, repeatable infrastructure and original products tomorrow.</p><a className="text-link" href="#assessment">Bring us a problem <span>↗</span></a></div>
            <div className="lab-board">
              <div className="lab-axis lab-axis--x" /><div className="lab-axis lab-axis--y" />
              <span className="lab-node lab-node--one">AGENTS</span><span className="lab-node lab-node--two">AUTOMATION</span><span className="lab-node lab-node--three">SOFTWARE</span><span className="lab-node lab-node--four">PRODUCTS</span>
              <div className="lab-core"><DeltaMark compact /><strong>DELTA</strong><small>EXPERIMENT → ENGINEER → DEPLOY</small></div>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="shell faq-layout"><div><span className="eyebrow">Common questions</span><h2>Before we build.</h2><p>Clear answers to the questions serious projects usually begin with.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div></div>
        </section>

        <section className="assessment-section section-grid" id="assessment">
          <div className="shell assessment-layout">
            <div className="assessment-copy"><span className="eyebrow">AI & automation opportunity assessment</span><h2>Bring us the process that should work better.</h2><p>Tell us where work slows down, repeats or gets lost. We&apos;ll review the opportunity and respond with the most sensible next step.</p><div className="assessment-points"><span><i>01</i> Initial opportunity review</span><span><i>02</i> Practical system direction</span><span><i>03</i> No generic AI sales pitch</span></div><a href="mailto:hello@deltalabs.com">hello@deltalabs.com ↗</a></div>
            <OpportunityForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-top"><div><a className="brand brand--footer" href="#top"><DeltaMark compact /><span className="wordmark">DELTA <span>LABS</span></span></a><p>AI-powered business systems.</p></div><div><span>Explore</span><a href="#solutions">Solutions</a><a href="#systems">Systems</a><a href="#method">Method</a><a href="#about">About</a></div><div><span>Start</span><a href="#assessment">Start a project</a><a href="mailto:hello@deltalabs.com">Email us</a></div></div>
        <div className="shell footer-bottom"><span>© 2026 Delta Labs. Engineering change.</span><span>Pakistan · Serving international markets</span></div>
      </footer>
    </>
  );
}
