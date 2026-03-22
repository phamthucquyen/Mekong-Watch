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
      "This demo overlay is manually placed from your Binh Minh annotation so the boxes land in the same major areas you labeled: open water on the right, houses inland to the left, and vegetation along the diagonal beachfront. It is a hand-tuned showcase overlay rather than a learned detector for new scenes.",
    layers: [
      { key: "water", label: "Water", value: 31, color: "#3B82F6" },
      { key: "green", label: "Vegetation", value: 18, color: "#22C55E" },
      { key: "built", label: "Houses", value: 41, color: "#94A3B8" },
      { key: "exposure", label: "Beach corridor", value: 10, color: "#FACC15" }
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
        confidence: 0.96,
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
        confidence: 0.82,
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
        confidence: 0.9,
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
        confidence: 0.8,
        fillOpacity: 0.15
      }
    ],
    reasons: [
      { title: "The water box covers the full right-hand sea area from your annotation", level: "High" },
      { title: "The houses box sits over the large inland block on the left side of the scene", level: "High" },
      { title: "Vegetation is split into the upper strip and lower-right pocket you marked", level: "Medium" },
      { title: "A narrow beach corridor remains between inland frontage and the water edge", level: "Medium" }
    ],
    assets: [
      { label: "Water zone box", level: "High" },
      { label: "House block box", level: "High" },
      { label: "Upper vegetation strip", level: "Medium" },
      { label: "Lower vegetation pocket", level: "Medium" }
    ],
    recommendations: [
      {
        title: "Keep this view fixed",
        body: "For the most convincing demo, use the same location wording and map framing so the manual overlay stays aligned with the intended beachfront scene."
      },
      {
        title: "Pair with your annotation story",
        body: "Explain that the right pane was tuned directly from your annotated reference so the classes follow the real sea, vegetation, and built-up layout."
      },
      {
        title: "Treat as showcase output",
        body: "This manual preset is designed for the Binh Minh demo scene and should not be presented as a generalized detector for other addresses."
      }
    ]
  };
}
