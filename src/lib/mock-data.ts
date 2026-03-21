import type { AnalysisResponse } from "@/lib/types";

export const mockAnalysis: AnalysisResponse = {
  location: "Can Tho District",
  region: "Mekong Delta, Southern Vietnam",
  coordinates: "10.0452 N, 105.7469 E",
  score: 8.5,
  riskLevel: "High",
  summary:
    "Built-up density near Hau River flood corridors is rising while vegetation buffers remain thin, increasing the exposure of roads, homes, and public services during seasonal peaks.",
  layers: [
    { key: "water", label: "Water / Flood extent", value: 28, color: "#3B82F6" },
    { key: "green", label: "Vegetation / Wetlands", value: 19, color: "#22C55E" },
    { key: "built", label: "Built-up surfaces", value: 41, color: "#94A3B8" },
    { key: "exposure", label: "High-risk exposure zones", value: 12, color: "#FACC15" }
  ],
  reasons: [
    { title: "2.1km from Hau River main channel", level: "High" },
    { title: "Dense development within 500m of waterway", level: "High" },
    { title: "Vegetation buffer below 20% threshold", level: "Medium" },
    { title: "Elevated impervious surface runoff coefficient", level: "High" },
    { title: "Land subsidence detected: -2.3cm/yr", level: "High" }
  ],
  assets: [
    { label: "Can Tho General Hospital", level: "Critical" },
    { label: "3 schools within risk zone", level: "High" },
    { label: "QL1A Highway segment (2.4km)", level: "High" },
    { label: "Farmland exposure (410 ha)", level: "Medium" },
    { label: "~14,200 residents at risk", level: "Critical" }
  ],
  recommendations: [
    {
      title: "Restore wetland buffer",
      body: "Prioritize wetland restoration in the northwest corridor to absorb peak flow and reduce runoff into built-up wards."
    },
    {
      title: "Upgrade drainage chokepoints",
      body: "Inspect and clear drainage around exposed road segments before the next heavy-rain cycle."
    },
    {
      title: "Prepare local evacuation plans",
      body: "Coordinate with schools, hospitals, and ward officials on route planning and public messaging."
    }
  ]
};
