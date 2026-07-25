import type { NextConfig } from "next";
import path from "node:path";

const esProduccion = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy (solo en producción para no interferir con el
 * hot-reload del entorno de desarrollo). Permite la app y las conexiones a
 * Supabase (API, Auth y Storage de avatares).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .concat(esProduccion ? "; upgrade-insecure-requests" : "");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // La CSP solo se aplica en producción.
  ...(esProduccion ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

const nextConfig: NextConfig = {
  // No exponer la cabecera "X-Powered-By: Next.js".
  poweredByHeader: false,
  // Fija la raíz del proyecto para Turbopack y evita el aviso por
  // lockfiles detectados en carpetas superiores.
  turbopack: {
    root: path.resolve(),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
