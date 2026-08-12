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

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("host_id", user?.id ?? "")
    .order("event_date", { ascending: true })
    .returns<EventRow[]>();

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

      {!events || events.length === 0 ? (
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
              <h2 className="font-display text-lg font-semibold text-ink">
                {event.name}
              </h2>
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
