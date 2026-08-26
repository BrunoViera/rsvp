"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

/** Link que reporta en qué parte de la página se hizo clic. Permite ver cuál
 *  de los CTA convierte, no solo cuántos clics hubo en total. */
export default function CtaLink({
  href,
  ubicacion,
  className,
  children,
}: {
  href: string;
  ubicacion: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("cta_click", { ubicacion })}
    >
      {children}
    </Link>
  );
}
