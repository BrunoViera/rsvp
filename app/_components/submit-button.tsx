"use client";

import { useFormStatus } from "react-dom";

/** Botón de envío que se deshabilita y avisa mientras la acción corre.
 *  Usa useFormStatus, que lee el estado del <form> que lo contiene: sin esto
 *  el click no daba ninguna señal y era fácil enviar dos veces. */
export default function SubmitButton({
  children,
  pendingText,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  /** Texto mientras se envía. Si no se pasa, se mantiene el original. */
  pendingText?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      aria-busy={pending}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending && pendingText ? pendingText : children}
    </button>
  );
}

/** Variante con spinner, para botones donde no cabe cambiar el texto. */
export function SubmitIconButton({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      aria-busy={pending}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? <Spinner /> : children}
    </button>
  );
}

export function Spinner({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} animate-spin`}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset="14"
      />
    </svg>
  );
}
