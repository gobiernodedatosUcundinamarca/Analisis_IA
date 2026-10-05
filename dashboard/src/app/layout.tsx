import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// Montserrat es la tipografía digital institucional (REGLAS_VISUALES_UCUNDINAMARCA §3.1).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Diagnóstico de uso de IA · Universidad de Cundinamarca",
    template: "%s · Diagnóstico de uso de IA",
  },
  description:
    "Dashboard del diagnóstico sobre conocimiento, uso y apropiación de inteligencia artificial en el personal administrativo de la Universidad de Cundinamarca.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
