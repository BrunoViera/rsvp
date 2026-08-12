import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">
        Cumple RSVP
      </h1>
      <p className="max-w-md font-body text-ink/70">
        Organiza tu cumpleaños, invita a tus amigos y lleva el control de
        quién confirma. Este proyecto está en construcción.
      </p>
      <Link href="/login" className="btn-primary">
        Ingresar como organizador
      </Link>
    </main>
  );
}
