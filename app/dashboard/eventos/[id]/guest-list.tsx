import type { GuestRow } from "@/lib/types";
import CopyLinkButton from "./copy-link-button";
import WhatsappButton from "./whatsapp-button";
import AddGuestForm from "./add-guest-form";
import { addGuest, deleteGuest, approveGuest } from "./guests-actions";

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

function StatusIcon({
  status,
  className,
}: {
  status: GuestRow["rsvp_status"];
  className?: string;
}) {
  if (status === "confirmed") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
    );
  }
  if (status === "declined") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4.2l3 1.8" />
    </svg>
  );
}

function NoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9L20 8.5v10A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v3.5A1.5 1.5 0 0 0 15.5 9H19M8 12.5h8M8 15.5h5" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 .8 12a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9L17 7" />
    </svg>
  );
}

function formatRespondedAt(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

export default function GuestList({
  eventId,
  eventName,
  guests,
}: {
  eventId: string;
  eventName: string;
  guests: GuestRow[];
}) {
  const addGuestWithId = addGuest.bind(null, eventId);
  const deleteGuestWithId = deleteGuest.bind(null, eventId);
  const approveGuestWithId = approveGuest.bind(null, eventId);

  // Los que se agregaron solos esperan el visto bueno del organizador y van
  // en su propia sección, arriba de la lista.
  const awaiting = guests.filter((g) => !g.approved);
  const approved = guests.filter((g) => g.approved);

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

      <AddGuestForm action={addGuestWithId} />

      {awaiting.length > 0 && (
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
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line/70 bg-white px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{guest.name}</p>
                  {guest.phone && (
                    <p className="text-xs text-ink/55">{guest.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <form action={approveGuestWithId.bind(null, guest.id)}>
                    <button
                      type="submit"
                      className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage transition hover:bg-sage/25"
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={deleteGuestWithId.bind(null, guest.id)}>
                    <button
                      type="submit"
                      aria-label={`Rechazar a ${guest.name}`}
                      className="rounded-full px-3 py-1 text-xs font-medium text-coral/70 transition hover:bg-coral/10 hover:text-coral"
                    >
                      Rechazar
                    </button>
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
          <div
            key={guest.id}
            className="flex flex-col rounded-xl border border-line/70 p-4 transition hover:border-line"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-medium text-ink">{guest.name}</p>
              {guest.source === "self" && (
                <span className="whitespace-nowrap rounded-full bg-marigold/15 px-2 py-0.5 text-[10px] font-medium text-marigold">
                  Se sumó solo/a
                </span>
              )}
            </div>

            {guest.phone && (
              <p className="mt-1 text-xs text-ink/55">{guest.phone}</p>
            )}

            {(guest.description || guest.dietary_restrictions) && (
              <div className="mt-2 flex flex-col gap-1 text-xs text-ink/55">
                {guest.description && (
                  <span className="flex items-start gap-1.5">
                    <NoteIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/35" />
                    <span className="break-words">{guest.description}</span>
                  </span>
                )}
                {guest.dietary_restrictions && (
                  <span className="flex items-start gap-1.5 text-coral/80">
                    <span aria-hidden="true">🍽️</span>
                    <span className="break-words">
                      {guest.dietary_restrictions}
                    </span>
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line/60 pt-3">
              <span
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${STATUS_CLASS[guest.rsvp_status]}`}
              >
                <StatusIcon status={guest.rsvp_status} className="h-3 w-3" />
                {STATUS_LABEL[guest.rsvp_status]}
              </span>

              {guest.responded_at && (
                <span className="whitespace-nowrap text-[11px] text-ink/40">
                  {guest.rsvp_status === "confirmed" ? "Confirmó" : "Respondió"}{" "}
                  el {formatRespondedAt(guest.responded_at)}
                </span>
              )}

              <div className="ml-auto flex items-center gap-2">
                {guest.phone && (
                  <WhatsappButton
                    guestName={guest.name}
                    eventName={eventName}
                    rsvpPath={`/rsvp/${guest.rsvp_token}`}
                    phone={guest.phone}
                  />
                )}
                <CopyLinkButton
                  path={`/rsvp/${guest.rsvp_token}`}
                  label="Copiar link"
                />
                <form action={deleteGuestWithId.bind(null, guest.id)}>
                  <button
                    type="submit"
                    aria-label={`Eliminar a ${guest.name}`}
                    className="rounded-full p-1.5 text-coral/50 transition hover:bg-coral/10 hover:text-coral"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
