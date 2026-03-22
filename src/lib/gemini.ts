import { GoogleGenAI } from "@google/genai";
import type {
  AnalysisResponse,
  Asset,
  Insight,
  OverlayLayer,
  OverlayRegion,
  Recommendation,
  RiskLevel
} from "@/lib/types";

type GeminiAnalysis = Pick<
  AnalysisResponse,
  "score" | "riskLevel" | "summary" | "layers" | "overlayRegions" | "reasons" | "assets" | "recommendations"
>;

const layerKeys = ["water", "green", "built", "exposure"] as const;
const riskLevels = ["Low", "Medium", "High", "Critical"] as const;
const elevatedRiskLevels = ["Medium", "High", "Critical"] as const;

const analysisSchema = {
  type: "object",
  properties: {
    score: {
      type: "number"
    },
    riskLevel: {
      type: "string",
      enum: riskLevels
    },
    summary: {
      type: "string"
    },
    layers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string", enum: layerKeys },
          label: { type: "string" },
          value: { type: "number" },
          color: { type: "string" }
        },
        required: ["key", "label", "value", "color"],
        additionalProperties: false
      }
    },
    overlayRegions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string", enum: layerKeys },
          label: { type: "string" },
          color: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          height: { type: "number" },
          confidence: { type: "number" }
        },
        required: ["key", "label", "color", "x", "y", "width", "height", "confidence"],
        additionalProperties: false
      }
    },
    reasons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          level: { type: "string", enum: elevatedRiskLevels }
        },
        required: ["title", "level"],
        additionalProperties: false
      }
    },
    assets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          level: { type: "string", enum: riskLevels }
        },
        required: ["label", "level"],
        additionalProperties: false
      }
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          body: { type: "string" }
        },
        required: ["title", "body"],
        additionalProperties: false
      }
    }
  },
  required: ["score", "riskLevel", "summary", "layers", "overlayRegions", "reasons", "assets", "recommendations"],
  additionalProperties: false
};

function isInsightArray(value: unknown): value is Insight[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "title" in item &&
        typeof item.title === "string" &&
        "level" in item &&
        elevatedRiskLevels.includes(item.level as (typeof elevatedRiskLevels)[number])
    )
  );
}

function isLayerArray(value: unknown): value is OverlayLayer[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "key" in item &&
        layerKeys.includes(item.key as (typeof layerKeys)[number]) &&
        "label" in item &&
        typeof item.label === "string" &&
        "value" in item &&
        typeof item.value === "number" &&
        "color" in item &&
        typeof item.color === "string"
    )
  );
}

function isOverlayRegionArray(value: unknown): value is OverlayRegion[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "key" in item &&
        layerKeys.includes(item.key as (typeof layerKeys)[number]) &&
        "label" in item &&
        typeof item.label === "string" &&
        "color" in item &&
        typeof item.color === "string" &&
        "x" in item &&
        typeof item.x === "number" &&
        "y" in item &&
        typeof item.y === "number" &&
        "width" in item &&
        typeof item.width === "number" &&
        "height" in item &&
        typeof item.height === "number" &&
        "confidence" in item &&
        typeof item.confidence === "number"
    )
  );
}

function isRecommendationArray(value: unknown): value is Recommendation[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "title" in item &&
        typeof item.title === "string" &&
        "body" in item &&
        typeof item.body === "string"
    )
  );
}

function isAssetArray(value: unknown): value is Asset[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        "label" in item &&
        typeof item.label === "string" &&
        "level" in item &&
        riskLevels.includes(item.level as RiskLevel)
    )
  );
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function normalizeRegion(region: OverlayRegion): OverlayRegion {
  return {
    ...region,
    x: clamp01(region.x),
    y: clamp01(region.y),
    width: clamp01(region.width),
    height: clamp01(region.height),
    confidence: clamp01(region.confidence)
  };
}

function normalizeLayerValues(layers: OverlayLayer[]) {
  const sanitized = layers.map((layer) => ({
    ...layer,
    value: Math.min(100, Math.max(0, Math.round(layer.value)))
  }));
  const total = sanitized.reduce((sum, layer) => sum + layer.value, 0);

  if (total <= 0) {
    return sanitized;
  }

  let runningTotal = 0;
  const normalized = sanitized.map((layer, index) => {
    const nextValue =
      index === sanitized.length - 1
        ? Math.max(0, 100 - runningTotal)
        : Math.round((layer.value / total) * 100);
    runningTotal += nextValue;
    return { ...layer, value: nextValue };
  });

  return normalized;
}

function intersectionOverUnion(first: OverlayRegion, second: OverlayRegion) {
  const left = Math.max(first.x, second.x);
  const top = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);

  if (right <= left || bottom <= top) {
    return 0;
  }

  const intersection = (right - left) * (bottom - top);
  const firstArea = first.width * first.height;
  const secondArea = second.width * second.height;
  const union = firstArea + secondArea - intersection;

  return union <= 0 ? 0 : intersection / union;
}

function normalizeOverlayRegions(overlayRegions: OverlayRegion[]) {
  const sizedRegions = overlayRegions
    .map(normalizeRegion)
    .filter((region) => region.width >= 0.1 && region.height >= 0.1)
    .sort((first, second) => second.confidence - first.confidence);

  const selected: OverlayRegion[] = [];

  for (const region of sizedRegions) {
    const hasConflict = selected.some((existingRegion) => intersectionOverUnion(existingRegion, region) > 0.45);
    if (!hasConflict) {
      selected.push(region);
    }

    if (selected.length === 5) {
      break;
    }
  }

  return selected;
}

function parseAnalysis(rawText: string): GeminiAnalysis {
  const parsed: unknown = JSON.parse(rawText);

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("score" in parsed) ||
    typeof parsed.score !== "number" ||
    !("riskLevel" in parsed) ||
    !riskLevels.includes(parsed.riskLevel as RiskLevel) ||
    !("summary" in parsed) ||
    typeof parsed.summary !== "string" ||
    !("layers" in parsed) ||
    !isLayerArray(parsed.layers) ||
    !("overlayRegions" in parsed) ||
    !isOverlayRegionArray(parsed.overlayRegions) ||
    !("reasons" in parsed) ||
    !isInsightArray(parsed.reasons) ||
    !("assets" in parsed) ||
    !isAssetArray(parsed.assets) ||
    !("recommendations" in parsed) ||
    !isRecommendationArray(parsed.recommendations)
  ) {
    throw new Error("Gemini response did not match the expected analysis shape.");
  }

  return {
    score: Math.min(10, Math.max(0, Number(parsed.score.toFixed(1)))),
    riskLevel: parsed.riskLevel as RiskLevel,
    summary: parsed.summary,
    layers: normalizeLayerValues(parsed.layers),
    overlayRegions: normalizeOverlayRegions(parsed.overlayRegions),
    reasons: parsed.reasons.slice(0, 4),
    assets: parsed.assets.slice(0, 4),
    recommendations: parsed.recommendations.slice(0, 3)
  };
}

export async function generateGeminiAnalysis(
  requestedLocation: string,
  imageBase64: string
): Promise<GeminiAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are analyzing a satellite image for a flood-awareness hackathon demo focused on Vietnam.

Return JSON only.

Study the image and estimate only what is visually defensible:
- score: a visual exposure indicator from 0 to 10 based only on visible shoreline adjacency, built-up density, and lack of green buffer
- riskLevel: one of Low, Medium, High, Critical, but treat it as a visual exposure tier, not a full flood prediction
- summary: 2 concise sentences for local authorities that clearly describe visible land patterns
- layers: exactly 4 items for water, green, built, exposure with percent coverage estimates that sum roughly to 100
- overlayRegions: 3 to 5 large, non-duplicate normalized bounding boxes (x, y, width, height from 0 to 1) that follow the most obvious visible zones
- reasons: 3 to 4 short evidence bullets based only on visible image features
- assets: 3 to 4 short visual cues, not named facilities or population claims
- recommendations: 3 cautious next checks, not firm policy advice

Important:
- Requested location: ${requestedLocation}
- Use practical, non-alarmist language.
- Only describe what can be seen directly in the image.
- Do not infer hospitals, schools, road lengths, resident counts, flood depth, drainage condition, land subsidence, or historical flood damage unless directly visible.
- Keep labels short and generic.
- Prefer shoreline, waterfront edge, built-up blocks, vegetation pocket, or exposed edge over speculative labels.
- Avoid many tiny boxes and avoid heavily overlapping regions.
- Use these exact colors by layer:
  water -> #3B82F6
  green -> #22C55E
  built -> #94A3B8
  exposure -> #FACC15`
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: imageBase64
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: analysisSchema
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseAnalysis(response.text);
}
