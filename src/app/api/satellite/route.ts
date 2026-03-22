import { NextResponse } from "next/server";
import { geocodeVietnamLocation, getStaticSatelliteImage, pickZoom } from "@/lib/google-maps";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location")?.trim() ?? "";

  if (location.length < 2) {
    return NextResponse.json(
      { error: "Location must be at least 2 characters." },
      { status: 400 }
    );
  }

  try {
    const geocoded = await geocodeVietnamLocation(location);
    const zoom = pickZoom(location, geocoded.resultTypes, geocoded.locationType);
    const { imageBase64 } = await getStaticSatelliteImage(geocoded, zoom);

    return new Response(Buffer.from(imageBase64, "base64"), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Satellite fetch failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}