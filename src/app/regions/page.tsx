import Link from "next/link";
import { regions } from "@/lib/site-content";

function tierStyles(tier: string) {
  if (tier === "Critical") {
    return {
      badge: {
        background: "rgba(217,64,64,0.15)",
        color: "#e85c4a",
        border: "1px solid rgba(217,64,64,0.25)"
      },
      scoreColor: "#e85c4a",
      fill: "linear-gradient(90deg,#e8a020,#d94040)"
    };
  }

  if (tier === "High") {
    return {
      badge: {
        background: "rgba(232,160,32,0.15)",
        color: "#e8a020",
        border: "1px solid rgba(232,160,32,0.25)"
      },
      scoreColor: "#e8a020",
      fill: "#e8a020"
    };
  }

  if (tier === "Medium") {
    return {
      badge: {
        background: "rgba(45,143,221,0.15)",
        color: "#60b4f8",
        border: "1px solid rgba(45,143,221,0.25)"
      },
      scoreColor: "#60b4f8",
      fill: "#2d8fdd"
    };
  }

  return {
    badge: {
      background: "rgba(59,186,106,0.15)",
      color: "#3bba6a",
      border: "1px solid rgba(59,186,106,0.25)"
    },
    scoreColor: "#3bba6a",
    fill: "#3bba6a"
  };
}

export default function RegionsPage() {
  return (
    <main className="page-shell">
      <section className="regions-page" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="section-header" style={{ textAlign: "left", marginBottom: 4 }}>
          <h2 className="section-title">Pre-analyzed regions</h2>
        </div>
        <p className="page-lead" style={{ marginBottom: 48, maxWidth: 640 }}>
          Six key locations. Six risk profiles. All in Vietnam&apos;s most flood-exposed region.
        </p>

        <div className="regions-grid">
          {regions.map((region) => {
            const styles = tierStyles(region.tier);

            return (
              <Link key={region.name} href="/analyze" className="region-card">
                <div className="region-badge" style={styles.badge}>
                  {region.tier.toUpperCase()}
                </div>
                <div className="region-name">{region.name}</div>
                <div className="region-loc">{region.location}</div>
                <div className="region-score-row">
                  <div className="region-score" style={{ color: styles.scoreColor }}>
                    {region.score}
                  </div>
                  <div className="region-tier" style={{ color: styles.scoreColor }}>
                    / 10
                  </div>
                </div>
                <div className="region-bar-bg">
                  <div
                    className="region-bar-fill"
                    style={{ width: `${region.score * 10}%`, background: styles.fill }}
                  />
                </div>
                <div className="region-facts">
                  {region.facts.map((fact) => (
                    <div key={fact} className="region-fact">
                      {fact}
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
