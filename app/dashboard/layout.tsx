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
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/dashboard"
          className="whitespace-nowrap font-display text-lg font-semibold text-ink hover:text-ink/80"
        >
          Cumple RSVP
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/dashboard"
            className="whitespace-nowrap text-sm text-ink/70 hover:text-ink"
          >
            Mis eventos
          </Link>
          <Link
            href="/dashboard/invitaciones"
            className="whitespace-nowrap text-sm text-ink/70 hover:text-ink"
          >
            Invitaciones
          </Link>
          <Link
            href="/dashboard/metricas"
            className="whitespace-nowrap text-sm text-ink/70 hover:text-ink"
          >
            Métricas
          </Link>
          {/* El email ocupa demasiado en pantallas chicas y no es accionable. */}
          {user?.email && (
            <span className="hidden max-w-[16rem] truncate text-sm text-ink/60 lg:inline">
              {user.email}
            </span>
          )}
          <form action={signOut}>
            <button type="submit" className="btn-secondary px-4">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
