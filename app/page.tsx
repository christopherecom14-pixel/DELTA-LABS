export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <nav className="navbar">
      
            <a className="brand" href="#">
              <span className="brand-mark" aria-label="Delta Labs logo">
                <svg viewBox="0 0 100 100" role="img">
                  
                  <path className="logo-delta" d="M50 13 L76 76 L24 76 Z"/>
                  <path className="logo-delta" d="M50 31 L63 63 L37 63 Z"/>
      
                  
                  <path className="logo-trace" d="M25 43 H13 L8 38 H3"/>
                  <circle className="logo-node" cx="3" cy="38" r="3"/>
      
                  <path className="logo-trace active" d="M31 51 H18 L13 46 H7"/>
                  <circle className="logo-node active" cx="7" cy="46" r="3"/>
      
                  <path className="logo-trace" d="M27 60 H15 L10 65 H4"/>
                  <circle className="logo-node" cx="4" cy="65" r="3"/>
      
                  <path className="logo-trace" d="M75 43 H87 L92 38 H97"/>
                  <circle className="logo-node" cx="97" cy="38" r="3"/>
      
                  <path className="logo-trace active" d="M69 51 H82 L87 46 H93"/>
                  <circle className="logo-node active" cx="93" cy="46" r="3"/>
      
                  <path className="logo-trace" d="M73 60 H85 L90 65 H96"/>
                  <circle className="logo-node" cx="96" cy="65" r="3"/>
      
                  <path className="logo-trace" d="M42 75 V84 L37 89 V96"/>
                  <circle className="logo-node" cx="37" cy="96" r="3"/>
      
                  <path className="logo-trace active" d="M50 75 V90 L50 97"/>
                  <circle className="logo-node active" cx="50" cy="97" r="3"/>
      
                  <path className="logo-trace" d="M58 75 V84 L63 89 V96"/>
                  <circle className="logo-node" cx="63" cy="96" r="3"/>
                </svg>
              </span>
      
              <span className="brand-name">
                DELTA<span className="brand-labs">LABS</span>
              </span>
            </a>
      
            <div className="nav-links">
              <a href="#work">Work</a>
              <a href="#capabilities">Solutions</a>
              <a href="#labs">Labs</a>
              <a href="#about">About</a>
            </div>
      
            <div className="nav-action">
              <a className="nav-cta" href="#contact">Start a project →</a>
            </div>
      
          </nav>
        </div>
      </header>
      
      <main>
      
        
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-signal"></div>
      
          <div className="container hero-content">
            <div className="eyebrow">Delta Labs</div>
      
            <h1>Engineering <span>change.</span></h1>
      
            <p className="hero-copy">
              We build AI, software, automation and intelligent business systems
              designed to create measurable change.
            </p>
      
            <div className="hero-actions">
              <a className="button-primary" href="#contact">Start a project →</a>
              <a className="button-secondary" href="#work">Explore our work</a>
            </div>
      
            <div className="hero-system" aria-hidden="true">
              <span className="system-line one"></span>
              <span className="system-line two"></span>
              <span className="system-line three"></span>
      
              <span className="system-node left"></span>
              <span className="system-node center"></span>
              <span className="system-node right"></span>
      
              <span className="system-delta">
                <svg viewBox="0 0 100 100">
                  <path className="logo-delta" d="M50 13 L76 76 L24 76 Z"/>
                  <path className="logo-delta" d="M50 31 L63 63 L37 63 Z"/>
                </svg>
              </span>
            </div>
          </div>
        </section>
      
        
        <section id="capabilities" className="section capabilities">
          <div className="container">
      
            <div className="section-header">
              <div>
                <div className="section-kicker">What we build</div>
                <h2 className="section-title">Technology that changes how business works.</h2>
              </div>
      
              <p className="section-description">
                From intelligent agents to custom software, we connect technology,
                data and operations into systems built for scale.
              </p>
            </div>
      
            <div className="capability-grid">
      
              <article className="capability-card">
                <div className="card-number">01</div>
                <div className="card-icon">AI</div>
                <h3>AI Systems</h3>
                <p>Intelligent agents, decision systems and AI workflows designed around real business logic.</p>
              </article>
      
              <article className="capability-card">
                <div className="card-number">02</div>
                <div className="card-icon">⌘</div>
                <h3>Software</h3>
                <p>Custom platforms and business applications engineered around the way your operation actually works.</p>
              </article>
      
              <article className="capability-card">
                <div className="card-number">03</div>
                <div className="card-icon">↗</div>
                <h3>Automation</h3>
                <p>Turn repetitive operations into intelligent workflows that move work without constant human intervention.</p>
              </article>
      
              <article className="capability-card">
                <div className="card-number">04</div>
                <div className="card-icon">◈</div>
                <h3>Business Systems</h3>
                <p>Connect data, people, software and processes into one operational system.</p>
              </article>
      
              <article className="capability-card">
                <div className="card-number">05</div>
                <div className="card-icon">Δ</div>
                <h3>Digital Growth</h3>
                <p>Performance and growth infrastructure that turns digital activity into measurable business outcomes.</p>
              </article>
      
              <article className="capability-card">
                <div className="card-number">06</div>
                <div className="card-icon">+</div>
                <h3>Custom Systems</h3>
                <p>When an existing tool isn&apos;t enough, we engineer the system your business actually needs.</p>
              </article>
      
            </div>
          </div>
        </section>
      
        
        <section id="about" className="section delta-section">
          <div className="container delta-layout">
      
            <div className="delta-visual" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <path className="logo-delta" d="M100 18 L164 158 L36 158 Z" strokeWidth="2"/>
                <path className="logo-delta" d="M100 55 L132 128 L68 128 Z" strokeWidth="2"/>
                <path className="logo-trace active" d="M64 82 H34 L22 70 H8"/>
                <circle className="logo-node active" cx="8" cy="70" r="5"/>
                <path className="logo-trace" d="M136 82 H166 L178 70 H192"/>
                <circle className="logo-node" cx="192" cy="70" r="5"/>
                <path className="logo-trace active" d="M100 158 V182"/>
                <circle className="logo-node active" cx="100" cy="188" r="5"/>
              </svg>
            </div>
      
            <div className="delta-copy">
              <div className="section-kicker">The idea behind Delta</div>
              <h2 className="section-title">Change is the product.</h2>
      
              <p>
                In mathematics and science, Δ represents change — the difference
                between one state and another.
              </p>
      
              <p>
                That&apos;s the principle behind Delta Labs. We don&apos;t build technology
                for technology&apos;s sake. We engineer systems that move a business
                from where it is to where it needs to be.
              </p>
      
              <div className="delta-equation">
                <strong>Δ</strong>
                <span>Current state → engineered change → new state</span>
              </div>
            </div>
      
          </div>
        </section>
      
        
        <section id="work" className="section work">
          <div className="container">
      
            <div className="section-header">
              <div>
                <div className="section-kicker">Selected systems</div>
                <h2 className="section-title">Built around real problems.</h2>
              </div>
      
              <p className="section-description">
                A growing portfolio of software, automation and intelligent systems.
              </p>
            </div>
      
            <div className="work-grid">
      
              <article className="work-card">
                <div className="work-visual">
                  <div className="mini-system">
                    <span className="mini-box"></span>
                    <span className="mini-connector"></span>
                    <span className="mini-box"></span>
                    <span className="mini-connector"></span>
                    <span className="mini-box"></span>
                  </div>
                </div>
      
                <div className="work-meta">
                  <div>
                    <h3>Intelligent Operations</h3>
                    <p>Connected workflows that reduce manual work and give teams one operational layer.</p>
                  </div>
                  <span className="work-arrow">↗</span>
                </div>
              </article>
      
              <article className="work-card">
                <div className="work-visual">
                  <div className="mini-system">
                    <span className="mini-box"></span>
                    <span className="mini-connector"></span>
                    <span className="mini-box"></span>
                    <span className="mini-connector"></span>
                    <span className="mini-box"></span>
                  </div>
                </div>
      
                <div className="work-meta">
                  <div>
                    <h3>AI Business Systems</h3>
                    <p>Agents and automation designed to operate inside existing business processes.</p>
                  </div>
                  <span className="work-arrow">↗</span>
                </div>
              </article>
      
            </div>
          </div>
        </section>
      
        
        <section className="section">
          <div className="container">
      
            <div className="section-header">
              <div>
                <div className="section-kicker">How we work</div>
                <h2 className="section-title">From problem to production.</h2>
              </div>
      
              <p className="section-description">
                A practical engineering process focused on outcomes, not unnecessary complexity.
              </p>
            </div>
      
            <div className="process-grid">
      
              <article className="process-step">
                <div className="process-number">01 / DISCOVER</div>
                <h3>Understand</h3>
                <p>Map the business problem, existing systems, constraints and desired outcome.</p>
              </article>
      
              <article className="process-step">
                <div className="process-number">02 / ENGINEER</div>
                <h3>Build</h3>
                <p>Design and develop the smallest system that can create meaningful change.</p>
              </article>
      
              <article className="process-step">
                <div className="process-number">03 / INTEGRATE</div>
                <h3>Connect</h3>
                <p>Put the system into the real workflow and connect it to the tools people already use.</p>
              </article>
      
              <article className="process-step">
                <div className="process-number">04 / SCALE</div>
                <h3>Improve</h3>
                <p>Measure, optimize and expand the system as the business evolves.</p>
              </article>
      
            </div>
          </div>
        </section>
      
        
        <section id="labs" className="section labs">
          <div className="container">
      
            <div className="lab-panel">
              <div className="section-kicker">Inside the lab</div>
      
              <h2>We experiment with what comes next.</h2>
      
              <p>
                Delta Labs is also where new systems begin — AI agents, automation
                infrastructure, internal tools, business intelligence and experimental products.
              </p>
      
              <div className="lab-tags">
                <span className="lab-tag">AI Agents</span>
                <span className="lab-tag">Automation</span>
                <span className="lab-tag">Business Intelligence</span>
                <span className="lab-tag">Internal Tools</span>
                <span className="lab-tag">Experimental Products</span>
                <span className="lab-tag">Growth Infrastructure</span>
              </div>
            </div>
      
          </div>
        </section>
      
        
        <section id="contact" className="final-cta">
          <div className="container">
            <div className="section-kicker">Start the change</div>
            <h2>Have a problem worth engineering?</h2>
            <p>
              Tell us what isn&apos;t working. We&apos;ll help turn the problem into a system.
            </p>
            <a className="button-primary" href="mailto:hello@deltalabs.com">Start a conversation →</a>
          </div>
        </section>
      
      </main>
      
      
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">DELTA LABS</div>
          <div className="footer-note">© 2026 Delta Labs. Engineering change.</div>
        </div>
      </footer>
    </>
  );
}
