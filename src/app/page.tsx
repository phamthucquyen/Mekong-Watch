import Link from "next/link";
import { homeFeatures } from "@/lib/site-content";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-content">
          <h1 className="hero-title">
            Floods are
            <br />
            expected.
            <br />
            The damage <span>doesn't have to be</span>
          </h1>
          <p className="hero-sub">
          Every year, communities across the Mekong Delta lose homes, livelihoods, and lives to floods. Authorities know it's
           coming, but year after year, the impact is underestimated, resources fall short, and people are left unprepared. Mekong Watch exists to change that.
          </p>

          <div className="search-hero">
            <input type="text" placeholder="Enter a city, district, or address in Vietnam..." />
            <Link href="/analyze" className="primary-link">
              Analyze →
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">63</div>
              <div className="hero-stat-label">provinces analyzed</div>
            </div>
            <div>
              <div className="hero-stat-num">4.1M</div>
              <div className="hero-stat-label">residents covered</div>
            </div>
            <div>
              <div className="hero-stat-num">94%</div>
              <div className="hero-stat-label">model accuracy</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <div className="section-eyebrow">WHAT WE DO</div>
          <h2 className="section-title">From satellite to decision, in seconds</h2>
        </div>

        <div className="features-grid">
          {homeFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-desc">{feature.description}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
