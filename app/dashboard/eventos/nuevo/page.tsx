import EventForm from "../event-form";
import { createEvent } from "../actions";

export default function NuevoEventoPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Crear evento
      </h1>
      <div className="card mt-6">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
