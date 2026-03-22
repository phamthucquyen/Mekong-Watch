import type { AnalysisResponse } from "@/lib/types";

export const mockAnalysis: AnalysisResponse = {
  analysisScope: "visual",
  scoreContext: "Visual exposure indicator from the current satellite image",
  location: "Can Tho District",
  region: "Mekong Delta, Southern Vietnam",
  coordinates: "10.0452 N, 105.7469 E",
  score: 7.2,
  riskLevel: "High",
  summary:
    "The image shows dense built-up blocks pressed close to a broad waterfront with only a thin green buffer between roads, parcels, and the shoreline. Visually, that pattern suggests elevated surface exposure if water levels push inland or drainage capacity is overwhelmed.",
  layers: [
    { key: "water", label: "Water / shoreline", value: 33, color: "#3B82F6" },
    { key: "green", label: "Vegetation cover", value: 11, color: "#22C55E" },
    { key: "built", label: "Built-up surfaces", value: 44, color: "#94A3B8" },
    { key: "exposure", label: "Exposed edge zones", value: 12, color: "#FACC15" }
  ],
  overlayRegions: [
    { key: "water", label: "Water", color: "#3B82F6", x: 0.57, y: 0.02, width: 0.41, height: 0.93, confidence: 0.94 },
    { key: "built", label: "Built-up", color: "#94A3B8", x: 0.03, y: 0.09, width: 0.38, height: 0.78, confidence: 0.88 },
    { key: "exposure", label: "Shore edge", color: "#FACC15", x: 0.43, y: 0.09, width: 0.18, height: 0.76, confidence: 0.84 },
    { key: "green", label: "Vegetation", color: "#22C55E", x: 0.14, y: 0.54, width: 0.13, height: 0.23, confidence: 0.74 }
  ],
  reasons: [
    { title: "Dense development sits immediately beside the waterfront edge", level: "High" },
    { title: "The visible green buffer is thin and fragmented", level: "Medium" },
    { title: "Large continuous paved or roofed surfaces dominate the land area", level: "High" },
    { title: "The transition from shoreline to streets appears abrupt", level: "High" }
  ],
  assets: [
    { label: "Dense shoreline development band", level: "High" },
    { label: "Large impervious road-and-roof grid", level: "High" },
    { label: "Limited planted buffer near the edge", level: "Medium" },
    { label: "Open waterfront transition area", level: "High" }
  ],
  recommendations: [
    {
      title: "Compare with flood maps",
      body: "Validate this visual interpretation against local flood-depth, tide, or inundation data before making risk claims."
    },
    {
      title: "Check elevation and drainage",
      body: "Review whether the built-up edge near the shoreline also aligns with low elevation or poor drainage pathways."
    },
    {
      title: "Inspect shoreline protection",
      body: "Use local engineering and planning records to confirm how exposed the visible waterfront edge really is."
    }
  ]
};
