import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto para Turbopack y evita el aviso por
  // lockfiles detectados en carpetas superiores.
  turbopack: {
    root: path.resolve(),
  },
};

export default nextConfig;
