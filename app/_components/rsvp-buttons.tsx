"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "./submit-button";

/** Los dos botones de respuesta del invitado.
 *  useFormStatus dice si el form se está enviando, pero no cuál de los dos
 *  botones se apretó, así que se recuerda en estado local para mostrar el
 *  spinner solo en el que se tocó. Ambos se deshabilitan mientras se envía. */
export default function RsvpButtons() {
  const { pending } = useFormStatus();
  const [elegido, setElegido] = useState<"confirmed" | "declined" | null>(null);

  return (
    <div className="flex gap-3">
      <button
        type="submit"
        name="status"
        value="confirmed"
        disabled={pending}
        aria-busy={pending && elegido === "confirmed"}
        onClick={() => setElegido("confirmed")}
        className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && elegido === "confirmed" ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Confirmando…
          </span>
        ) : (
          "Sí, voy 🎉"
        )}
      </button>

      <button
        type="submit"
        name="status"
        value="declined"
        disabled={pending}
        aria-busy={pending && elegido === "declined"}
        onClick={() => setElegido("declined")}
        className="btn-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && elegido === "declined" ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Guardando…
          </span>
        ) : (
          "No puedo ir"
        )}
      </button>
    </div>
  );
}
