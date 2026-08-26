/** Base para resolver las URLs absolutas que piden Open Graph y Twitter.
 *  Vercel expone VERCEL_URL en preview y producción; en local cae al site url. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
