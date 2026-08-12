"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="card w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Ingresar
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Te enviamos un link mágico a tu correo, sin necesidad de contraseña.
        </p>

        {status === "sent" ? (
          <div className="mt-6 rounded-xl bg-sage/10 px-4 py-3 text-sm text-sage">
            Revisa tu correo <strong>{email}</strong> y hacé clic en el link
            para entrar.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              disabled={status === "loading"}
            />
            {status === "error" && (
              <p className="text-sm text-coral">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary"
            >
              {status === "loading" ? "Enviando..." : "Enviarme el link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
