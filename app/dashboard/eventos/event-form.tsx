import type { EventRow } from "@/lib/types";
import LocationField from "./location-field";

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function toTimeInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function todayDateInputValue(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => void;
  event?: EventRow;
}) {
  return (
    <form action={action} className="flex flex-col gap-6">
      {event?.cover_photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.cover_photo_url}
          alt="Portada actual"
          className="h-40 w-full rounded-card object-cover"
        />
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/80">
          Foto de portada {event ? "(opcional, reemplaza la actual)" : "(opcional)"}
        </label>
        <input type="file" name="cover" accept="image/*" className="field" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/80">
          Nombre del evento
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={event?.name}
          placeholder="Cumpleaños de Sofía"
          className="field"
        />
      </div>

      <LocationField defaultValue={event?.location ?? ""} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            required
            min={event ? undefined : todayDateInputValue()}
            defaultValue={toDateInputValue(event?.event_date ?? null)}
            className="field"
          />
          {!event && (
            <p className="mt-1 text-xs text-ink/40">
              No puede ser una fecha pasada.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink/80">
            Hora de inicio
          </label>
          <input
            type="time"
            name="time"
            required
            defaultValue={toTimeInputValue(event?.event_date ?? null)}
            className="field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/80">
          Duración (en horas)
        </label>
        <input
          type="number"
          name="duration_hours"
          min="0.5"
          step="0.5"
          required
          defaultValue={event?.duration_hours ?? 3}
          className="field"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink/80">
          Regalo / wishlist (opcional)
        </label>
        <textarea
          name="gift_info"
          rows={3}
          defaultValue={event?.gift_info ?? ""}
          placeholder="Ej: link a la wishlist, alias para transferencia, etc."
          className="field"
        />
      </div>

      <button type="submit" className="btn-primary self-start">
        {event ? "Guardar cambios" : "Crear evento"}
      </button>
    </form>
  );
}
