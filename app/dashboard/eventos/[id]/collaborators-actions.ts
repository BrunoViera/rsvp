"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function inviteCollaborator(eventId: string, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    throw new Error("Ingresá un email válido.");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("event_collaborators").insert({
    event_id: eventId,
    invited_email: email,
  });

  if (error) {
    throw new Error(`No se pudo invitar: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}

export async function removeCollaborator(
  eventId: string,
  collaboratorId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("event_collaborators")
    .delete()
    .eq("id", collaboratorId);

  if (error) {
    throw new Error(`No se pudo quitar al colaborador: ${error.message}`);
  }

  revalidatePath(`/dashboard/eventos/${eventId}`);
}
