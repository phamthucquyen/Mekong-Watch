import { howSteps } from "@/lib/site-content";

export default function HowPage() {
  return (
    <main className="page-shell">
      <section className="how-page">
        <div className="section-header" style={{ textAlign: "left", marginBottom: 8 }}>
          <div className="section-eyebrow">UNDER THE HOOD</div>
          <h2 className="section-title">How Mekong Watch works</h2>
        </div>
        <p className="page-lead" style={{ marginBottom: 48, maxWidth: 560 }}>
          Five steps from a place name to a full flood risk report, powered by Gemini and Google
          Maps.
        </p>

        <div className="steps-timeline">
          {howSteps.map((step, index) => (
            <div key={step.title} className="step">
              <div className="step-num-col">
                <div className="step-circle">{index + 1}</div>
                {index < howSteps.length - 1 ? <div className="step-line" /> : null}
              </div>
              <div className="step-body">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>
                <div className="step-code">{step.code.join("\n")}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
