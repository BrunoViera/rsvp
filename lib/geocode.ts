export interface GeoPoint {
  lat: number;
  lon: number;
}

/**
 * Geocodifica una dirección de texto usando Nominatim (OpenStreetMap).
 * No requiere API key. Cachea el resultado por 1 hora para no golpear
 * el servicio en cada request (Nominatim pide uso razonable).
 */
export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      trimmed
    )}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "CumpleRSVP/1.0 (proyecto personal, sin fines comerciales)",
        "Accept-Language": "es",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return { lat, lon };
  } catch {
    return null;
  }
}

/**
 * Resuelve el punto a mostrar en el mapa de un evento.
 * Los eventos nuevos ya traen coordenadas exactas (elegidas con Google Places
 * al crear/editar). Para eventos viejos, sin lat/lng guardados, cae a Nominatim
 * para no perderles el mapa.
 */
export async function resolveEventPoint(event: {
  latitude: number | null;
  longitude: number | null;
  location: string | null;
}): Promise<GeoPoint | null> {
  if (event.latitude != null && event.longitude != null) {
    return { lat: event.latitude, lon: event.longitude };
  }
  return event.location ? geocodeAddress(event.location) : null;
}
