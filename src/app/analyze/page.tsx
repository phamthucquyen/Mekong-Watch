import { MapCanvas } from "@/components/map-canvas";
import { mockAnalysis } from "@/lib/mock-data";

export default function AnalyzePage() {
  return (
    <main className="page-shell">
      <section className="analyze-layout">
        <aside className="side-panel">
          <div>
            <div className="panel-section-label">Selected area</div>
            <div className="location-card">
              <div className="location-name">{mockAnalysis.location}</div>
              <div className="location-meta">{mockAnalysis.region}</div>
              <div className="location-coords">{mockAnalysis.coordinates} · Zoom 14</div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-lbl">Flood vulnerability score</div>
            <div className="score-num">{mockAnalysis.score}</div>
            <div className="score-tier">⬥ {mockAnalysis.riskLevel.toUpperCase()} RISK</div>
            <div className="score-bar">
              <div className="score-fill" />
            </div>
          </div>

          <div>
            <div className="panel-section-label">Overlay layers</div>
            <div className="layer-list">
              {mockAnalysis.layers.map((layer) => (
                <div key={layer.key} className="layer-row on">
                  <div className="layer-dot" style={{ background: layer.color }} />
                  <span className="layer-name">{layer.label}</span>
                  <span className="layer-pct">{layer.value}%</span>
                  <div className="toggle" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="panel-section-label">Why this matters</div>
            <div className="risk-list">
              {mockAnalysis.reasons.map((reason, index) => (
                <div key={reason.title} className="risk-row">
                  <span className="risk-ico">{["〰", "🏗", "🌿", "⚠", "📉"][index] ?? "•"}</span>
                  <span className="risk-txt">{reason.title}</span>
                  <span className={`sev ${reason.level === "Medium" ? "sev-m" : "sev-h"}`}>
                    {reason.level === "Medium" ? "MED" : "HIGH"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="map-center">
          <div className="map-topbar">
            <div className="map-btn active">Split view</div>
            <div className="map-btn">Satellite only</div>
            <div className="map-btn">Overlay only</div>
            <div className="map-btn">Heatmap</div>
          </div>

          <div className="pane-label-map" style={{ left: 12 }}>
            SATELLITE · ORIGINAL
          </div>
          <div className="pane-label-map" style={{ right: 12 }}>
            GEMINI · OVERLAY
          </div>

          <MapCanvas />

          <div className="map-zoom">
            <div className="zoom-btn">+</div>
            <div className="zoom-btn">−</div>
          </div>
        </section>

        <aside className="side-panel side-panel-right">
          <div className="insight-card">
            <div className="insight-title">
              AI analysis <span className="g-badge">GEMINI</span>
            </div>
            <div className="insight-text">{mockAnalysis.summary}</div>
          </div>

          <div>
            <div className="panel-section-label">Exposed assets detected</div>
            <div className="asset-list">
              {mockAnalysis.assets.map((asset, index) => (
                <div key={asset.label} className="asset-row">
                  <span className="asset-icon">{["🏥", "🏫", "🛣", "🌾", "🏘"][index] ?? "•"}</span>
                  <span className="asset-name">{asset.label}</span>
                  <span
                    className="asset-sev"
                    style={{
                      background:
                        asset.level === "Critical"
                          ? "rgba(217,64,64,0.2)"
                          : asset.level === "Medium"
                            ? "rgba(45,143,221,0.2)"
                            : "rgba(232,160,32,0.2)",
                      color:
                        asset.level === "Critical"
                          ? "#e85c4a"
                          : asset.level === "Medium"
                            ? "#60b4f8"
                            : "#e8a020"
                    }}
                  >
                    {asset.level.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="panel-section-label">Recommended actions</div>
            <div className="action-list">
              {mockAnalysis.recommendations.map((recommendation) => (
                <div key={recommendation.title} className="action-item">
                  {recommendation.body}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
