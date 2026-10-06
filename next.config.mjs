/** @type {import('next').NextConfig} */
// Origen del despliegue de «Con-textos 29N» (repo sondeo-29n). Sin la variable no hay rewrite.
const contextos29nOrigin = (() => {
  try {
    const u = new URL(process.env.CONTEXTOS_29N_ORIGIN || "");
    return u.protocol === "https:" || u.hostname === "localhost" ? u.origin : null;
  } catch {
    return null;
  }
})();

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
      // Imágenes de dominio público / licencia libre de Wikimedia Commons
      // (especiales «Con-textos»).
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
    minimumCacheTTL: 86400,
  },
  experimental: {
    // La vista previa de los especiales «Con-textos» lee los ficheros HTML
    // del repositorio en tiempo de ejecución: hay que incluirlos en el
    // despliegue serverless.
    outputFileTracingIncludes: {
      "/admin/vista-previa/con-textos/[especial]": ["./src/content/con-textos/**/*"],
    },
  },
  eslint: {
    // Ignorar errores de ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante el build
    ignoreBuildErrors: true,
  },
  async headers() {
    // Cabeceras de seguridad para toda la web. La CSP va solo en modo informe
    // (Report-Only): Next 14 inyecta scripts en línea sin nonce y los artículos
    // incrustan visores (FlowPaper, YouTube); se endurece cuando se revisen los
    // avisos. HSTS lo pone Vercel, pero sin includeSubDomains.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://online.flowpaper.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "frame-src 'self' https://*.flowpaper.com https://online.flowpaper.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://js.stripe.com https://checkout.stripe.com https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://api.stripe.com https://*.public.blob.vercel-storage.com https://vitals.vercel-insights.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
    ].join("; ");
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://checkout.stripe.com\")" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
  async rewrites() {
    // olvidos.es/contexto/sondeo/... lo sirve la app aparte (basePath "/contexto/sondeo" allí).
    if (!contextos29nOrigin) return [];
    return {
      beforeFiles: [
        { source: "/contexto/sondeo", destination: `${contextos29nOrigin}/contexto/sondeo` },
        { source: "/contexto/sondeo/:path*", destination: `${contextos29nOrigin}/contexto/sondeo/:path*` },
      ],
    };
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
      // --- Slugs numéricos heredados de WordPress renombrados a descriptivos
      // (mejor SEO). 301 del número antiguo al slug nuevo. ---
      { source: "/articulos/768", destination: "/articulos/a-ambos-lados-de-la-barricada", permanent: true },
      { source: "/articulos/1085", destination: "/articulos/pietro-ingrao", permanent: true },
      { source: "/articulos/4669", destination: "/articulos/tengo-miedo-a-perder-la-maravilla", permanent: true },
      { source: "/articulos/5252", destination: "/articulos/venus", permanent: true },
      { source: "/articulos/5450", destination: "/articulos/ya-no-tengo-un-recuerdo-que-me-acoja", permanent: true },
      { source: "/articulos/5454", destination: "/articulos/no-encuentro-paz", permanent: true },
      { source: "/articulos/5925", destination: "/articulos/de-que-tierra-sera-donde-su-mar", permanent: true },
      // Slugs de prueba renombrados a descriptivos.
      { source: "/articulos/prueba-procesos-2", destination: "/articulos/un-camino-mas-para-el-cine", permanent: true },
      { source: "/articulos/prueba-pdf", destination: "/articulos/olvidos-de-granada-n-1", permanent: true },
    ];
  },
};

export default nextConfig;
