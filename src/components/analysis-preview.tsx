"use client";

import Image from "next/image";
import { MapCanvas } from "@/components/map-canvas";
import type { OverlayRegion } from "@/lib/types";

type AnalysisPreviewProps = {
  satelliteImageUrl: string;
  overlayRegions: OverlayRegion[];
};

export function AnalysisPreview({
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
          <div className="relative h-full w-full bg-[var(--navy)]">
            <Image
              src={satelliteImageUrl}
              alt="Static satellite view of the selected area"
              fill
              unoptimized
              priority
              sizes="(max-width: 800px) 100vw, 380px"
              className="object-cover"
            />
          </div>
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
