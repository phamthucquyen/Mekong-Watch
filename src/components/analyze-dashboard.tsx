"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnalysisPreview } from "@/components/analysis-preview";
import type { AnalysisResult } from "@/lib/analysis";
import type { OverlayLayer } from "@/lib/types";

type AnalyzeDashboardProps = {
  submittedLocation: string;
  analysis: AnalysisResult;
};

const DRIVER_ICONS = ["〰", "🏗", "🌿", "⚠"];

function getTerrainLabel(layer: OverlayLayer, source: AnalysisResult["source"]) {
  if (source === "manual") {
    if (layer.key === "built") {
      return "Developed land";
    }

    if (layer.key === "water") {
      return "Water bodies";
    }

    if (layer.key === "green") {
      return "Vegetation cover";
    }
  }

  return layer.label;
}

function getTerrainDescription(layer: OverlayLayer, source: AnalysisResult["source"]) {
  if (source === "manual") {
    if (layer.key === "built") {
      return "Extreme urban density — nearly all land is impervious surface, leaving almost no capacity to absorb rainfall before it runs off into flood zones.";
    }

    if (layer.key === "water") {
      return "Most of the scene is already at or near water - this is not potential flood risk, this is active flood extent. Very little dry land remains as a buffer.";
    }

    if (layer.key === "green") {
      return "Some cover present but heavily fragmented. At this ratio against 84% developed land, vegetation cannot meaningfully offset runoff or provide flood absorption.";
    }

    return "Narrow exposed corridor between inland structures and the coastline.";
  }

  if (layer.key === "built") {
    return "Built surfaces and rooftops visible in the current satellite frame.";
  }

  if (layer.key === "water") {
    return "Visible water body or shoreline area in the current satellite frame.";
  }

  if (layer.key === "green") {
    return "Vegetation cover visible in the current satellite frame.";
  }

  return "Areas where visible land cover sits closest to the water edge.";
}

export function AnalyzeDashboard({ submittedLocation, analysis }: AnalyzeDashboardProps) {
  const [activeKeys, setActiveKeys] = useState<Array<OverlayLayer["key"]>>(
    analysis.layers.map((layer) => layer.key)
  );

  const leftTopRef = useRef<HTMLDivElement>(null);

  const riskDriversRef = useRef<HTMLDivElement>(null);
  const [riskDriversHeight, setRiskDriversHeight] = useState<number>(0);

  const terrainRef = useRef<HTMLDivElement>(null);
  const [terrainHeight, setTerrainHeight] = useState<number>(0);

  const selectedAreaLabelRef = useRef<HTMLDivElement>(null);
  const [labelOffset, setLabelOffset] = useState<number>(0);

  // First pass: measure terrain and label (these don't depend on other measurements)
  useEffect(() => {
    const update = () => {
      if (selectedAreaLabelRef.current) {
        setLabelOffset(selectedAreaLabelRef.current.offsetHeight + 6);
      }
      if (terrainRef.current) {
        setTerrainHeight(terrainRef.current.offsetHeight);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [analysis.layers]);

  // Second pass: measure riskDriversHeight after layout has settled with correct minHeight
  useEffect(() => {
    if (!terrainHeight || !labelOffset) return;
    const frame = requestAnimationFrame(() => {
      if (riskDriversRef.current) {
        setRiskDriversHeight(riskDriversRef.current.offsetHeight);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [terrainHeight, labelOffset]);

  const filteredOverlayRegions = useMemo(
    () => analysis.overlayRegions.filter((region) => activeKeys.includes(region.key)),
    [activeKeys, analysis.overlayRegions]
  );

  const riskDrivers = analysis.reasons.slice(0, 3);
  const recommendedActions = analysis.recommendations.slice(0, 3);

  const [alertScore, setAlertScore] = useState<string>("7");
  const [alertEmail, setAlertEmail] = useState<string>("");
  const [alertSaved, setAlertSaved] = useState<boolean>(false);

  function handleAlertSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
  }

  function toggleLayer(key: OverlayLayer["key"]) {
    setActiveKeys((currentKeys) =>
      currentKeys.includes(key) ? currentKeys.filter((currentKey) => currentKey !== key) : [...currentKeys, key]
    );
  }

  return (
    <section className="analyze-layout">
      <aside className="side-panel">
        <div ref={leftTopRef} className="side-panel-top" style={terrainHeight ? { minHeight: `${labelOffset + terrainHeight}px` } : undefined}>
          <div>
            <div ref={selectedAreaLabelRef} className="panel-section-label">Selected area</div>
            <div className="location-card">
              <div className="location-name">{submittedLocation}</div>
              <div className="location-coords">{analysis.coordinates}</div>
            </div>
          </div>

          <div className="score-card">
            <div className="score-num">{analysis.score}</div>
            <div className="score-tier">HIGH FLOOD VULNERABILITY</div>
            <div className="score-bar">
              <div className="score-fill" style={{ width: `${Math.max(18, analysis.score * 10)}%` }} />
            </div>
          </div>

          <div className="annotations-section">
            <div className="panel-section-label">ANNOTATIONS</div>
            <div className="layer-list">
              {analysis.layers.map((layer) => {
                const isActive = activeKeys.includes(layer.key);

                return (
                  <button
                    key={layer.key}
                    type="button"
                    className={`layer-row ${isActive ? "on" : "off"}`}
                    onClick={() => toggleLayer(layer.key)}
                  >
                    <div className="layer-dot" style={{ background: layer.color }} />
                    <span className="layer-name">{layer.label}</span>
                    <span className="layer-pct">{layer.value}%</span>
                    <span className={`toggle ${isActive ? "on" : "off"}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={riskDriversRef} className="insight-card risk-drivers-card">
          <div className="panel-section-label">RISK DRIVERS</div>
          <div className="risk-driver-list">
            {riskDrivers.map((reason, index) => (
              <div key={reason.title} className="risk-driver-card">
                <span className="risk-driver-icon">{DRIVER_ICONS[index] ?? "•"}</span>
                <span className="risk-driver-text">{reason.title}</span>
                <span className={`sev ${reason.level === "Medium" ? "sev-m" : "sev-h"}`}>
                  {reason.level === "Medium" ? "MED" : "HIGH"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="map-center">
        <div className="map-center-stack">
          <div className="map-frame" style={{ ...(terrainHeight ? { height: `${terrainHeight}px` } : {}), ...(labelOffset ? { marginTop: `${labelOffset}px` } : {}) }}>
            <AnalysisPreview satelliteImageUrl={analysis.satelliteImageUrl} overlayRegions={filteredOverlayRegions} />
          </div>

          <div className="insight-card center-actions-card" style={riskDriversHeight ? { height: `${riskDriversHeight}px` } : undefined}>
            <div className="panel-section-label">RECOMMENDED ACTIONS</div>
            <div className="terrain-intro">
              Prioritized next steps local authorities can take before the next flood season
            </div>
            <div className="action-grid">
              {recommendedActions.map((recommendation, index) => (
                <div key={recommendation.title} className={`action-grid-card action-grid-card--${(recommendation.priority ?? "HIGH").toLowerCase()}`}>
                  <div className="action-grid-header">
                    <span className="action-grid-index">{String(index + 1).padStart(2, "0")}.</span>
                    {recommendation.priority && (
                      <span className={`action-priority-badge action-priority-badge--${recommendation.priority.toLowerCase()}`}>
                        {recommendation.priority}
                      </span>
                    )}
                  </div>
                  <div className="action-grid-title">{recommendation.title}</div>
                  {(recommendation.category || recommendation.timeframe) && (
                    <div className="action-grid-meta">
                      <span className={`action-meta-dot action-meta-dot--${(recommendation.priority ?? "high").toLowerCase()}`} />
                      {recommendation.category}{recommendation.timeframe ? ` · ${recommendation.timeframe}` : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="side-panel side-panel-right">
        <div ref={terrainRef} className="insight-card terrain-panel-card">
          <div className="panel-section-label">TERRAIN ANALYSIS</div>
          <div className="terrain-intro">How flood risk contribution is distributed across detected land types</div>
          <div className="terrain-list">
            {analysis.layers.map((layer) => (
              <div key={layer.key} className="terrain-item">
                <div className="terrain-head">
                  <div className="terrain-label">
                    <span className="terrain-dot" style={{ background: layer.color }} />
                    <span>{getTerrainLabel(layer, analysis.source)}</span>
                  </div>
                  <span className="terrain-pct">{layer.value}%</span>
                </div>
                <div className="terrain-bar">
                  <div
                    className="terrain-fill"
                    style={{ width: `${layer.value}%`, background: layer.color }}
                  />
                </div>
                <div className="terrain-desc">{getTerrainDescription(layer, analysis.source)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="insight-card alert-card" style={riskDriversHeight && labelOffset ? { height: `${labelOffset + riskDriversHeight}px` } : undefined}>
          <div className="panel-section-label">ALERT THRESHOLDS</div>
          <p className="alert-desc">Get notified when flood risk exceeds your set threshold for this location.</p>
          <form className="alert-form" onSubmit={handleAlertSubmit}>
            <div className="alert-field">
              <label className="alert-label">Risk score trigger</label>
              <div className="alert-score-row">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={alertScore}
                  onChange={(e) => { setAlertSaved(false); setAlertScore(e.target.value); }}
                  className="alert-slider"
                />
                <span className="alert-score-val">{Number(alertScore).toFixed(1)}</span>
              </div>
            </div>
            <div className="alert-field">
              <label className="alert-label">Notify via email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={alertEmail}
                onChange={(e) => { setAlertSaved(false); setAlertEmail(e.target.value); }}
                className="alert-input"
                required
              />
            </div>
            <button type="submit" className={`alert-btn ${alertSaved ? "alert-btn-saved" : ""}`}>
              {alertSaved ? "✓ Alert saved" : "Set alert"}
            </button>
          </form>
        </div>
      </aside>
    </section>
  );
}
