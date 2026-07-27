/** @type {import('next').NextConfig} */
const nextConfig = {
  // Génère une build autonome et légère pour Docker (n'embarque que les deps utilisées)
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    // Pas d'ESLint bloquant au build (le lint reste disponible en dev)
    ignoreDuringBuilds: true,
  },
  // Tree-shake lucide / framer → moins de JS côté client
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Compression des réponses en production
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
