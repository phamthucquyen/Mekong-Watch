export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type OverlayLayer = {
  key: "water" | "green" | "built" | "exposure";
  label: string;
  value: number;
  color: string;
};

export type OverlayPoint = {
  x: number;
  y: number;
};

export type OverlayRegion = {
  key: OverlayLayer["key"];
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  points?: OverlayPoint[];
  fillOpacity?: number;
  strokeOnly?: boolean;
};

export type Insight = {
  title: string;
  level: Exclude<RiskLevel, "Low"> | "Medium";
};

export type Asset = {
  label: string;
  level: RiskLevel;
};

export type Recommendation = {
  title: string;
  body: string;
};

export type AnalysisResponse = {
  analysisScope: "visual";
  scoreContext: string;
  location: string;
  region: string;
  coordinates: string;
  score: number;
  riskLevel: RiskLevel;
  summary: string;
  layers: OverlayLayer[];
  overlayRegions: OverlayRegion[];
  reasons: Insight[];
  assets: Asset[];
  recommendations: Recommendation[];
};
