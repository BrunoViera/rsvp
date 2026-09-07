import type { EventRow, GuestRow } from "@/lib/types";
import { isRsvpOpen } from "@/lib/event-timing";
import EventDetails from "./event-details";
import RsvpButtons from "./rsvp-buttons";

const STATUS_TEXT: Record<GuestRow["rsvp_status"], string> = {
  pending: "Todavía no respondiste",
  confirmed: "Confirmaste tu asistencia",
  declined: "Avisaste que no podés ir",
};

export default async function RsvpCard({
  event,
  guest,
  action,
}: {
  event: EventRow;
  guest: GuestRow;
  action: (formData: FormData) => void;
}) {
  const rsvpOpen = isRsvpOpen(event);
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <EventDetails event={event} />

      {!guest.approved && (
        <div className="rounded-card border border-marigold/40 bg-marigold/5 px-4 py-3 text-sm text-ink/70">
          Tu solicitud está pendiente de aprobación. Podés confirmar tu
          asistencia igual; quien organiza la va a revisar.
        </div>
      )}

      <div className="card">
        <p className="text-sm text-ink/60">Hola,</p>
        <h2 className="font-display text-xl font-semibold text-ink">
          {guest.name}
        </h2>

        {guest.rsvp_status !== "pending" && (
          <p className="mt-2 text-sm text-sage">
            {STATUS_TEXT[guest.rsvp_status]}
            {rsvpOpen ? ". Podés cambiar tu respuesta abajo si es necesario." : "."}
          </p>
        )}

        {rsvpOpen ? (
          <form action={action} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={guest.phone ?? ""}
                className="field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">
                Restricciones alimentarias / alergias (opcional)
              </label>
              <input
                type="text"
                name="dietary_restrictions"
                defaultValue={guest.dietary_restrictions ?? ""}
                placeholder="Ej: vegetariano, celíaco, alergia a los frutos secos"
                className="field"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">
                Un mensaje para el cumpleañero/a (opcional)
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={guest.description ?? ""}
                className="field"
              />
            </div>

            <RsvpButtons />
          </form>
        ) : (
          <div className="mt-4 rounded-xl bg-ink/5 px-4 py-3 text-sm text-ink/60">
            Las confirmaciones para este evento ya cerraron.
            {guest.rsvp_status === "pending" &&
              " No llegaste a responder a tiempo."}
          </div>
        )}
      </div>
    </div>
  );
}
