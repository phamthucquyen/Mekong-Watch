export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type OverlayLayer = {
  key: "water" | "green" | "built" | "exposure";
  label: string;
  value: number;
  color: string;
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
  location: string;
  region: string;
  coordinates: string;
  score: number;
  riskLevel: RiskLevel;
  summary: string;
  layers: OverlayLayer[];
  reasons: Insight[];
  assets: Asset[];
  recommendations: Recommendation[];
};
