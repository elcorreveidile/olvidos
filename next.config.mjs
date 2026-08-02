/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olvidosdegranada.es",
      },
      // Avatares de los logins sociales (foto de perfil del usuario).
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // Imágenes alojadas en Vercel Blob (documentos/medios propios).
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/index.php/:year/:month/:day/:slug",
        destination: "/articulos/:slug",
        permanent: true,
      },
      {
        source: "/index.php/category/:slug",
        destination: "/articulos?categoria=:slug",
        permanent: true,
      },
      {
        source: "/index.php/tag/:slug",
        destination: "/articulos?tag=:slug",
        permanent: true,
      },
      {
        source: "/index.php/about",
        destination: "/sobre-nosotros",
        permanent: true,
      },
      // --- Web histórica olvidos.es (2010, CakePHP): URLs por sección + ID
      // numérico. Los IDs antiguos no mapean a los slugs actuales, así que
      // redirigimos a nivel de sección para conservar la autoridad SEO del
      // dominio histórico y evitar 404 en enlaces indexados. ---
      { source: "/editoriales/:id*", destination: "/articulos?categoria=editorial", permanent: true },
      { source: "/palabras/:id*", destination: "/articulos?categoria=palabras", permanent: true },
      { source: "/piezas/:id*", destination: "/articulos?categoria=piezas-procesos", permanent: true },
      { source: "/procesos/:id*", destination: "/articulos?categoria=piezas-procesos", permanent: true },
      { source: "/soneto500/:id*", destination: "/articulos?categoria=sonetos", permanent: true },
      { source: "/opiniones/:id*", destination: "/articulos?categoria=apostillas", permanent: true },
      { source: "/eventos/:id*", destination: "/actividades", permanent: true },
      { source: "/videos/:id*", destination: "/actividades", permanent: true },
    ];
  },
};

export default nextConfig;
