"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_COUNTRY,
  dialCodeFor,
  guessCountry,
  listPhoneCountries,
} from "@/lib/phone-countries";
import CountrySelect from "./country-select";

/** Campo de teléfono con selector de país. Emite en un hidden el número ya
 *  normalizado a internacional (+59899123456), que es lo que se guarda y lo
 *  que espera wa.me. */
export default function PhoneInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const countries = useMemo(() => listPhoneCountries(), []);

  // El número guardado ya viene en internacional: se separa el prefijo para
  // mostrarlo en el selector y el resto en el input.
  const parsed = useMemo(() => {
    const digits = (defaultValue ?? "").replace(/\D/g, "");
    if (!digits) return null;
    const match = countries
      .filter((c) => digits.startsWith(c.dial))
      .sort((a, b) => b.dial.length - a.dial.length)[0];
    return match
      ? { country: match.code, local: digits.slice(match.dial.length) }
      : null;
  }, [defaultValue, countries]);

  const [country, setCountry] = useState(parsed?.country ?? DEFAULT_COUNTRY);
  const [local, setLocal] = useState(parsed?.local ?? "");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // País inicial cuando no hay número previo: el de la zona horaria. Se guarda
  // en un ref para poder volver a él cuando el form se resetea.
  const initialCountry = useRef(parsed?.country ?? DEFAULT_COUNTRY);

  // Va en efecto porque Intl del navegador no existe durante el render en el
  // server y desincronizaría la hidratación.
  useEffect(() => {
    if (!parsed) {
      const guessed = guessCountry();
      initialCountry.current = guessed;
      setCountry(guessed);
    }
  }, [parsed]);

  // Al enviarse, el form se resetea desde el DOM y React no se entera: el
  // estado quedaría desincronizado y el select mostrando otro país. Se escucha
  // el reset para volver los dos campos a su valor inicial.
  useEffect(() => {
    const form = wrapperRef.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setCountry(initialCountry.current);
      setLocal("");
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const dial = dialCodeFor(country);
  const digits = local.replace(/\D/g, "").replace(/^0+/, "");
  const fullNumber = digits ? `+${dial}${digits}` : "";

  return (
    <div
      ref={wrapperRef}
      className="flex w-full items-center rounded-xl border border-line bg-white focus-within:border-marigold focus-within:ring-2 focus-within:ring-marigold/30"
    >
      <CountrySelect
        countries={countries}
        value={country}
        onChange={setCountry}
      />

      <input
        type="tel"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="99 123 456"
        aria-label="Número de teléfono"
        className="min-w-0 flex-1 rounded-r-xl border-0 bg-transparent py-2 pl-0 pr-3.5 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none"
      />
      <input type="hidden" name={name} value={fullNumber} readOnly />
    </div>
  );
}
