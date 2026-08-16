import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow, CollaboratorRow } from "@/lib/types";
import GuestList from "./guest-list";
import RsvpStats from "./rsvp-stats";
import CopyLinkButton from "./copy-link-button";
import Collaborators from "./collaborators";

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

      <div className="card mt-6 flex flex-col gap-3 text-sm">
        <div>
          <span className="font-medium text-ink/60">Fecha y hora: </span>
          {formatFecha(event.event_date)}
        </div>
        <div>
          <span className="font-medium text-ink/60">Duración: </span>
          {event.duration_hours} hs
        </div>
        {event.location && (
          <div>
            <span className="font-medium text-ink/60">Lugar: </span>
            {event.location}
          </div>
        )}
        {event.gift_info && (
          <div>
            <span className="font-medium text-ink/60">Regalo: </span>
            {event.gift_info}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink/60">Lista compartida: </span>
          <CopyLinkButton path={`/e/${event.slug}`} label="Copiar link de la lista" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink/60">Confirmados: </span>
          <CopyLinkButton
            path={`/e/${event.slug}/confirmados`}
            label="Copiar link de confirmados"
          />
        </div>
      </div>

      <RsvpStats guests={guests ?? []} />

      <GuestList eventId={event.id} guests={guests ?? []} />

      <Collaborators eventId={event.id} collaborators={collaborators ?? []} />
    </div>
  );
}
