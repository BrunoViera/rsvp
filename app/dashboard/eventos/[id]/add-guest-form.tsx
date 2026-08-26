"use client";

import { useRef } from "react";
import PhoneInput from "@/app/_components/phone-input";

/** Form de alta de invitado. Es cliente para poder devolver el foco al nombre
 *  después de agregar, y así encadenar altas sin tocar el mouse. */
export default function AddGuestForm({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        nameRef.current?.focus();
      }}
      className="mt-4 flex flex-col gap-3"
    >
      <input
        ref={nameRef}
        type="text"
        name="name"
        required
        placeholder="Nombre del invitado"
        className="field"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <PhoneInput name="phone" />
        </div>
        <button type="submit" className="btn-secondary whitespace-nowrap">
          + Agregar
        </button>
      </div>
    </form>
  );
}
