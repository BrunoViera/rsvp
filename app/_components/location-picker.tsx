"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: -34.9011, lng: -56.1645 }; // Montevideo
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

interface LocationPickerProps {
  fieldName: string;
  latFieldName: string;
  lngFieldName: string;
  defaultAddress?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
}

function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelected,
}: {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "name", "geometry"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const address = place.formatted_address || place.name || "";
      if (lat != null && lng != null) {
        onPlaceSelected({ address, lat, lng });
      }
    });

    return () => listener.remove();
  }, [placesLib, onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Salón Los Aromos, Av. Siempre Viva 742"
      className="field"
      autoComplete="off"
    />
  );
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: { lat: number; lng: number };
  onDragEnd: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) map.panTo(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.lat, position.lng]);

  return (
    <AdvancedMarker
      position={position}
      draggable
      onDragEnd={(e) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat != null && lng != null) onDragEnd({ lat, lng });
      }}
    />
  );
}

export default function LocationPicker({
  fieldName,
  latFieldName,
  lngFieldName,
  defaultAddress,
  defaultLat,
  defaultLng,
}: LocationPickerProps) {
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(
    defaultLat != null && defaultLng != null
      ? { lat: defaultLat, lng: defaultLng }
      : null
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
        Falta configurar NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places", "marker"]}>
      <div className="flex flex-col gap-3">
        <AddressAutocomplete
          value={address}
          onChange={setAddress}
          onPlaceSelected={({ address, lat, lng }) => {
            setAddress(address);
            setPoint({ lat, lng });
          }}
        />

        <div className="h-56 w-full overflow-hidden rounded-card border border-line">
          <Map
            mapId={MAP_ID}
            defaultCenter={point ?? DEFAULT_CENTER}
            defaultZoom={point ? 16 : 12}
            gestureHandling="greedy"
            disableDefaultUI={false}
            fullscreenControl={false}
            streetViewControl={false}
          >
            {point && (
              <DraggableMarker position={point} onDragEnd={setPoint} />
            )}
          </Map>
        </div>

        {point && (
          <p className="text-xs text-ink/50">
            Arrastrá el pin si necesitás ajustar la ubicación exacta.
          </p>
        )}
      </div>

      <input type="hidden" name={fieldName} value={address} readOnly />
      <input
        type="hidden"
        name={latFieldName}
        value={point?.lat ?? ""}
        readOnly
      />
      <input
        type="hidden"
        name={lngFieldName}
        value={point?.lng ?? ""}
        readOnly
      />
    </APIProvider>
  );
}
