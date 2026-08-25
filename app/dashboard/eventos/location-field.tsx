"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import type { GeoPoint } from "@/lib/geocode";
import MapEmbed from "@/app/_components/map-embed";

interface Suggestion {
  displayName: string;
  lat: number;
  lon: number;
}

async function searchPlaces(
  query: string,
  signal: AbortSignal,
  near?: GeoPoint | null
): Promise<Suggestion[]> {
  const params = new URLSearchParams({ q: query });
  if (near) {
    params.set("lat", String(near.lat));
    params.set("lon", String(near.lon));
  }

  const res = await fetch(`/api/places/search?${params.toString()}`, {
    signal,
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { results?: Suggestion[] };
  return data.results ?? [];
}

/** Pide la ubicación del navegador una sola vez, sin molestar si la rechazan. */
function useApproxUserLocation(): GeoPoint | null {
  const [coords, setCoords] = useState<GeoPoint | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        // El usuario no dio permiso o falló: seguimos sin bias, sin drama.
      },
      { maximumAge: 10 * 60 * 1000, timeout: 5000 }
    );
  }, []);

  return coords;
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className ?? ""}`}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

/** Resalta en negrita la parte del texto que matchea lo que se escribió. */
function highlightMatch(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;

  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-ink">
        {text.slice(idx, idx + trimmed.length)}
      </strong>
      {text.slice(idx + trimmed.length)}
    </>
  );
}

export default function LocationField({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<GeoPoint | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const userLocation = useApproxUserLocation();

  // Si estamos editando un evento que ya tiene lugar cargado, mostramos
  // un preview de mapa apenas entra a la página (sin abrir el dropdown).
  useEffect(() => {
    if (defaultValue.trim().length < 3) return;

    const controller = new AbortController();
    searchPlaces(defaultValue, controller.signal)
      .then((results) => {
        if (results[0]) {
          setPoint({ lat: results[0].lat, lon: results[0].lon });
          setSelectedLabel(defaultValue);
        }
      })
      .catch(() => {});

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runSearch(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const results = await searchPlaces(query, controller.signal, userLocation);
        setSuggestions(results);
        setOpen(true);
        setSearched(true);
        setActiveIndex(-1);
      } catch {
        // ignoramos aborts/errores de red: el usuario puede seguir escribiendo
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    setPoint(null);
    setSelectedLabel(null);
    setSearched(false);

    const trimmed = next.trim();
    if (trimmed.length < 3) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    runSearch(trimmed);
  }

  function handleSelect(s: Suggestion) {
    setValue(s.displayName);
    setPoint({ lat: s.lat, lon: s.lon });
    setSelectedLabel(s.displayName);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleClear() {
    setValue("");
    setPoint(null);
    setSelectedLabel(null);
    setSuggestions([]);
    setOpen(false);
    setSearched(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isConfirmed = point !== null && selectedLabel === value;
  const showEmptyState =
    searched && !loading && !open && suggestions.length === 0 && !isConfirmed;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink/80">
        Lugar
      </label>

      <div className="relative">
        <PinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />

        <input
          type="text"
          name="location"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Salón Los Aromos, Av. Siempre Viva 742"
          className="field pl-9 pr-9"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Spinner className="h-4 w-4 text-ink/40" />
          ) : isConfirmed ? (
            <CheckIcon className="h-4 w-4 text-sage" />
          ) : (
            value.length > 0 && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClear}
                aria-label="Borrar lugar"
                className="rounded-full p-0.5 text-ink/30 hover:bg-ink/5 hover:text-ink/60"
              >
                <ClearIcon className="h-4 w-4" />
              </button>
            )
          )}
        </div>

        {open && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
          >
            {suggestions.length > 0 ? (
              suggestions.map((s, i) => (
                <li key={`${s.lat}-${s.lon}-${i}`}>
                  <button
                    type="button"
                    // evita que el blur del input se dispare antes del click
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm text-ink/80 ${
                      i === activeIndex ? "bg-marigold/15" : "hover:bg-ink/5"
                    }`}
                  >
                    <PinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/35" />
                    <span>{highlightMatch(s.displayName, value)}</span>
                  </button>
                </li>
              ))
            ) : (
              !loading && (
                <li className="px-3 py-2 text-sm text-ink/40">
                  No encontramos lugares con ese nombre. Probá con menos
                  detalle (ej: solo el nombre del salón o la calle).
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {showEmptyState && (
        <p className="mt-1.5 text-xs text-ink/40">
          No encontramos ese lugar. Podés dejarlo escrito igual, o probar
          escribiendo distinto para buscar de nuevo.
        </p>
      )}

      {point ? (
        <div className="mt-3 overflow-hidden rounded-card border border-line">
          <div className="flex items-center gap-1.5 border-b border-line bg-sage/5 px-3 py-1.5 text-xs font-medium text-sage">
            <CheckIcon className="h-3.5 w-3.5" />
            Vista previa del lugar
          </div>
          <MapEmbed point={point} />
        </div>
      ) : (
        value.trim().length >= 3 &&
        !loading &&
        !showEmptyState && (
          <p className="mt-2 flex items-center gap-1 text-xs text-ink/40">
            <PinIcon className="h-3.5 w-3.5" />
            Elegí una opción de la lista para previsualizar el mapa.
          </p>
        )
      )}
    </div>
  );
}
