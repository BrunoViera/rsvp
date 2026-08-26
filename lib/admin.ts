/** Correos con acceso a las vistas internas (métricas del producto).
 *  Se configura con ADMIN_EMAILS (separados por coma) para no dejar correos
 *  hardcodeados en el repo. Sin variable definida, cae a la lista de abajo. */
const POR_DEFECTO = ["brunovierag@gmail.com", "bruno@restoo.me"];

export function esAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const permitidos = (process.env.ADMIN_EMAILS?.split(",") ?? POR_DEFECTO)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return permitidos.includes(email.toLowerCase());
}
