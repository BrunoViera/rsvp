"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;

  if (!name) {
    throw new Error("El nombre del invitado es obligatorio.");
  }

  const { error } = await supabase.from("guests").insert({
    event_id: eventId,
    name,
    phone,
    source: "host",
    approved: true,
  });

  if (error) {
    throw new Error(`No se pudo agregar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}

export async function deleteGuest(eventId: string, guestId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("guests").delete().eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo eliminar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}

export async function approveGuest(eventId: string, guestId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guests")
    .update({ approved: true })
    .eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo aprobar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}
