import { GoogleGenAI } from "@google/genai";
import type { AnalysisResponse, Insight, Recommendation } from "@/lib/types";

type GeminiNarrative = Pick<AnalysisResponse, "summary" | "reasons" | "recommendations">;

const narrativeSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string"
    },
    reasons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          level: { type: "string", enum: ["Medium", "High", "Critical"] }
        },
        required: ["title", "level"],
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
  required: ["summary", "reasons", "recommendations"],
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
        (item.level === "Medium" || item.level === "High" || item.level === "Critical")
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

function parseNarrative(rawText: string): GeminiNarrative {
  const parsed: unknown = JSON.parse(rawText);

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("summary" in parsed) ||
    typeof parsed.summary !== "string" ||
    !("reasons" in parsed) ||
    !isInsightArray(parsed.reasons) ||
    !("recommendations" in parsed) ||
    !isRecommendationArray(parsed.recommendations)
  ) {
    throw new Error("Gemini response did not match the expected narrative shape.");
  }

  return {
    summary: parsed.summary,
    reasons: parsed.reasons,
    recommendations: parsed.recommendations
  };
}

export async function generateGeminiNarrative(
  analysis: AnalysisResponse,
  requestedLocation: string
): Promise<GeminiNarrative | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    contents: `
You are writing flood-awareness analysis for a hackathon demo focused on Vietnam.

Use the provided indicators as the source of truth. Do not invent new scores, percentages, locations, or asset counts.
Write for local authorities in plain language.
Keep the tone practical and credible, not alarmist.

Return JSON only with:
- summary: 2 concise sentences
- reasons: 4 to 5 short bullets with the same level labels already implied by the indicators
- recommendations: 3 short action cards with title and body

Requested location: ${requestedLocation}

Structured indicators:
${JSON.stringify(
  {
    location: analysis.location,
    region: analysis.region,
    coordinates: analysis.coordinates,
    score: analysis.score,
    riskLevel: analysis.riskLevel,
    layers: analysis.layers,
    assets: analysis.assets,
    existingReasons: analysis.reasons,
    existingRecommendations: analysis.recommendations
  },
  null,
  2
)}
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: narrativeSchema
    }
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseNarrative(response.text);
}
