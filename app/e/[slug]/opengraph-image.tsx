import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/types";

export const alt = "Invitación";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function formatFecha(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Imagen de vista previa para cuando el link se comparte por WhatsApp o redes.
 *  Se usa cuando el evento no tiene foto de portada. */
export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .single<EventRow>();

  const nombre = event?.name ?? "Estás invitado/a";
  const fecha = formatFecha(event?.event_date ?? null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FFF8EC",
          color: "#211934",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3F7C59" }}>
          Estás invitado/a a
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 20,
          }}
        >
          {nombre}
        </div>
        {fecha && (
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "rgba(33,25,52,0.65)",
              marginTop: 28,
            }}
          >
            {fecha}
          </div>
        )}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 26,
            color: "rgba(33,25,52,0.45)",
          }}
        >
          Confirmá tu asistencia · Cumple RSVP
        </div>
      </div>
    ),
    size
  );
}
