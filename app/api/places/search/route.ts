import { NextRequest, NextResponse } from "next/server";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Proxy server-side hacia Nominatim (OpenStreetMap) para autocompletar lugares.
 * No requiere API key. Lo hacemos pasar por nuestro propio backend (en vez de
 * pegarle directo desde el browser) para poder cachear, controlar el
 * User-Agent que pide Nominatim, y no exponer la política de uso del
 * servicio al cliente.
 */
// ~0.4° de margen alrededor del usuario (unos 40-50km) para "enfocar" la
// búsqueda en su zona, sin descartar resultados de otros lados.
const BIAS_DELTA = 0.4;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    format: "json",
    addressdetails: "0",
    limit: "5",
    q,
  });

  const rawLat = req.nextUrl.searchParams.get("lat");
  const rawLon = req.nextUrl.searchParams.get("lon");
  const lat = rawLat ? parseFloat(rawLat) : NaN;
  const lon = rawLon ? parseFloat(rawLon) : NaN;

  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    // Redondeamos para no romper el cache por variaciones mínimas de GPS.
    const roundedLat = Math.round(lat * 100) / 100;
    const roundedLon = Math.round(lon * 100) / 100;

    // viewbox + bounded=0 => "preferir" resultados en esa zona sin excluir el resto.
    params.set(
      "viewbox",
      [
        roundedLon - BIAS_DELTA,
        roundedLat + BIAS_DELTA,
        roundedLon + BIAS_DELTA,
        roundedLat - BIAS_DELTA,
      ].join(",")
    );
    params.set("bounded", "0");
  }

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ElCumpleDe/1.0 (+https://elcumplede.com)",
        "Accept-Language": "es",
      },
      // Cachea la misma búsqueda por un rato para no golpear Nominatim de más
      // (piden uso razonable: máx ~1 req/seg).
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = (await res.json()) as NominatimResult[];

    const results = (Array.isArray(data) ? data : [])
      .map((item) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }))
      .filter((r) => !Number.isNaN(r.lat) && !Number.isNaN(r.lon));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
