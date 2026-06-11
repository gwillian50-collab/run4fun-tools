import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Run4Fun Tools — Calculadoras para Corredores",
  description: "Calcule pace, velocidade, VDOT, ritmos de treino e metas de corrida. Baseado na metodologia Jack Daniels.",
  openGraph: {
    title: "Run4Fun Tools",
    description: "Ferramentas gratuitas para corredores: pace, VDOT, equivalências e mais.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>{children}</body>
    </html>
  );
}
