"use client";

import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { GeoPoint } from "@/lib/geocode";

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

export default function MapEmbed({ point }: { point: GeoPoint }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const center = { lat: point.lat, lng: point.lon };

  return (
    <div className="h-56 w-full overflow-hidden rounded-card border border-line">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={MAP_ID}
          defaultCenter={center}
          defaultZoom={16}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
        >
          <AdvancedMarker position={center} />
        </Map>
      </APIProvider>
    </div>
  );
}
