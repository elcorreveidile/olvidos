import { execSync } from "node:child_process";

// Versión automática a partir de git (último commit). Funciona en local y en
// Vercel (que conserva el commit HEAD). No requiere mantenimiento manual.
function gitVersion() {
  const run = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  try {
    const sha = (process.env.VERCEL_GIT_COMMIT_SHA || run("git rev-parse HEAD")).slice(0, 7);
    const date = run("git log -1 --format=%cs"); // YYYY-MM-DD del commit
    const [y, m, d] = date.split("-");
    return { version: `${y}.${Number(m)}.${Number(d)}`, commit: sha, date };
  } catch {
    return { version: "dev", commit: "", date: "" };
  }
}

const V = gitVersion();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_VERSION: V.version,
    APP_COMMIT: V.commit,
    APP_DATE: V.date,
  },
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
