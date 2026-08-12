import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import GuestList from "./guest-list";
import CopyLinkButton from "./copy-link-button";

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

  if (!event) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
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
      </div>

      <GuestList eventId={event.id} guests={guests ?? []} />
    </div>
  );
}
