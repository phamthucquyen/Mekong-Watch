type GoogleGeocodeResponse = {
  results?: Array<{
    formatted_address?: string;
    types?: string[];
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
      location_type?: string;
    };
    address_components?: Array<{
      long_name?: string;
      types?: string[];
    }>;
  }>;
  status?: string;
  error_message?: string;
};

type AddressComponent = {
  long_name?: string;
  types?: string[];
};

export type GeocodedLocation = {
  query: string;
  formattedAddress: string;
  displayName: string;
  region: string;
  lat: number;
  lng: number;
  locationType?: string;
  resultTypes: string[];
};

function getGoogleMapsApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing.");
  }

  return apiKey;
}

function getAddressPart(
  components: AddressComponent[],
  type: string
) {
  return components?.find((component) => component.types?.includes(type))?.long_name;
}

export function pickZoom(location: string, resultTypes: string[], locationType?: string) {
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

export async function geocodeVietnamLocation(query: string): Promise<GeocodedLocation> {
  const apiKey = getGoogleMapsApiKey();
  const geocodeEndpoint =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}` +
    `&components=country:VN&language=vi&key=${apiKey}`;

  const response = await fetch(geocodeEndpoint, {
    headers: { Accept: "application/json" },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Google Geocoding request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as GoogleGeocodeResponse;
  if (payload.status && payload.status !== "OK") {
    throw new Error(payload.error_message ?? `Google Geocoding returned ${payload.status}.`);
  }

  const result = payload.results?.[0];
  const lat = result?.geometry?.location?.lat;
  const lng = result?.geometry?.location?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("No usable coordinates were returned for this location.");
  }

  const components = result?.address_components ?? [];
  const administrativeArea =
    getAddressPart(components, "administrative_area_level_1") ??
    getAddressPart(components, "administrative_area_level_2");
  const country = getAddressPart(components, "country");

  return {
    query,
    formattedAddress: result?.formatted_address ?? query,
    displayName: result?.formatted_address?.split(",")[0]?.trim() ?? query,
    region: [administrativeArea, country].filter(Boolean).join(", "),
    lat,
    lng,
    locationType: result?.geometry?.location_type,
    resultTypes: result?.types ?? []
  };
}

export async function getStaticSatelliteImage(
  location: GeocodedLocation,
  zoom: number
): Promise<{ imageBase64: string; imageUrl: string }> {
  const apiKey = getGoogleMapsApiKey();

  const imageUrl =
    "https://maps.googleapis.com/maps/api/staticmap?" +
    new URLSearchParams({
      center: `${location.lat},${location.lng}`,
      zoom: String(zoom),
      size: "640x640",
      scale: "2",
      format: "png",
      maptype: "satellite",
      key: apiKey
    }).toString();

  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Google Static Maps request failed with ${response.status}.`);
  }

  const imageArrayBuffer = await response.arrayBuffer();
  const imageBase64 = Buffer.from(imageArrayBuffer).toString("base64");

  return { imageBase64, imageUrl };
}
