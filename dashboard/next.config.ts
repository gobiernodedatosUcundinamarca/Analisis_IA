import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // El imagotipo se sirve tal cual desde public/brand: son PNG institucionales que no
    // deben recomprimirse, y así el build no depende del binario de optimización.
    unoptimized: true,
  },
};

export default nextConfig;
