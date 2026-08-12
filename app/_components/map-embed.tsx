import type { GeoPoint } from "@/lib/geocode";

const DELTA = 0.006; // ~600m de margen alrededor del punto

export default function MapEmbed({ point }: { point: GeoPoint }) {
  const bbox = [
    point.lon - DELTA,
    point.lat - DELTA,
    point.lon + DELTA,
    point.lat + DELTA,
  ].join(",");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${point.lat},${point.lon}`;

  return (
    <iframe
      title="Ubicación del evento"
      src={src}
      className="h-56 w-full rounded-card border border-line"
      loading="lazy"
    />
  );
}
