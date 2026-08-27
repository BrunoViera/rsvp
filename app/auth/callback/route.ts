import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Callback del link mágico.
 *
 *  Supabase puede llegar acá de dos formas según el flujo:
 *  - `token_hash` + `type`: es lo que manda el link del email. Se canjea con
 *    verifyOtp y funciona aunque el correo se abra en otro navegador.
 *  - `code`: flujo PKCE, que exige el code verifier guardado en el navegador
 *    donde se pidió el link. Se soporta como respaldo (por ejemplo OAuth).
 *
 *  Antes solo se manejaba `code`, y por eso el link del email terminaba en
 *  "link_invalido" cuando se abría desde el cliente de correo del teléfono.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard";

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) redirect(next);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }

  redirect("/login?error=link_invalido");
}
