import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EventRow, GuestRow } from "@/lib/types";
import RsvpCard from "@/app/_components/rsvp-card";
import { submitRsvp } from "./actions";

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
