import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";
import EventForm from "../../event-form";
import { updateEvent } from "../../actions";

export default async function EditarEventoPage({
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

  if (!event) notFound();

  const updateWithId = updateEvent.bind(null, event.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Editar evento
      </h1>
      <div className="card mt-6">
        <EventForm action={updateWithId} event={event} />
      </div>
    </div>
  );
}
