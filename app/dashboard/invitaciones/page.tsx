import { createClient } from "@/lib/supabase/server";
import type { CollaboratorRow, EventRow } from "@/lib/types";
import { acceptInvitation } from "./actions";
import SubmitButton from "@/app/_components/submit-button";

export default async function InvitacionesPage() {
  const supabase = await createClient();

  const { data: invitations } = await supabase
    .from("event_collaborators")
    .select("*, event:events(name)")
    .eq("status", "pending")
    .returns<(CollaboratorRow & { event: Pick<EventRow, "name"> | null })[]>();

  const pending = invitations ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Invitaciones
      </h1>
      <p className="mt-2 text-ink/60">
        Eventos donde te invitaron a ser co-organizador/a.
      </p>

      <div className="card mt-6 flex flex-col divide-y divide-line">
        {pending.length === 0 && (
          <p className="py-4 text-sm text-ink/50">
            No tenés invitaciones pendientes.
          </p>
        )}
        {pending.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between py-3"
          >
            <span className="font-medium text-ink">
              {inv.event?.name ?? "Evento"}
            </span>
            <form action={acceptInvitation.bind(null, inv.id)}>
              <SubmitButton className="btn-primary py-2" pendingText="Aceptando…">
                Aceptar
              </SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
