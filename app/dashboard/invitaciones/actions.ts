"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function acceptInvitation(invitationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("event_collaborators")
    .update({ user_id: user.id, status: "accepted" })
    .eq("id", invitationId);

  if (error) {
    throw new Error(`No se pudo aceptar la invitación: ${error.message}`);
  }

  revalidatePath("/dashboard/invitaciones");
  revalidatePath("/dashboard");
}
