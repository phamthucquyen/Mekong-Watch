"use client";

import { LiveSatelliteMap } from "@/components/live-satellite-map";
import { MapCanvas } from "@/components/map-canvas";
import type { OverlayRegion } from "@/lib/types";

type AnalysisPreviewProps = {
  address: string;
  zoom: number;
  satelliteImageUrl: string;
  overlayRegions: OverlayRegion[];
};

export function AnalysisPreview({
  address,
  zoom,
  satelliteImageUrl,
  overlayRegions
}: AnalysisPreviewProps) {
  return (
    <div className="map-preview-grid">
      <div className="map-preview-card">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="text-xs uppercase tracking-[0.28em] text-[var(--text2)]">Satellite · Original</span>
        </div>

        <div className="map-preview-surface">
          <LiveSatelliteMap address={address} zoom={zoom} />
        </div>
      </div>

      <div className="map-preview-card">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="text-xs uppercase tracking-[0.28em] text-[var(--text2)]">Analysis View</span>
        </div>

        <div className="map-preview-surface">
          <MapCanvas overlayOnly satelliteImageUrl={satelliteImageUrl} overlayRegions={overlayRegions} />
        </div>
      </div>
    </div>
  );
}
