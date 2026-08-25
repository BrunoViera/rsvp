import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow, CollaboratorRow } from "@/lib/types";
import GuestList from "./guest-list";
import RsvpStats from "./rsvp-stats";
import CopyLinkButton from "./copy-link-button";
import Collaborators from "./collaborators";
import MapEmbed from "@/app/_components/map-embed";
import { resolveEventPoint } from "@/lib/geocode";

function formatFecha(iso: string | null) {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  });
}

export default async function EventoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single<EventRow>();

  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: true })
    .returns<GuestRow[]>();

  const { data: collaborators } = await supabase
    .from("event_collaborators")
    .select("*")
    .eq("event_id", id)
    .order("created_at", { ascending: true })
    .returns<CollaboratorRow[]>();

  if (!event) notFound();

  const point = await resolveEventPoint(event);

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
      >
        ← Volver al dashboard
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {event.name}
        </h1>
        <Link href={`/dashboard/eventos/${event.id}/editar`} className="btn-secondary">
          Editar evento
        </Link>
      </div>

      {event.cover_photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.cover_photo_url}
          alt={event.name}
          className="mt-6 h-56 w-full rounded-card object-cover"
        />
      )}

      <div className="card mt-6 flex flex-col divide-y divide-line text-sm">
        <dl className="grid gap-4 pb-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Fecha y hora
            </dt>
            <dd className="mt-1 text-ink">{formatFecha(event.event_date)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Duración
            </dt>
            <dd className="mt-1 text-ink">{event.duration_hours} hs</dd>
          </div>
          {event.gift_info && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-ink/40">
                Regalo
              </dt>
              <dd className="mt-1 text-ink">{event.gift_info}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-col gap-3 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
            Links para compartir
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton path={`/e/${event.slug}`} label="Copiar link de la lista" />
            <CopyLinkButton
              path={`/e/${event.slug}/confirmados`}
              label="Copiar link de confirmados"
            />
          </div>
        </div>

        {event.location && (
          <div className="flex flex-col gap-3 pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              Ubicación
            </p>
            <p className="text-ink">{event.location}</p>
            {point && <MapEmbed point={point} />}
          </div>
        )}
      </div>

      <RsvpStats guests={guests ?? []} />

      <GuestList eventId={event.id} guests={guests ?? []} />

      <Collaborators eventId={event.id} collaborators={collaborators ?? []} />
    </div>
  );
}
