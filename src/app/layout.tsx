import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tituloApp = "Finanzas Personales";
const descripcionApp =
  "Registra ingresos y gastos, categorízalos y visualiza tu saldo mensual en un dashboard claro.";

const urlSitio = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(urlSitio),
  title: {
    default: tituloApp,
    template: `%s · ${tituloApp}`,
  },
  description: descripcionApp,
  applicationName: tituloApp,
  keywords: [
    "finanzas personales",
    "presupuesto",
    "ingresos",
    "gastos",
    "dashboard financiero",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    title: tituloApp,
    description: descripcionApp,
    siteName: tituloApp,
    url: urlSitio,
  },
  twitter: {
    card: "summary_large_image",
    title: tituloApp,
    description: descripcionApp,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
