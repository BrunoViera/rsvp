import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import RsvpCard from "@/app/_components/rsvp-card";
import GuestPicker from "./guest-picker";
import { addSelfGuest, submitRsvpBySlug } from "./actions";

import type { Metadata } from "next";

function formatFechaCorta(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });
}

/** Vista previa al compartir el link (WhatsApp, redes). Si el evento tiene foto
 *  de portada se usa esa; si no, cae en la que genera opengraph-image.tsx. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single<EventRow>();

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
    // La invitación no debe aparecer en buscadores.
    robots: { index: false, follow: false },
  };
}

export default async function RsvpListaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ guest?: string }>;
}) {
  const { slug } = await params;
  const { guest: guestId } = await searchParams;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single<EventRow>();

  if (!event) notFound();

  if (guestId) {
    const { data: guest } = await supabase
      .from("guests")
      .select("*")
      .eq("id", guestId)
      .eq("event_id", event.id)
      .single<GuestRow>();

    if (guest) {
      return (
        <main className="min-h-screen px-6 py-12">
          <RsvpCard
            event={event}
            guest={guest}
            action={submitRsvpBySlug.bind(null, slug, guest.id)}
          />
        </main>
      );
    }
  }

  const { data: guests } = await supabase
    .from("guests")
    .select("id, name")
    .eq("event_id", event.id)
    .eq("approved", true)
    .order("name", { ascending: true });

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-12">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {event.name}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Buscá tu nombre para confirmar tu asistencia.
        </p>
      </div>

      <GuestPicker
        guests={guests ?? []}
        addSelfAction={addSelfGuest.bind(null, event.id, slug)}
      />
    </main>
  );
}
