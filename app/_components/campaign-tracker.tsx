"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

/** Registra de dónde vino la visita cuando la URL trae ?ref=.
 *
 *  Va como evento propio y no como UTM porque Vercel Analytics agrupa las
 *  visitas por ruta y no desglosa los parámetros de la query: /?ref=whatsapp
 *  y / quedarían contadas juntas. Los eventos sí aparecen separados en
 *  Analytics > Events.
 *
 *  Se dispara una vez por visita: si alguien recarga la página con el mismo
 *  link, no se cuenta de nuevo.
 */
export default function CampaignTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    // Solo letras, números y guiones: evita mandar basura como nombre de evento.
    const limpio = ref.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
    if (!limpio) return;

    const clave = `ref_visto_${limpio}`;
    try {
      if (sessionStorage.getItem(clave)) return;
      sessionStorage.setItem(clave, "1");
    } catch {
      // Modo privado o storage bloqueado: se reporta igual, puede duplicar.
    }

    track("visita_campana", { origen: limpio });
  }, [searchParams]);

  return null;
}
