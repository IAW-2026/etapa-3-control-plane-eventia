import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { esAdmin } from "./lib/rolAdmin";
import Footer from "./_componentes/Footer";
import BarraInicio from "./_componentes/BarraInicio";
import { ffDisplay, ffBody, ffLabel } from './_componentes/fonts';

export const metadata = {
  title: "Eventia",
  description: "La plataforma definitiva para organizar eventos, vender entradas y gestionar pagos de manera simple, segura y confiable.",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${ffDisplay.variable} ${ffBody.variable} ${ffLabel.variable} h-full antialiased`}
    >
      <ClerkProvider>
        <body className="min-h-full bg-white text-slate-900 flex flex-col">
          <BarraInicio />
          <main className="flex-1 min-w-0">{children}</main>
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  );
}