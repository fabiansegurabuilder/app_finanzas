import { ImageResponse } from "next/og";

export const alt = "Finanzas Personales — controla tus ingresos y gastos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph usada al compartir el sitio en redes. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "linear-gradient(135deg, #0f0a1f 0%, #2e1065 55%, #4f46e5 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 34,
          fontWeight: 600,
          opacity: 0.9,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          $
        </div>
        Finanzas Personales
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.1,
          maxWidth: 900,
        }}
      >
        Controla tus ingresos y gastos en un solo lugar
      </div>
      <div style={{ marginTop: 28, fontSize: 32, opacity: 0.8 }}>
        Registra, categoriza y visualiza tu saldo mensual.
      </div>
    </div>,
    { ...size },
  );
}
