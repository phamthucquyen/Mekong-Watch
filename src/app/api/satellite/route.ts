import { NextResponse } from "next/server";

type GoogleGeocodeResponse = {
  results?: Array<{
    types?: string[];
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
      location_type?: string;
    };
  }>;
  status?: string;
  error_message?: string;
};

function pickZoom(location: string, resultTypes: string[], locationType?: string) {
  const normalizedLocation = location.toLowerCase();
  const isStreetAddress =
    /\d/.test(normalizedLocation) ||
    resultTypes.includes("street_address") ||
    resultTypes.includes("premise") ||
    resultTypes.includes("subpremise") ||
    locationType === "ROOFTOP" ||
    locationType === "RANGE_INTERPOLATED";

  if (isStreetAddress) return 17;
  if (resultTypes.includes("route") || resultTypes.includes("neighborhood")) return 17;
  if (resultTypes.includes("sublocality") || resultTypes.includes("administrative_area_level_2")) return 15;
  return 14;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location")?.trim() ?? "";

  if (location.length < 2) {
    return NextResponse.json(
      { error: "Location must be at least 2 characters." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is missing." },
      { status: 500 }
    );
  }

  const geocodeEndpoint =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}` +
    `&components=country:VN&language=vi&key=${apiKey}`;

  const geocodeResponse = await fetch(geocodeEndpoint, {
    headers: { Accept: "application/json" },
    cache: "no-store"
  });

  if (!geocodeResponse.ok) {
    return NextResponse.json(
      { error: "Google Geocoding request failed." },
      { status: geocodeResponse.status }
    );
  }

  const geocodePayload = (await geocodeResponse.json()) as GoogleGeocodeResponse;

  if (geocodePayload.status && geocodePayload.status !== "OK") {
    return NextResponse.json(
      { error: geocodePayload.error_message ?? `Google Geocoding returned ${geocodePayload.status}.` },
      { status: geocodePayload.status === "ZERO_RESULTS" ? 404 : 502 }
    );
  }

  const result = geocodePayload.results?.[0];
  const lat = result?.geometry?.location?.lat;
  const lng = result?.geometry?.location?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "No usable coordinates were returned for this location." },
      { status: 404 }
    );
  }

  const zoom = pickZoom(location, result?.types ?? [], result?.geometry?.location_type);

  const staticMapUrl =
  "https://maps.googleapis.com/maps/api/staticmap?" +
  new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: String(zoom),
    size: "640x640",
    scale: "2",
    format: "png",
    maptype: "satellite",
    key: apiKey
  }).toString();

  const imageResponse = await fetch(staticMapUrl, { cache: "no-store" });

  if (!imageResponse.ok) {
    return NextResponse.json(
      { error: "Google Static Maps request failed." },
      { status: imageResponse.status }
    );
  }

  const imageArrayBuffer = await imageResponse.arrayBuffer();

  return new Response(imageArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store"
    }
  });
}