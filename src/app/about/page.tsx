import { techItems } from "@/lib/site-content";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="about-page">
        <h1 className="about-hero-title">
          Built for the people
          <br />
          protecting <span>Vietnam&apos;s rivers</span>
        </h1>
        <p className="about-lead">
          Mekong Watch is a flood risk awareness tool designed for local government officials,
          urban planners, and emergency coordinators across Vietnam. We turn satellite imagery into
          plain-language risk intelligence without requiring GIS expertise.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-card-icon">🎯</div>
            <div className="about-card-title">The problem</div>
            <div className="about-card-text">
              Vietnam&apos;s Mekong Delta faces severe compound flood risk as sea-level rise, land
              subsidence, and rapid urban development converge in one densely populated region.
              Local authorities often lack accessible, visual tools to understand where risk is
              concentrated.
            </div>
          </div>

          <div className="about-card">
            <div className="about-card-icon">💡</div>
            <div className="about-card-title">Our approach</div>
            <div className="about-card-text">
              Rather than building another complex GIS dashboard, Mekong Watch uses Gemini to
              interpret satellite imagery and then presents findings in plain language with clear
              visual overlays. The goal is insight in seconds, not hours.
            </div>
          </div>
        </div>

        <hr className="divider-line" />

        <div className="tech-stack-section">
          <div className="section-eyebrow" style={{ marginBottom: 20 }}>
            TECH STACK
          </div>
          <div className="tech-row">
            {techItems.map((item) => (
              <div key={item.name} className="tech-item">
                <div className="tech-dot" style={{ background: item.color }} />
                <div className="tech-name">{item.name}</div>
                <div className="tech-desc">{item.description}</div>
                {item.prize ? <div className="tech-prize">★ PRIZE TARGET</div> : null}
              </div>
            ))}
          </div>
        </div>

        <hr className="divider-line" />

        <div>
          <div className="section-eyebrow" style={{ marginBottom: 20 }}>
            BUILT AT
          </div>
          <p className="page-lead">
            Mekong Watch is being shaped as a fast, judge-friendly civic-tech website for a
            hackathon. The current focus is Gemini-first flood analysis, with the rest of the
            integrations intentionally deferred until the core experience is solid.
          </p>
        </div>
      </section>
    </main>
  );
}
