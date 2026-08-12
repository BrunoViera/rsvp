"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";

function combineDateAndTime(date: string, time: string): string {
  // date: "YYYY-MM-DD", time: "HH:mm" -> ISO string en la zona local del server
  return new Date(`${date}T${time}:00`).toISOString();
}

async function uploadCoverIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  slug: string,
  file: File | null
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${slug}-cover.${ext}`;

  const { error } = await supabase.storage
    .from("event-covers")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error("Error subiendo la foto de portada:", error.message);
    return null;
  }

  const { data } = supabase.storage.from("event-covers").getPublicUrl(path);
  return data.publicUrl;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const duration_hours = Number(formData.get("duration_hours") || 3);
  const gift_info = String(formData.get("gift_info") || "").trim() || null;
  const cover = formData.get("cover") as File | null;

  if (!name || !date || !time) {
    throw new Error("Nombre, fecha y hora de inicio son obligatorios.");
  }

  const slug = generateSlug(name);
  const cover_photo_url = await uploadCoverIfNeeded(
    supabase,
    user.id,
    slug,
    cover
  );

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      host_id: user.id,
      name,
      location: location || null,
      event_date: combineDateAndTime(date, time),
      duration_hours,
      gift_info,
      cover_photo_url,
      slug,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`No se pudo crear el evento: ${error.message}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/eventos/${event.id}`);
}

export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const duration_hours = Number(formData.get("duration_hours") || 3);
  const gift_info = String(formData.get("gift_info") || "").trim() || null;
  const cover = formData.get("cover") as File | null;

  if (!name || !date || !time) {
    throw new Error("Nombre, fecha y hora de inicio son obligatorios.");
  }

  const { data: existing } = await supabase
    .from("events")
    .select("slug")
    .eq("id", eventId)
    .single();

  const slug = existing?.slug ?? generateSlug(name);
  const cover_photo_url = await uploadCoverIfNeeded(
    supabase,
    user.id,
    slug,
    cover
  );

  const updatePayload: Record<string, unknown> = {
    name,
    location: location || null,
    event_date: combineDateAndTime(date, time),
    duration_hours,
    gift_info,
  };
  if (cover_photo_url) updatePayload.cover_photo_url = cover_photo_url;

  const { error } = await supabase
    .from("events")
    .update(updatePayload)
    .eq("id", eventId);

  if (error) {
    throw new Error(`No se pudo actualizar el evento: ${error.message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/eventos/${eventId}`);
  redirect(`/dashboard/eventos/${eventId}`);
}
