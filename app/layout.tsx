import type { Metadata, Viewport } from "next";
import "./globals.css";
import Image from "next/image";
import { BottomNav } from "@/components/ui/BottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Run4Fun Tools — Calculadoras para Corredores",
  description: "Calcule pace, velocidade, VDOT, ritmos de treino e metas de corrida. Baseado na metodologia Jack Daniels.",
  openGraph: {
    title: "Run4Fun Tools",
    description: "Ferramentas gratuitas para corredores: pace, VDOT, equivalências e mais.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Run4Fun",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className="bg-black text-white min-h-screen"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <header className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-zinc-800/60 px-4 py-3">
          <div className="max-w-2xl mx-auto flex justify-center">
            <Image src="/logo.png" alt="Run4Fun Tools" width={56} height={56} priority />
          </div>
        </header>
        <main className="pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
