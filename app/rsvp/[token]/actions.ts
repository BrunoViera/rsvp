"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitRsvp(token: string, formData: FormData) {
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
    .eq("rsvp_token", token);

  if (error) {
    throw new Error(`No se pudo guardar tu respuesta: ${error.message}`);
  }

  revalidatePath(`/rsvp/${token}`);
}
