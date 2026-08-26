import type { GuestRow } from "@/lib/types";

export const STATUS_LABEL: Record<GuestRow["rsvp_status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  declined: "No asiste",
};

export const STATUS_CLASS: Record<GuestRow["rsvp_status"], string> = {
  pending: "bg-ink/10 text-ink/60",
  confirmed: "bg-sage/15 text-sage",
  declined: "bg-coral/15 text-coral",
};

export function formatRespondedAt(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}
