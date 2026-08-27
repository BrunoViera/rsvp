import type { GuestRow } from "@/lib/types";
import AddGuestForm from "./add-guest-form";
import {
  addGuest,
  deleteGuest,
  approveGuest,
  updateGuest,
} from "./guests-actions";
import GuestCard from "./guest-card";
import SubmitButton from "@/app/_components/submit-button";

export default function GuestList({
  eventId,
  eventName,
  guests,
  readOnly,
}: {
  eventId: string;
  eventName: string;
  guests: GuestRow[];
  readOnly?: boolean;
}) {
  const addGuestWithId = addGuest.bind(null, eventId);
  const deleteGuestWithId = deleteGuest.bind(null, eventId);
  const approveGuestWithId = approveGuest.bind(null, eventId);

  // Los que se agregaron solos esperan el visto bueno del organizador y van
  // en su propia sección, arriba de la lista.
  const awaiting = guests.filter((g) => !g.approved);

  // Primero los que todavía no respondieron (los que requieren acción), después
  // los confirmados y al final los que avisaron que no van.
  const STATUS_ORDER: Record<GuestRow["rsvp_status"], number> = {
    pending: 0,
    confirmed: 1,
    declined: 2,
  };
  const approved = guests
    .filter((g) => g.approved)
    .sort(
      (a, b) => STATUS_ORDER[a.rsvp_status] - STATUS_ORDER[b.rsvp_status]
    );

  const confirmedCount = approved.filter(
    (g) => g.rsvp_status === "confirmed"
  ).length;

  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">
          Invitados ({approved.length})
        </h2>
        <span className="text-sm text-sage">{confirmedCount} confirmados</span>
      </div>

      {!readOnly && <AddGuestForm action={addGuestWithId} />}

      {!readOnly && awaiting.length > 0 && (
        <div className="mt-6 rounded-xl border border-marigold/40 bg-marigold/5 p-4">
          <h3 className="font-display text-sm font-semibold text-ink">
            Solicitudes pendientes ({awaiting.length})
          </h3>
          <p className="mt-1 text-xs text-ink/55">
            Se agregaron desde el link de la lista. No cuentan como invitados
            hasta que los apruebes.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {awaiting.map((guest) => (
              <div
                key={guest.id}
                className="flex flex-col gap-2 rounded-xl border border-line/70 bg-white px-3 py-2 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="min-w-0 sm:flex-1">
                  <p className="break-words font-medium text-ink">
                    {guest.name}
                  </p>
                  {guest.phone && (
                    <p className="text-xs text-ink/55">{guest.phone}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={approveGuestWithId.bind(null, guest.id)}>
                    <SubmitButton
                      className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage transition hover:bg-sage/25"
                      pendingText="Aprobando…"
                    >
                      Aprobar
                    </SubmitButton>
                  </form>
                  <form action={deleteGuestWithId.bind(null, guest.id)}>
                    <SubmitButton
                      ariaLabel={`Rechazar a ${guest.name}`}
                      className="rounded-full px-3 py-1 text-xs font-medium text-coral/70 transition hover:bg-coral/10 hover:text-coral"
                      pendingText="Rechazando…"
                    >
                      Rechazar
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {approved.length === 0 && (
          <p className="py-4 text-sm text-ink/50">
            Todavía no agregaste invitados.
          </p>
        )}
        {approved.map((guest) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            eventName={eventName}
            readOnly={readOnly}
            updateAction={updateGuest.bind(null, eventId, guest.id)}
            deleteAction={deleteGuestWithId.bind(null, guest.id)}
          />
        ))}
      </div>
    </div>
  );
}
