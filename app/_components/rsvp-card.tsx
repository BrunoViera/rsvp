import type { EventRow, GuestRow } from "@/lib/types";
import { geocodeAddress } from "@/lib/geocode";
import { buildGoogleCalendarUrl, buildIcsDataUri, buildDirectionsUrl } from "@/lib/calendar";
import { isRsvpOpen } from "@/lib/event-timing";
import MapEmbed from "./map-embed";

function formatFecha(iso: string | null) {
  if (!iso) return "Fecha a confirmar";
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

const STATUS_TEXT: Record<GuestRow["rsvp_status"], string> = {
  pending: "Todavía no respondiste",
  confirmed: "Confirmaste tu asistencia",
  declined: "Avisaste que no podés ir",
};

export default async function RsvpCard({
  event,
  guest,
  action,
}: {
  event: EventRow;
  guest: GuestRow;
  action: (formData: FormData) => void;
}) {
  const point = event.location ? await geocodeAddress(event.location) : null;
  const googleCalendarUrl = buildGoogleCalendarUrl(event);
  const icsDataUri = buildIcsDataUri(event);
  const rsvpOpen = isRsvpOpen(event);
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      {event.cover_photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.cover_photo_url}
          alt={event.name}
          className="h-48 w-full rounded-card object-cover"
        />
      )}

      <div>
        <p className="text-sm text-ink/50">Estás invitado/a a</p>
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

      {point && (
        <div className="flex flex-col gap-3">
          <MapEmbed point={point} />
          <a
            href={buildDirectionsUrl(event.location ?? "")}
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
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 text-center"
        >
          + Google Calendar
        </a>
        <a href={icsDataUri} download="evento.ics" className="btn-secondary flex-1 text-center">
          + Descargar .ics
        </a>
      </div>

      <div className="card">
        <p className="text-sm text-ink/60">Hola,</p>
        <h2 className="font-display text-xl font-semibold text-ink">
          {guest.name}
        </h2>

        {guest.rsvp_status !== "pending" && (
          <p className="mt-2 text-sm text-sage">
            {STATUS_TEXT[guest.rsvp_status]}
            {rsvpOpen ? ". Podés cambiar tu respuesta abajo si es necesario." : "."}
          </p>
        )}

        {rsvpOpen ? (
          <form action={action} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={guest.phone ?? ""}
                className="field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">
                Un mensaje para el cumpleañero/a (opcional)
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={guest.description ?? ""}
                className="field"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                name="status"
                value="confirmed"
                className="btn-primary flex-1"
              >
                Sí, voy 🎉
              </button>
              <button
                type="submit"
                name="status"
                value="declined"
                className="btn-secondary flex-1"
              >
                No puedo ir
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink/60">
            Las confirmaciones para este evento ya cerraron.
            {guest.rsvp_status === "pending" &&
              " No llegaste a responder a tiempo."}
          </div>
        )}
      </div>
    </div>
  );
}
