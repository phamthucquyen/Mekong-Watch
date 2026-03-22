import type { AnalysisResponse } from "@/lib/types";

type ManualDemoAnalysis = Pick<
  AnalysisResponse,
  "score" | "riskLevel" | "summary" | "layers" | "overlayRegions" | "reasons" | "assets" | "recommendations"
>;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s,.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesBinhMinhDemoLocation(...values: string[]) {
  return values.some((value) => {
    const normalized = normalizeText(value);
    const hasBinhMinh = normalized.includes("binh minh");
    const hasCuaLo = normalized.includes("cua lo") || normalized.includes("cua hoi");
    const hasNgheAn = normalized.includes("nghe an");
    const hasBeachTerm =
      normalized.includes("beach") ||
      normalized.includes("bien") ||
      normalized.includes("bai tam") ||
      normalized.includes("bai bien");

    return (
      (hasBinhMinh && hasCuaLo) ||
      (hasBinhMinh && hasNgheAn) ||
      (hasCuaLo && hasNgheAn) ||
      (hasBinhMinh && hasBeachTerm) ||
      (hasCuaLo && hasBeachTerm)
    );
  });
}

export function isNearBinhMinhDemoLocation(lat: number, lng: number) {
  const demoLat = 18.8065;
  const demoLng = 105.7208;
  const latDelta = Math.abs(lat - demoLat);
  const lngDelta = Math.abs(lng - demoLng);

  return latDelta <= 0.035 && lngDelta <= 0.035;
}

export function getBinhMinhDemoAnalysis(): ManualDemoAnalysis {
  return {
    score: 8.2,
    riskLevel: "High",
    summary:
      "This manual Binh Minh demo view highlights the same regions shown in the analysis pane: a large inland houses block marked at 84%, open water on the right at 72%, and two vegetation areas marked at 20% and 15%. The page content is tuned to this fixed overlay so the side panels match what the viewer sees in the image.",
    layers: [
      { key: "built", label: "Houses", value: 84, color: "#94A3B8" },
      { key: "water", label: "Water", value: 72, color: "#3B82F6" },
      { key: "green", label: "Vegetation", value: 35, color: "#22C55E" }
    ],
    overlayRegions: [
      {
        key: "water",
        label: "Water",
        color: "#3B82F6",
        x: 0.7,
        y: 0.0,
        width: 0.3,
        height: 1,
        confidence: 0.72,
        fillOpacity: 0.24
      },
      {
        key: "green",
        label: "Vegetation",
        color: "#22C55E",
        x: 0.33,
        y: 0,
        width: 0.18,
        height: 0.46,
        confidence: 0.20,
        fillOpacity: 0.15
      },
      {
        key: "built",
        label: "Houses",
        color: "#94A3B8",
        x: 0.04,
        y: 0.05,
        width: 0.56,
        height: 0.9,
        confidence: 0.84,
        fillOpacity: 0.12
      },
      {
        key: "green",
        label: "Vegetation",
        color: "#22C55E",
        x: 0.59,
        y: 0.68,
        width: 0.18,
        height: 0.27,
        confidence: 0.15,
        fillOpacity: 0.15
      }
    ],
    reasons: [
      { title: "Proximity to water bodies detected", level: "High" },
      { title: "Dense houses cluster close to the shoreline", level: "High" },
      { title: "Partial vegetation buffer present", level: "Medium" }
    ],
    assets: [
      { label: "Houses box 84%", level: "High" },
      { label: "Water box 72%", level: "High" },
      { label: "Upper vegetation 20%", level: "Medium" },
      { label: "Lower vegetation 15%", level: "Medium" }
    ],
    recommendations: [
      {
        title: "Map detailed evacuation routes for flood season",
        body: "Map detailed evacuation routes for flood season."
      },
      {
        title: "Assess drainage infrastructure capacity",
        body: "Assess drainage infrastructure capacity."
      },
      {
        title: "Monitor water levels at key sensor points",
        body: "Monitor water levels at key sensor points."
      }
    ]
  };
}
