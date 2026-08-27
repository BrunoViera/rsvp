/** Guirnalda de tres banderines: el símbolo de la marca.
 *  Los banderines son grandes y de dos colores a propósito: las versiones con
 *  banderines chicos o tres colores se disuelven a 16px en la pestaña. */
export function Guirnalda({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M2.5 11c7-6.5 14.5-6.5 17.5 0s10.5 6.5 17.5 0"
        fill="none"
        stroke="#211934"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path d="M4 12h11.5L9.75 27z" fill="#F2A93B" />
      <path d="M14.5 13.5h11L20 28.5z" fill="#3F7C59" />
      <path d="M24.5 12H36l-5.75 15z" fill="#F2A93B" />
    </svg>
  );
}

/** Logo completo: símbolo + nombre. */
export default function Logo({
  className,
  iconClassName = "h-10 w-10",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Guirnalda className={`${iconClassName} shrink-0`} />
      <span className="font-display text-xl font-semibold">El cumple de</span>
    </span>
  );
}
