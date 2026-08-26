"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isRsvpOpen } from "@/lib/event-timing";
import type { EventRow } from "@/lib/types";

export async function addSelfGuest(
  eventId: string,
  slug: string,
  formData: FormData
) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name) {
    throw new Error("Escribí tu nombre para agregarte a la lista.");
  }

  // El teléfono es obligatorio en este flujo: quien organiza necesita poder
  // contactar a alguien que se suma por su cuenta antes de aprobarlo.
  if (!phone) {
    throw new Error("Dejá tu teléfono para que puedan contactarte.");
  }

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single<EventRow>();

  if (!event || !isRsvpOpen(event)) {
    throw new Error("Las confirmaciones para este evento ya cerraron.");
  }

  const { data: newGuest, error } = await supabase
    .from("guests")
    // Se agrega pendiente: el organizador lo aprueba desde el dashboard.
    .insert({ event_id: eventId, name, phone, source: "self", approved: false })
    .select("id")
    .single();

  if (error || !newGuest) {
    throw new Error(
      `No te pudimos agregar a la lista: ${error?.message ?? "error desconocido"}`
    );
  }

  revalidatePath(`/e/${slug}`);
  redirect(`/e/${slug}?guest=${newGuest.id}`);
}

export async function submitRsvpBySlug(
  slug: string,
  guestId: string,
  formData: FormData
) {
  const status = String(formData.get("status") || "");
  const phone = String(formData.get("phone") || "").trim() || null;
  const description =
    String(formData.get("description") || "").trim() || null;
  const dietary_restrictions =
    String(formData.get("dietary_restrictions") || "").trim() || null;

  if (status !== "confirmed" && status !== "declined") {
    throw new Error("Estado de RSVP inválido.");
  }

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single<EventRow>();

  if (!event || !isRsvpOpen(event)) {
    throw new Error("Las confirmaciones para este evento ya cerraron.");
  }

  const { error } = await supabase
    .from("guests")
    .update({
      rsvp_status: status,
      phone,
      description,
      dietary_restrictions,
      responded_at: new Date().toISOString(),
    })
    .eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo guardar tu respuesta: ${error.message}`);
  }

  revalidatePath(`/e/${slug}`);
}
