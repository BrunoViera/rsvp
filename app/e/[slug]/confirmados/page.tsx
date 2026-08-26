import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import { isConfirmedListVisible } from "@/lib/event-timing";

export default async function ConfirmadosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single<EventRow>();

  if (!event) notFound();

  if (!isConfirmedListVisible(event)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {event.name}
        </h1>
        <p className="mt-3 text-ink/60">
          Este evento ya finalizó, la lista de confirmados dejó de estar
          disponible.
        </p>
      </main>
    );
  }

  const { data: confirmed } = await supabase
    .from("guests")
    .select("*")
    .eq("event_id", event.id)
    .eq("rsvp_status", "confirmed")
    .eq("approved", true)
    .order("name", { ascending: true })
    .returns<GuestRow[]>();

  const guests = confirmed ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-12">
      <p className="text-sm text-ink/50">Lista de confirmados</p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        {event.name}
      </h1>
      <p className="mt-2 text-sm text-sage">
        {guests.length} {guests.length === 1 ? "persona confirmada" : "personas confirmadas"}
      </p>

      <div className="card mt-6 flex flex-col divide-y divide-line">
        {guests.length === 0 && (
          <p className="py-4 text-sm text-ink/50">
            Todavía no hay confirmados.
          </p>
        )}
        {guests.map((guest) => (
          <div key={guest.id} className="py-3">
            <p className="font-medium text-ink">{guest.name}</p>
            {guest.phone && (
              <p className="text-xs text-ink/50">{guest.phone}</p>
            )}
            {guest.dietary_restrictions && (
              <p className="text-xs text-coral/80">
                🍽️ {guest.dietary_restrictions}
              </p>
            )}
            {guest.description && (
              <p className="mt-1 text-sm italic text-ink/70">
                "{guest.description}"
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
