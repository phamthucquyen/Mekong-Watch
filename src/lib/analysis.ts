import { geocodeVietnamLocation, getStaticSatelliteImage, pickZoom } from "@/lib/google-maps";
import { generateGeminiAnalysis } from "@/lib/gemini";
import {
  getBinhMinhDemoAnalysis,
  isNearBinhMinhDemoLocation,
  matchesBinhMinhDemoLocation
} from "@/lib/manual-demo-analysis";
import { mockAnalysis } from "@/lib/mock-data";
import type { AnalysisResponse } from "@/lib/types";

export type AnalysisResult = AnalysisResponse & {
  requestedLocation: string;
  source: "manual" | "gemini" | "mock";
  notes: string[];
  satelliteImageUrl: string;
};

function formatCoordinates(lat: number, lng: number) {
  const latSuffix = lat >= 0 ? "N" : "S";
  const lngSuffix = lng >= 0 ? "E" : "W";

  return `${Math.abs(lat).toFixed(4)} ${latSuffix}, ${Math.abs(lng).toFixed(4)} ${lngSuffix}`;
}

export async function analyzeLocation(requestedLocation: string): Promise<AnalysisResult> {
  const geocoded = await geocodeVietnamLocation(requestedLocation);
  const zoom = pickZoom(requestedLocation, geocoded.resultTypes, geocoded.locationType);
  const satellite = await getStaticSatelliteImage(geocoded, zoom);

  if (
    matchesBinhMinhDemoLocation(requestedLocation, geocoded.formattedAddress, geocoded.displayName) ||
    isNearBinhMinhDemoLocation(geocoded.lat, geocoded.lng)
  ) {
    return {
      ...mockAnalysis,
      ...getBinhMinhDemoAnalysis(),
      analysisScope: "visual",
      scoreContext: "Manual shoreline exposure preset for the Binh Minh demo scene",
      location: geocoded.displayName,
      region: geocoded.region || mockAnalysis.region,
      coordinates: formatCoordinates(geocoded.lat, geocoded.lng),
      requestedLocation,
      source: "manual",
      satelliteImageUrl: satellite.imageUrl,
      notes: [
        "This right-pane overlay is manually tuned from your own annotation for the Binh Minh, Cua Lo, Nghe An demo scene.",
        "This preset now triggers for common Binh Minh and Cua Lo query variants so the demo reliably uses the manual overlay."
      ]
    };
  }

  try {
    const geminiAnalysis = await generateGeminiAnalysis(geocoded.formattedAddress, satellite.imageBase64);

    if (geminiAnalysis) {
      return {
        ...mockAnalysis,
        ...geminiAnalysis,
        analysisScope: "visual",
        scoreContext: "Visual exposure indicator from the current satellite image",
        location: geocoded.displayName,
        region: geocoded.region || mockAnalysis.region,
        coordinates: formatCoordinates(geocoded.lat, geocoded.lng),
        requestedLocation,
        source: "gemini",
        satelliteImageUrl: satellite.imageUrl,
        notes: [
          "Gemini interpreted a real satellite snapshot for the current scene.",
          "The right pane is a visual interpretation, not a fully trained site-specific detector."
        ]
      };
    }
  } catch (error) {
    console.error("Gemini image analysis failed:", error);
  }

  return {
    ...mockAnalysis,
    analysisScope: "visual",
    scoreContext: "Visual exposure indicator from the current satellite image",
    location: geocoded.displayName,
    region: geocoded.region || mockAnalysis.region,
    coordinates: formatCoordinates(geocoded.lat, geocoded.lng),
    requestedLocation,
    source: "mock",
    satelliteImageUrl: satellite.imageUrl,
    notes: [
      "Gemini is not configured, so the route returned the local visual fallback response.",
      "Add GEMINI_API_KEY to enable image-driven interpretation outside the manual demo preset."
    ]
  };
}
