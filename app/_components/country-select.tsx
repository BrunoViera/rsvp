"use client";

import { useEffect, useRef, useState } from "react";
import type { PhoneCountry } from "@/lib/phone-countries";

/** Desplegable de países. Cerrado muestra bandera + prefijo (para no comerle
 *  ancho al número); abierto, la lista con el nombre completo.
 *  Un <select> nativo no permite mostrar un texto cerrado y otro abierto, que
 *  es el motivo de que esto sea un dropdown propio. */
export default function CountrySelect({
  countries,
  value,
  onChange,
}: {
  countries: PhoneCountry[];
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = countries.find((c) => c.code === value);
  const filtered = query
    ? countries.filter((c) =>
        `${c.name} +${c.dial}`.toLowerCase().includes(query.toLowerCase())
      )
    : countries;

  // Cerrar al hacer click afuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Al abrir, dejar a la vista el país elegido.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    listRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: "center" });
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        // Fuera del recorrido de Tab: al tabular desde el nombre se va directo
        // al número, que es lo habitual. Sigue accesible por click y para los
        // lectores de pantalla, que no navegan solo con Tab.
        tabIndex={-1}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`País: ${selected?.name ?? value}. Cambiar`}
        className="flex items-center gap-1 rounded-l-xl py-2 pl-3 pr-2 font-body text-sm text-ink/70 transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold/40"
      >
        <span className="text-base leading-none">{selected?.flag}</span>
        <span className="whitespace-nowrap">+{selected?.dial}</span>
        <span aria-hidden="true" className="text-xs leading-none text-ink/30">
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar país…"
            aria-label="Buscar país"
            className="w-full border-b border-line px-3 py-2 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <ul
            ref={listRef}
            role="listbox"
            aria-label="Países"
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.code === value}
                  data-selected={c.code === value}
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-body text-sm transition hover:bg-ink/5 ${
                    c.code === value ? "bg-marigold/10 text-ink" : "text-ink/80"
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-xs text-ink/45">+{c.dial}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink/50">Sin resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
