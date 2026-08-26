"use client";

import { useState } from "react";
import PhoneInput from "@/app/_components/phone-input";
import type { GuestRow } from "@/lib/types";

const STATUS_OPTIONS: { value: GuestRow["rsvp_status"]; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "declined", label: "No asiste" },
];

/** Edición en línea de un invitado: nombre, teléfono y confirmación.
 *  Se muestra en lugar de la card cuando el organizador toca "Editar". */
export default function EditGuestForm({
  guest,
  action,
  onCancel,
}: {
  guest: GuestRow;
  action: (formData: FormData) => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState(guest.rsvp_status);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label
          htmlFor={`name-${guest.id}`}
          className="mb-1 block text-xs font-medium text-ink/60"
        >
          Nombre
        </label>
        <input
          id={`name-${guest.id}`}
          type="text"
          name="name"
          required
          defaultValue={guest.name}
          className="field"
        />
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Teléfono
        </span>
        <PhoneInput name="phone" defaultValue={guest.phone} />
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-ink/60">
          Confirmación
        </span>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${
                status === opt.value
                  ? "border-ink/30 bg-ink/5 text-ink"
                  : "border-line text-ink/60 hover:bg-ink/5"
              }`}
            >
              <input
                type="radio"
                name="rsvp_status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary text-xs">
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-xs"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
