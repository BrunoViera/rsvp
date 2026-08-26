"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Reemplaza los identificadores de la URL por su nombre de ruta antes de
 *  reportarla. Sin esto se enviarían tokens de invitación (que sirven para
 *  confirmar en nombre de otra persona) y nombres de eventos a un servicio
 *  externo. Se ve el tráfico por tipo de página, no por evento concreto. */
function enmascararUrl(url: string): string {
  return url
    .replace(/\/rsvp\/[^/?#]+/, "/rsvp/[token]")
    .replace(/\/e\/[^/?#]+/, "/e/[slug]")
    .replace(/\/dashboard\/eventos\/[0-9a-f-]{36}/i, "/dashboard/eventos/[id]")
    // El id del invitado viaja como query param en la lista pública.
    .replace(/([?&])guest=[^&]*/, "$1guest=[id]");
}

export default function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={(event) => ({ ...event, url: enmascararUrl(event.url) })} />
      <SpeedInsights beforeSend={(data) => ({ ...data, url: enmascararUrl(data.url) })} />
    </>
  );
}
