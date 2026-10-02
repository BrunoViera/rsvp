/** @type {import('next').NextConfig} */
const nextConfig = {
  // ponytail: portada va por Server Action; Vercel corta en 4.5 MB. Si hay fotos más grandes, subir directo a Supabase desde el cliente.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
