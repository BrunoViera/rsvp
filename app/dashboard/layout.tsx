import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <span className="font-display text-lg font-semibold text-ink">
          Cumple RSVP
        </span>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invitaciones" className="text-sm text-ink/70 hover:text-ink">
            Invitaciones
          </Link>
          {user?.email && (
            <span className="text-sm text-ink/60">{user.email}</span>
          )}
          <form action={signOut}>
            <button type="submit" className="btn-secondary py-2">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
