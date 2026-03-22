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
  const [leftTopHeight, setLeftTopHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      if (leftTopRef.current) {
        setLeftTopHeight(leftTopRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [analysis.layers]);

  const filteredOverlayRegions = useMemo(
    () => analysis.overlayRegions.filter((region) => activeKeys.includes(region.key)),
    [activeKeys, analysis.overlayRegions]
  );

  const riskDrivers = analysis.reasons.slice(0, 3);
  const recommendedActions = analysis.recommendations.slice(0, 3);

  function toggleLayer(key: OverlayLayer["key"]) {
    setActiveKeys((currentKeys) =>
      currentKeys.includes(key) ? currentKeys.filter((currentKey) => currentKey !== key) : [...currentKeys, key]
    );
  }

  return (
    <section className="analyze-layout">
      <aside className="side-panel">
        <div ref={leftTopRef} className="side-panel-top">
          <div>
            <div className="panel-section-label">Selected area</div>
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

          <div>
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

        <div className="insight-card risk-drivers-card">
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
          <div className="map-frame" style={leftTopHeight ? { height: `${leftTopHeight}px` } : undefined}>
            <AnalysisPreview satelliteImageUrl={analysis.satelliteImageUrl} overlayRegions={filteredOverlayRegions} />
          </div>

          <div className="insight-card center-actions-card">
            <div className="panel-section-label">RECOMMENDED ACTIONS</div>
            <div className="terrain-intro">
              Prioritized next steps local authorities can take before the next flood season
            </div>
            <div className="action-grid">
              {recommendedActions.map((recommendation, index) => (
                <div key={recommendation.title} className="action-grid-card">
                  <div className="action-grid-index">{String(index + 1).padStart(2, "0")}.</div>
                  <div className="action-grid-title">{recommendation.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="side-panel side-panel-right">
        <div className="insight-card terrain-panel-card">
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
      </aside>
    </section>
  );
}
