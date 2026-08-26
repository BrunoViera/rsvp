import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import RsvpCard from "@/app/_components/rsvp-card";
import { submitRsvp } from "./actions";

import type { Metadata } from "next";

function formatFechaCorta(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}

/** Vista previa al compartir el link. A propósito NO incluye el nombre del
 *  invitado: el link personal se reenvía por chat y el nombre quedaría visible
 *  en la preview de cualquier conversación. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();
  const { data: guest } = await supabase
    .from("guests")
    .select("event:events(*)")
    .eq("rsvp_token", token)
    .single<{ event: EventRow }>();

  const event = guest?.event;
  if (!event) return { title: "Invitación" };

  const fecha = formatFechaCorta(event.event_date);
  const partes = [fecha && `El ${fecha}`, event.location].filter(Boolean);
  const descripcion = partes.length
    ? `${partes.join(" · ")}. Confirmá tu asistencia.`
    : "Confirmá tu asistencia.";

  return {
    title: event.name,
    description: descripcion,
    openGraph: {
      title: event.name,
      description: descripcion,
      type: "website",
      ...(event.cover_photo_url ? { images: [event.cover_photo_url] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description: descripcion,
    },
    robots: { index: false, follow: false },
  };
}

export default async function RsvpPersonalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("*, event:events(*)")
    .eq("rsvp_token", token)
    .single<GuestRow & { event: EventRow }>();

  if (!guest || !guest.event) notFound();

  return (
    <main className="min-h-screen px-6 py-12">
      <RsvpCard
        event={guest.event}
        guest={guest}
        action={submitRsvp.bind(null, token)}
      />
    </main>
  );
}
