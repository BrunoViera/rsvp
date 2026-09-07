import type { EventRow } from "@/lib/types";
import { resolveEventPoint } from "@/lib/geocode";
import {
  buildGoogleCalendarUrl,
  buildIcsDataUri,
  buildDirectionsUrl,
} from "@/lib/calendar";
import MapEmbed from "./map-embed";

function formatFecha(iso: string | null) {
  if (!iso) return "Fecha a confirmar";
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

/** Toda la información del evento tal como la ve un invitado: portada, datos,
 *  mapa, cómo llegar y los botones de calendario.
 *
 *  Está aparte de RsvpCard porque lo usan las dos entradas: el link personal
 *  y la lista pública, donde antes solo se veía el buscador de nombres. */
export default async function EventDetails({
  event,
  titulo = "Estás invitado/a a",
}: {
  event: EventRow;
  titulo?: string;
}) {
  const point = await resolveEventPoint(event);

  return (
    <div className="flex flex-col gap-6">
      {event.cover_photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.cover_photo_url}
          alt={event.name}
          className="h-48 w-full rounded-card object-cover"
        />
      )}

      <div>
        <p className="text-sm text-ink/50">{titulo}</p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {event.name}
        </h1>
      </div>

      <div className="card flex flex-col gap-2 text-sm">
        <div>
          <span className="font-medium text-ink/60">Cuándo: </span>
          {formatFecha(event.event_date)} ({event.duration_hours} hs)
        </div>
        {event.location && (
          <div>
            <span className="font-medium text-ink/60">Dónde: </span>
            {event.location}
          </div>
        )}
        {event.gift_info && (
          <div>
            <span className="font-medium text-ink/60">Regalo: </span>
            {event.gift_info}
          </div>
        )}
      </div>

      {event.location && (
        <div className="flex flex-col gap-3">
          {point && <MapEmbed point={point} />}
          <a
            href={buildDirectionsUrl(
              event.location ?? "",
              point ? { lat: point.lat, lng: point.lon } : null
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center"
          >
            Cómo llegar
          </a>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={buildGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 text-center"
        >
          + Google Calendar
        </a>
        <a
          href={buildIcsDataUri(event)}
          download="evento.ics"
          className="btn-secondary flex-1 text-center"
        >
          + Descargar .ics
        </a>
      </div>
    </div>
  );
}
