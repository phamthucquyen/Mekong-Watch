import { NextResponse } from "next/server";

type GoogleAutocompleteResponse = {
  predictions?: Array<{
    description: string;
    place_id: string;
    structured_formatting?: {
      main_text?: string;
      secondary_text?: string;
    };
  }>;
  status?: string;
  error_message?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_MAPS_API_KEY is missing.", suggestions: [] },
      { status: 500 }
    );
  }

  const endpoint =
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}` +
    `&components=country:vn&types=geocode&language=vi&key=${apiKey}`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Google Places request failed.", suggestions: [] },
      { status: response.status }
    );
  }

  const payload = (await response.json()) as GoogleAutocompleteResponse;

  if (payload.status && payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
    return NextResponse.json(
      {
        error: payload.error_message ?? `Google Places returned ${payload.status}.`,
        suggestions: []
      },
      { status: 502 }
    );
  }

  const suggestions = (payload.predictions ?? []).map((prediction) => ({
    description: prediction.description,
    placeId: prediction.place_id,
    mainText: prediction.structured_formatting?.main_text,
    secondaryText: prediction.structured_formatting?.secondary_text
  }));

  return NextResponse.json({ suggestions });
}
