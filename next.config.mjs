/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olvidosdegranada.es",
      },
    ],
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
    ];
  },
};

export default nextConfig;
