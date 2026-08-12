"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addSelfGuest(
  eventId: string,
  slug: string,
  formData: FormData
) {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("Escribí tu nombre para agregarte a la lista.");
  }

  const supabase = await createClient();

  const { data: newGuest, error } = await supabase
    .from("guests")
    .insert({ event_id: eventId, name, source: "self" })
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

  if (status !== "confirmed" && status !== "declined") {
    throw new Error("Estado de RSVP inválido.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("guests")
    .update({
      rsvp_status: status,
      phone,
      description,
      responded_at: new Date().toISOString(),
    })
    .eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo guardar tu respuesta: ${error.message}`);
  }

  revalidatePath(`/e/${slug}`);
}
