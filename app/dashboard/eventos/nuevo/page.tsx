import Link from "next/link";
import EventForm from "../event-form";
import { createEvent } from "../actions";

export default function NuevoEventoPage() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
      >
        ← Volver al dashboard
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
        Crear evento
      </h1>
      <div className="card mt-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
