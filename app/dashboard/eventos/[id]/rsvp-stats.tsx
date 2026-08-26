import type { GuestRow } from "@/lib/types";

export default function RsvpStats({ guests }: { guests: GuestRow[] }) {
  // Los que esperan aprobación no cuentan como invitados todavía: se muestran
  // en su propia estadística para no inflar el total ni los confirmados.
  const awaiting = guests.filter((g) => !g.approved).length;
  const approved = guests.filter((g) => g.approved);

  const total = approved.length;
  const confirmed = approved.filter((g) => g.rsvp_status === "confirmed").length;
  const declined = approved.filter((g) => g.rsvp_status === "declined").length;
  const pending = total - confirmed - declined;

  const items = [
    { label: "Confirmados", value: confirmed, className: "text-sage" },
    { label: "Pendientes", value: pending, className: "text-ink/60" },
    { label: "No asisten", value: declined, className: "text-coral" },
    { label: "Total invitados", value: total, className: "text-ink" },
    ...(awaiting > 0
      ? [
          {
            label: "Esperan aprobación",
            value: awaiting,
            className: "text-ink/70",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`card mt-6 grid grid-cols-2 gap-4 ${
        awaiting > 0 ? "sm:grid-cols-5" : "sm:grid-cols-4"
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className={`font-display text-3xl font-semibold ${item.className}`}>
            {item.value}
          </p>
          <p className="mt-1 text-xs text-ink/50">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
