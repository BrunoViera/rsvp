import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";

function formatFecha(iso: string | null) {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: ownEvents } = await supabase
    .from("events")
    .select("*")
    .eq("host_id", user.id)
    .returns<EventRow[]>();

  const { data: collaborations } = await supabase
    .from("event_collaborators")
    .select("event_id")
    .eq("user_id", user.id)
    .eq("status", "accepted");

  const collabEventIds = (collaborations ?? []).map((c) => c.event_id);

  let collabEvents: EventRow[] = [];
  if (collabEventIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("id", collabEventIds)
      .returns<EventRow[]>();
    collabEvents = data ?? [];
  }

  const eventsById = new Map<string, EventRow>();
  for (const e of [...(ownEvents ?? []), ...collabEvents]) {
    eventsById.set(e.id, e);
  }
  const events = Array.from(eventsById.values()).sort((a, b) => {
    const da = a.event_date ? new Date(a.event_date).getTime() : Infinity;
    const db = b.event_date ? new Date(b.event_date).getTime() : Infinity;
    return da - db;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Tus eventos
        </h1>
        <Link href="/dashboard/eventos/nuevo" className="btn-primary">
          + Crear evento
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-6 text-ink/60">
          Todavía no creaste ningún evento. ¡Arrancá con el primero!
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/eventos/${event.id}`}
              className="card transition hover:border-marigold"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {event.name}
                </h2>
                {event.host_id !== user.id && (
                  <span className="whitespace-nowrap rounded-full bg-ink/10 px-2 py-0.5 text-xs text-ink/60">
                    Co-organizador
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/60">
                {formatFecha(event.event_date)}
              </p>
              {event.location && (
                <p className="mt-1 text-sm text-ink/60">{event.location}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
