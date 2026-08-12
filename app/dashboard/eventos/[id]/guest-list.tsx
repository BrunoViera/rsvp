import type { GuestRow } from "@/lib/types";
import CopyLinkButton from "./copy-link-button";
import { addGuest, deleteGuest } from "./guests-actions";

const STATUS_LABEL: Record<GuestRow["rsvp_status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "No asiste",
};

const STATUS_CLASS: Record<GuestRow["rsvp_status"], string> = {
  pending: "bg-ink/10 text-ink/60",
  confirmed: "bg-sage/15 text-sage",
  declined: "bg-coral/15 text-coral",
};

export default function GuestList({
  eventId,
  guests,
}: {
  eventId: string;
  guests: GuestRow[];
}) {
  const addGuestWithId = addGuest.bind(null, eventId);
  const deleteGuestWithId = deleteGuest.bind(null, eventId);

  const confirmedCount = guests.filter(
    (g) => g.rsvp_status === "confirmed"
  ).length;

  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">
          Invitados ({guests.length})
        </h2>
        <span className="text-sm text-sage">{confirmedCount} confirmados</span>
      </div>

      <form
        action={addGuestWithId}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          name="name"
          required
          placeholder="Nombre del invitado"
          className="field sm:flex-1"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono (opcional)"
          className="field sm:flex-1"
        />
        <button type="submit" className="btn-secondary whitespace-nowrap">
          + Agregar
        </button>
      </form>

      <div className="mt-6 flex flex-col divide-y divide-line">
        {guests.length === 0 && (
          <p className="py-4 text-sm text-ink/50">
            Todavía no agregaste invitados.
          </p>
        )}
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-ink">{guest.name}</p>
              {guest.phone && (
                <p className="text-xs text-ink/50">{guest.phone}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[guest.rsvp_status]}`}
              >
                {STATUS_LABEL[guest.rsvp_status]}
              </span>
              <CopyLinkButton
                path={`/rsvp/${guest.rsvp_token}`}
                label="Copiar link personal"
              />
              <form action={deleteGuestWithId.bind(null, guest.id)}>
                <button
                  type="submit"
                  className="text-xs text-coral/70 hover:text-coral"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
