/** Base para resolver las URLs absolutas que piden Open Graph y Twitter.
 *  Vercel expone VERCEL_URL en los deploys de preview; en local se define con
 *  NEXT_PUBLIC_SITE_URL y, sin nada de eso, cae al dominio de producción. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://elcumplede.com");
