"use client";

import { useEffect, useRef, useState } from "react";

type LiveSatelliteMapProps = {
  address: string;
  zoom: number;
  className?: string;
  onStatusChange?: (status: "loading" | "ready" | "error") => void;
};

type GeocodeLocation = {
  lat: () => number;
  lng: () => number;
};

type GeocodeResult = {
  geometry?: {
    location?: GeocodeLocation;
  };
};

type GoogleMapsApi = {
  maps?: {
    Map: new (
      element: HTMLElement,
      options: {
        center: { lat: number; lng: number };
        zoom: number;
        mapTypeId: string;
        disableDefaultUI: boolean;
        gestureHandling: string;
        clickableIcons: boolean;
        keyboardShortcuts: boolean;
      }
    ) => {
      setCenter: (location: GeocodeLocation) => void;
      setZoom: (zoom: number) => void;
    };
    Geocoder: new () => {
      geocode: (
        request: { address: string },
        callback: (results: GeocodeResult[] | null, geocodeStatus: string) => void
      ) => void;
    };
  };
};

type GoogleMapsWindow = Window & typeof globalThis & {
  google?: GoogleMapsApi;
  __mekongWatchGoogleMapsPromise?: Promise<void>;
};

function loadGoogleMapsScript(apiKey: string) {
  const mapsWindow = window as GoogleMapsWindow;

  if (mapsWindow.google?.maps) {
    return Promise.resolve();
  }

  if (mapsWindow.__mekongWatchGoogleMapsPromise) {
    return mapsWindow.__mekongWatchGoogleMapsPromise;
  }

  mapsWindow.__mekongWatchGoogleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      "script[data-google-maps-loader='true']"
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google Maps failed to load.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load."));
    document.head.appendChild(script);
  });

  return mapsWindow.__mekongWatchGoogleMapsPromise;
}

export function LiveSatelliteMap({
  address,
  zoom,
  className = "",
  onStatusChange
}: LiveSatelliteMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapRef.current) {
        return;
      }

      if (!apiKey) {
        setStatus("error");
        return;
      }

      try {
        setStatus("loading");
        await loadGoogleMapsScript(apiKey);

        if (cancelled || !mapRef.current) {
          return;
        }

        const mapsWindow = window as GoogleMapsWindow;
        const googleMaps = mapsWindow.google;

        if (!googleMaps?.maps) {
          throw new Error("Google Maps failed to initialize.");
        }

        const map = new googleMaps.maps.Map(mapRef.current, {
          center: { lat: 10.0452, lng: 105.7469 },
          zoom,
          mapTypeId: "satellite",
          disableDefaultUI: true,
          gestureHandling: "none",
          clickableIcons: false,
          keyboardShortcuts: false
        });

        const geocoder = new googleMaps.maps.Geocoder();
        geocoder.geocode({ address }, (results, geocodeStatus) => {
          if (cancelled) {
            return;
          }

          const point = results?.[0]?.geometry?.location;
          if (geocodeStatus !== "OK" || !point) {
            setStatus("error");
            return;
          }

          map.setCenter(point);
          map.setZoom(zoom);
          setStatus("ready");
        });
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    initializeMap();

    return () => {
      cancelled = true;
    };
  }, [address, apiKey, zoom]);

  return (
    <div className={`relative h-full w-full ${className}`.trim()}>
      <div ref={mapRef} className="h-full w-full" />

      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(7,17,28,0.55)] text-xs uppercase tracking-[0.24em] text-[var(--text2)]">
          {status === "error" ? "Map unavailable" : "Loading satellite"}
        </div>
      ) : null}
    </div>
  );
}
