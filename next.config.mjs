/** @type {import('next').NextConfig} */
const nextConfig = {
  // Génère une build autonome et légère pour Docker (n'embarque que les deps utilisées)
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    // Pas d'ESLint bloquant au build (le lint reste disponible en dev)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
