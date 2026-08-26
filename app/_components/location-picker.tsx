"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  // El callback cambia en cada render del padre. Si el efecto dependiera de él,
  // el autocomplete se destruiría y recrearía continuamente y la selección se
  // podía perder. Se guarda en un ref y el efecto solo depende de Places.
  const onSelectRef = useRef(onPlaceSelected);
  useEffect(() => {
    onSelectRef.current = onPlaceSelected;
  }, [onPlaceSelected]);

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
        onSelectRef.current({ address, lat, lng });
      }
    });

    return () => listener.remove();
  }, [placesLib]);

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

/** Centra el mapa en el punto elegido.
 *  Va en un componente aparte y no en <Map defaultCenter>: defaultCenter solo
 *  aplica al montar, así que al elegir la primera dirección el mapa se quedaba
 *  donde estaba y había que repetir la búsqueda para que se moviera.
 *  Depende de `map` para reintentar si la instancia todavía no estaba lista. */
function MapCamera({
  point,
}: {
  point: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !point) return;
    map.panTo(point);
    // Al pasar de "sin ubicación" a una elegida, se acerca para que se vea la
    // dirección concreta y no la ciudad entera.
    if ((map.getZoom() ?? 0) < 15) map.setZoom(16);
  }, [map, point?.lat, point?.lng]);

  return null;
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: { lat: number; lng: number };
  onDragEnd: (pos: { lat: number; lng: number }) => void;
}) {
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

  const handlePlaceSelected = useCallback(
    ({ address, lat, lng }: { address: string; lat: number; lng: number }) => {
      setAddress(address);
      setPoint({ lat, lng });
    },
    []
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
          onPlaceSelected={handlePlaceSelected}
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
            <MapCamera point={point} />
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
