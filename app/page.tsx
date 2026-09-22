import { AnimatedSection } from "./components/animated-section";
import { ContactForm } from "./components/contact-form";
import { HomeHeader } from "./components/home/home-header";
import { HomeFooter } from "./components/home/home-footer";
import { WorkflowLab } from "./components/home/workflow-lab";
import { MethodExplorer } from "./components/home/method-explorer";

const PROBLEMS = [
  { no: "01", title: "Work repeats.", body: "The same information gets entered, checked and shared again." },
  { no: "02", title: "Tools disconnect.", body: "The full picture lives across conversations, files and people." },
  { no: "03", title: "Growth gets harder.", body: "More business means more coordination, instead of more capacity." },
];

const CAPABILITIES = [
  {
    no: "01",
    title: "Custom business software",
    body: "ERPs, internal platforms, portals and focused tools built around your business rules, teams and day-to-day work.",
    open: true,
  },
  {
    no: "02",
    title: "Workflow automation",
    body: "Remove repetitive data entry, follow-ups and handoffs by connecting the steps that should happen together.",
  },
  {
    no: "03",
    title: "AI-assisted systems",
    body: "Use AI where it serves a defined purpose: retrieving information, supporting decisions or handling information-heavy work—with appropriate human review.",
  },
  {
    no: "04",
    title: "Connected tools & data",
    body: "Connect existing applications and information sources so your team can work with consistent context across the operation.",
  },
];

export default function Home() {
  return (
    <div className="home">
      <HomeHeader />
      <main id="main-content">
        <section className="hero wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="small-line" /> BUSINESS SYSTEMS ENGINEERING</div>
              <h1>
                Custom systems.<br />
                For the way<br />
                <span>your business works.</span>
              </h1>
              <p>Delta Labs builds custom software, ERPs and automation around your operation—so your team can spend less time working around the system.</p>
              <div className="hero-actions">
                <a className="button" href="#contact">Bring us a problem <span>↗</span></a>
                <a className="secondary-link" href="#work">Explore our work ↓</a>
              </div>
              <div className="hero-scope">
                <span>Custom software</span>
                <span>Business ERPs</span>
                <span>Automation & AI</span>
              </div>
            </div>
            <div className="hero-art">
              <img src="/hero/shift-art.webp" alt="The two-piece Shift Delta symbol rendered as a precision metal sculpture" width={1024} height={1024} fetchPriority="high" />
              <div className="art-caption">
                <span>THE DELTA IS THE DIFFERENCE.</span>
                <span>Engineering change.</span>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>Pakistan based. Built for businesses everywhere.</span>
            <span>Understand the operation. Engineer the change.</span>
          </div>
        </section>

        <section id="approach" className="intro wrap section">
          <div className="section-index">01 / THE STARTING POINT</div>
          <AnimatedSection className="intro-grid">
            <h2>When the workaround<br /><span>becomes the work.</span></h2>
            <div className="intro-copy">
              <p className="large">The spreadsheet that became a system. The follow-up that depends on one person. The calculation that takes half the day.</p>
              <p>These are the places we start. Delta Labs studies how your business runs, finds what gets in the way, and builds a system around what needs to work better.</p>
              <a className="text-link" href="#method">See how we work <span>↗</span></a>
            </div>
          </AnimatedSection>
          <div className="problem-row">
            {PROBLEMS.map((item) => (
              <AnimatedSection key={item.no} as="div">
                <span>{item.no}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </AnimatedSection>
            ))}
          </div>
          <WorkflowLab />
        </section>

        <section id="work" className="work section">
          <div className="wrap">
            <div className="section-index">02 / SYSTEMS TAKING SHAPE</div>
            <AnimatedSection className="section-heading">
              <h2>Different businesses.<br /><span>The same curiosity.</span></h2>
              <p>A school. A software house. A hotel.<br />We build around the operation,<br />not a predetermined product.</p>
            </AnimatedSection>

            <AnimatedSection as="article" className="project project-school">
              <div className="project-visual school-visual">
                <div className="concept-label">CONCEPT INTERFACE · IN DEVELOPMENT</div>
                <div className="screen">
                  <div className="screen-top">
                    <span className="screen-brand">E / SCHOOL WORKSPACE</span>
                    <span>Academic overview</span>
                  </div>
                  <div className="school-grid">
                    <div className="school-side">
                      <strong>Workspace</strong>
                      <span className="chosen">Overview</span>
                      <span>Students</span>
                      <span>Attendance</span>
                      <span>Learning</span>
                    </div>
                    <div className="school-main">
                      <div className="mini-label">ONE CONNECTED SCHOOL DAY</div>
                      <h4>Less administration.<br />More room to learn.</h4>
                      <div className="school-cards">
                        <div><span>Student records</span><b>One place</b></div>
                        <div><span>Class resources</span><b>Within reach</b></div>
                      </div>
                      <div className="list-line"><i /> Attendance & academic information<span>↗</span></div>
                      <div className="list-line"><i /> Learning materials & practice<span>↗</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-info">
                <div>
                  <span className="tag">EDUCATION</span>
                  <h3>A more connected school.</h3>
                  <dl className="project-brief">
                    <div><dt>The problem</dt><dd>Student information and learning resources need a shared home.</dd></div>
                    <div><dt>The system</dt><dd>A school ERP connecting records, attendance and academic resources.</dd></div>
                  </dl>
                </div>
                <div className="project-meta">
                  <span className="status">In development</span>
                  <span>Custom ERP · Web & Android</span>
                </div>
                <details className="project-detail">
                  <summary>Explore the system <b aria-hidden="true">＋</b></summary>
                  <div className="detail-body">
                    <h4>School system direction</h4>
                    <p className="case-flow">Student information → attendance & academic records → learning resources</p>
                    <p>The aim is a shared workspace for students and academic staff. Records and resources stay connected to the school day.</p>
                    <p><strong>Current scope:</strong> A connected school ERP and learning platform. Development is ongoing; no measured results are claimed.</p>
                    <a className="text-link" href="#contact">Discuss a similar problem ↗</a>
                  </div>
                </details>
              </div>
            </AnimatedSection>

            <div className="project-pair">
              <AnimatedSection as="article" className="project">
                <div className="project-visual agency-visual">
                  <div className="concept-label">ILLUSTRATIVE INTERFACE</div>
                  <div className="compact-screen">
                    <div className="screen-top">
                      <span className="screen-brand">WORK / OPERATIONS</span>
                      <span>↗</span>
                    </div>
                    <h4>From handoff<br />to clear ownership.</h4>
                    <div className="kanban">
                      <div><span>Planned</span><b>Project scope</b><b>Client brief</b></div>
                      <div><span>In progress</span><b>System build</b><b>Team review</b></div>
                      <div><span>Review</span><b>Delivery check</b></div>
                    </div>
                  </div>
                </div>
                <div className="project-info">
                  <div>
                    <span className="tag">SOFTWARE BUSINESSES</span>
                    <h3>An operating system for delivery.</h3>
                    <dl className="project-brief">
                      <div><dt>The problem</dt><dd>Projects, people and client delivery need coordinated ownership.</dd></div>
                      <div><dt>The system</dt><dd>A software-house ERP built around the delivery workflow.</dd></div>
                    </dl>
                  </div>
                  <div className="project-meta">
                    <span className="status">In development</span>
                    <span>Business ERP</span>
                  </div>
                  <details className="project-detail">
                    <summary>Explore the system <b aria-hidden="true">＋</b></summary>
                    <div className="detail-body">
                      <h4>Software-house system direction</h4>
                      <p className="case-flow">Project scope → assigned ownership → delivery progress → review</p>
                      <p>The aim is to make responsibilities and project context easier to follow across client work.</p>
                      <p><strong>Current scope:</strong> A business ERP around projects, people and delivery coordination. Development is ongoing.</p>
                      <a className="text-link" href="#contact">Discuss a similar problem ↗</a>
                    </div>
                  </details>
                </div>
              </AnimatedSection>

              <AnimatedSection as="article" className="project" delay={1}>
                <div className="project-visual hotel-visual">
                  <div className="concept-label">ILLUSTRATIVE WORKFLOW</div>
                  <div className="calculation">
                    <span className="mini-label">HOSPITALITY / QUETTA</span>
                    <h4>Complex calculations.<br />A clearer process.</h4>
                    <div className="calc-step"><span>01</span>Business inputs <b>＋</b></div>
                    <div className="calc-step"><span>02</span>Defined calculation rules <b>×</b></div>
                    <div className="calc-step result"><span>03</span>Consistent outputs <b>＝</b></div>
                  </div>
                </div>
                <div className="project-info">
                  <div>
                    <span className="tag">HOSPITALITY</span>
                    <h3>Built around the numbers.</h3>
                    <dl className="project-brief">
                      <div><dt>The problem</dt><dd>Hotel calculations require business-specific rules and inputs.</dd></div>
                      <div><dt>The system</dt><dd>Focused calculation software for hotels in Quetta.</dd></div>
                    </dl>
                  </div>
                  <div className="project-meta">
                    <span className="status">In development</span>
                    <span>Custom calculation software</span>
                  </div>
                  <details className="project-detail">
                    <summary>Explore the system <b aria-hidden="true">＋</b></summary>
                    <div className="detail-body">
                      <h4>Hotel calculation system direction</h4>
                      <p className="case-flow">Business inputs → defined rules → calculated output → review</p>
                      <p>The aim is to give hotel-specific calculations a consistent, repeatable process.</p>
                      <p><strong>Current scope:</strong> A focused system for hotels in Quetta. Requirements and calculation rules determine the final implementation.</p>
                      <a className="text-link" href="#contact">Discuss a similar problem ↗</a>
                    </div>
                  </details>
                </div>
              </AnimatedSection>
            </div>
            <p className="work-note">These are projects in development. The visuals explain each system&apos;s direction; they are not live product screenshots or evidence of completed results.</p>
          </div>
        </section>

        <section id="method" className="method section">
          <div className="wrap">
            <MethodExplorer />
          </div>
        </section>

        <section className="capabilities wrap section">
          <div className="section-index">04 / WHAT THE WORK CAN REQUIRE</div>
          <AnimatedSection className="section-heading">
            <h2>The problem leads.<br /><span>The technology follows.</span></h2>
            <p>One engineering partner.<br />The right combination of capabilities.</p>
          </AnimatedSection>
          <div className="capability-list">
            {CAPABILITIES.map((item) => (
              <details key={item.no} open={item.open}>
                <summary><span>{item.no}</span>{item.title}<b aria-hidden="true">＋</b></summary>
                <p>{item.body}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="about" className="about section">
          <div className="wrap about-grid">
            <div>
              <div className="section-index">05 / INSIDE DELTA LABS</div>
              <h2>Change is<br />the product.</h2>
            </div>
            <div>
              <p className="large">We are a Pakistan-based business systems engineering company, bringing business understanding and technical execution to the same table.</p>
              <p>Our work spans software, automation and AI. Our starting point stays the same: understand the business, identify what needs to change, and engineer the system that gets it there.</p>
              <p>The delta is the difference between how work happens today and how it could happen tomorrow.</p>
              <span className="about-sign">DELTA LABS / ENGINEERING CHANGE.</span>
            </div>
          </div>
        </section>

        <section id="contact" className="contact wrap section">
          <div className="section-index">06 / START WITH THE PROBLEM</div>
          <div className="contact-grid">
            <div>
              <h2>What should<br />work <span>better?</span></h2>
              <p>Tell us about the process that slows your business down. You don&apos;t need a technical brief to start a useful conversation.</p>
              <a className="text-link" href="mailto:hello@deltalabs.tech">hello@deltalabs.tech <span>↗</span></a>
            </div>
            <ContactForm hideHeading />
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
