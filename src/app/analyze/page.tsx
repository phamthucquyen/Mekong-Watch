import { analyzeLocation } from "@/lib/analysis";
import { AnalysisPreview } from "@/components/analysis-preview";
import { LocationAutocompleteForm } from "@/components/location-autocomplete-form";

type AnalyzePageProps = {
  searchParams: Promise<{
    location?: string | string[];
  }>;
};

function EmptyAnalyzeState() {
  return (
    <main className="page-shell">
      <section className="min-h-[calc(100vh-58px)] bg-[var(--navy)]">
        <div className="border-b border-[var(--border)] bg-[var(--navy2)] px-5 py-4">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 xl:flex-row xl:items-center">
            <div className="mono-text text-[10px] tracking-[2px] text-[var(--text3)]">
              ANALYZE LOCATION
            </div>

            <LocationAutocompleteForm
              action="/analyze"
              placeholder="Enter a city, district, or address in Vietnam..."
              wrapperClassName="flex-1"
              formClassName="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center"
              inputClassName="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--navy)] px-4 text-base text-[var(--text)] outline-none"
              buttonClassName="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--blue)] px-8 text-sm font-semibold text-white"
            />

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text3)]">
              <span>○ Geocoding</span>
              <span>━━</span>
              <span>○ Satellite</span>
              <span>━━</span>
              <span>○ AI Segmentation</span>
              <span>━━</span>
              <span>○ Done</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-134px)] items-center justify-center px-6 py-16 text-center">
          <div className="max-w-xl">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--navy2)] text-3xl">
              🛰
            </div>
            <h1 className="display-text text-5xl font-bold text-[var(--text)]">
              Enter a location to begin
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-[var(--text2)]">
              Type a city or district in Vietnam above and click Analyze to generate a real-time
              shoreline exposure view.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Cần Thơ", "Hội An", "Long Xuyên", "Đà Lạt"].map((city) => (
                <form key={city} action="/analyze">
                  <input type="hidden" name="location" value={city} />
                  <button
                    type="submit"
                    className="rounded-full border border-[var(--border)] bg-[var(--navy2)] px-5 py-2 text-sm text-[var(--text2)]"
                  >
                    {city}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;
  const location = Array.isArray(params.location) ? params.location[0] : params.location;
  const submittedLocation = location?.trim();

  if (!submittedLocation) {
    return <EmptyAnalyzeState />;
  }

  const analysis = await analyzeLocation(submittedLocation);
  const liveMapZoom = analysis.source === "manual" ? 17 : /\d/.test(submittedLocation) ? 19 : 16;
  const analysisBadge =
    analysis.source === "manual"
      ? "DEMO"
      : analysis.source === "gemini"
        ? "GEMINI"
        : "FALLBACK";
  const analysisTitle =
    analysis.source === "manual"
      ? "Manual demo overlay"
      : "Visual interpretation";

  return (
    <main className="page-shell">
      <section className="analyze-layout">
        <aside className="side-panel">
          <div>
            <div className="panel-section-label">Selected area</div>
            <div className="location-card">
              <div className="location-name">{submittedLocation}</div>
              <div className="location-meta">
                {analysis.source === "manual"
                  ? "Pinned demo overlay prepared for the Binh Minh beachfront scene"
                  : "Satellite scene prepared for visual interpretation"}
              </div>
              <div className="location-coords">{analysis.coordinates} · Zoom {liveMapZoom}</div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-lbl">{analysis.scoreContext}</div>
            <div className="score-num">{analysis.score}</div>
            <div className="score-tier">⬥ {analysis.riskLevel.toUpperCase()} VISUAL EXPOSURE</div>
            <div className="score-bar">
              <div className="score-fill" />
            </div>
          </div>

          <div>
            <div className="panel-section-label">Overlay layers</div>
            <div className="layer-list">
              {analysis.layers.map((layer) => (
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
            <div className="panel-section-label">Visible cues</div>
            <div className="risk-list">
              {analysis.reasons.map((reason, index) => (
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
          <div className="map-frame">
            <AnalysisPreview
              satelliteImageUrl={analysis.satelliteImageUrl}
              overlayRegions={analysis.overlayRegions}
            />
          </div>
        </section>

        <aside className="side-panel side-panel-right">
          <div className="insight-card">
            <div className="insight-title">
              {analysisTitle} <span className="g-badge">{analysisBadge}</span>
            </div>
            <div className="insight-text">{analysis.summary}</div>
          </div>

          <div>
            <div className="panel-section-label">Visual cues detected</div>
            <div className="asset-list">
              {analysis.assets.map((asset, index) => (
                <div key={asset.label} className="asset-row">
                  <span className="asset-icon">{["〰", "⚠", "🏗", "🌿", "📍"][index] ?? "•"}</span>
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
            <div className="panel-section-label">Next checks</div>
            <div className="action-list">
              {analysis.recommendations.map((recommendation) => (
                <div key={recommendation.title} className="action-item">
                  {recommendation.body}
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <div className="panel-section-label">Interpretation notes</div>
            <div className="action-list">
              {analysis.notes.map((note) => (
                <div key={note} className="action-item">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
