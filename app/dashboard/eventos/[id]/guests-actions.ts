"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isEventFinished } from "@/lib/event-timing";
import type { EventRow } from "@/lib/types";


/** Un evento terminado es de solo lectura. Ocultar los botones no alcanza:
 *  las server actions se pueden invocar igual, así que se corta acá. */
async function assertEventEditable(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string
) {
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single<EventRow>();

  if (event && isEventFinished(event)) {
    throw new Error("Este evento ya terminó y no se puede modificar.");
  }
}

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient();
  await assertEventEditable(supabase, eventId);

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
  await assertEventEditable(supabase, eventId);

  const { error } = await supabase.from("guests").delete().eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo eliminar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}

export async function approveGuest(eventId: string, guestId: string) {
  const supabase = await createClient();
  await assertEventEditable(supabase, eventId);

  const { error } = await supabase
    .from("guests")
    .update({ approved: true })
    .eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo aprobar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}

export async function updateGuest(
  eventId: string,
  guestId: string,
  formData: FormData
) {
  const supabase = await createClient();
  await assertEventEditable(supabase, eventId);

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const rsvp_status = String(formData.get("rsvp_status") || "");

  if (!name) {
    throw new Error("El nombre del invitado es obligatorio.");
  }

  if (!["pending", "confirmed", "declined"].includes(rsvp_status)) {
    throw new Error("Estado de confirmación inválido.");
  }

  const { data: current } = await supabase
    .from("guests")
    .select("rsvp_status, responded_at")
    .eq("id", guestId)
    .single<{ rsvp_status: string; responded_at: string | null }>();

  // responded_at marca cuándo respondió el invitado. Si el organizador cambia
  // el estado a mano se sella la fecha, y si lo vuelve a "pendiente" se limpia
  // para no dejar un "respondió el ..." de una respuesta que ya no existe.
  const responded_at =
    rsvp_status === "pending"
      ? null
      : current?.rsvp_status === rsvp_status
        ? current.responded_at
        : new Date().toISOString();

  const { error } = await supabase
    .from("guests")
    .update({ name, phone, rsvp_status, responded_at })
    .eq("id", guestId);

  if (error) {
    throw new Error(`No se pudo actualizar el invitado: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}
