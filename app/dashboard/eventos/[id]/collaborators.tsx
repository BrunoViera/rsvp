import type { CollaboratorRow } from "@/lib/types";
import { inviteCollaborator, removeCollaborator } from "./collaborators-actions";
import SubmitButton from "@/app/_components/submit-button";

export default function Collaborators({
  eventId,
  collaborators,
}: {
  eventId: string;
  collaborators: CollaboratorRow[];
}) {
  const inviteWithId = inviteCollaborator.bind(null, eventId);
  const removeWithId = removeCollaborator.bind(null, eventId);

  return (
    <div className="card mt-6">
      <h2 className="font-display text-xl font-semibold text-ink">
        Co-organizadores
      </h2>
      <p className="mt-1 text-sm text-ink/60">
        Invitá a otra persona para que administre este evento con los mismos
        permisos que vos.
      </p>

      <form
        action={inviteWithId}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="email@ejemplo.com"
          className="field sm:flex-1"
        />
        <SubmitButton
          className="btn-secondary whitespace-nowrap"
          pendingText="Invitando…"
        >
          + Invitar
        </SubmitButton>
      </form>

      <div className="mt-4 flex flex-col divide-y divide-line">
        {collaborators.length === 0 && (
          <p className="py-2 text-sm text-ink/50">
            Todavía no invitaste a nadie.
          </p>
        )}
        {collaborators.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="text-ink">{c.invited_email}</span>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  c.status === "accepted"
                    ? "bg-sage/15 text-sage"
                    : "bg-ink/10 text-ink/60"
                }`}
              >
                {c.status === "accepted" ? "Activo" : "Invitación pendiente"}
              </span>
              <form action={removeWithId.bind(null, c.id)}>
                <SubmitButton
                  className="text-xs text-coral/70 hover:text-coral"
                  pendingText="Quitando…"
                >
                  Quitar
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
