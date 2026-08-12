import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import { submitRsvp } from "./actions";

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

export default async function RsvpPersonalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("*, event:events(*)")
    .eq("rsvp_token", token)
    .single<GuestRow & { event: EventRow }>();

  if (!guest || !guest.event) notFound();

  const event = guest.event;
  const submitWithToken = submitRsvp.bind(null, token);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-6 py-12">
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

      <div className="card">
        <p className="text-sm text-ink/60">Hola,</p>
        <h2 className="font-display text-xl font-semibold text-ink">
          {guest.name}
        </h2>

        {guest.rsvp_status !== "pending" && (
          <p className="mt-2 text-sm text-sage">
            {STATUS_TEXT[guest.rsvp_status]}. Podés cambiar tu respuesta abajo
            si es necesario.
          </p>
        )}

        <form action={submitWithToken} className="mt-4 flex flex-col gap-4">
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
      </div>
    </main>
  );
}
