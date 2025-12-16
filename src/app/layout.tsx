import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paloma Priebe | Método 30™ | Consultoria Remota",
  description:
    "Anamnese guiada por IA + revisão humana da Paloma Priebe. Método 30™ para treinos remotos seguros e eficientes.",
  icons: {
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Paloma Priebe | Método 30™",
    description:
      "Treinos remotos que parecem presenciais. Anamnese socrática + revisão humana.",
    url: "https://paloma-priebe.vercel.app",
    siteName: "Paloma Priebe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paloma Priebe | Método 30™",
    description:
      "Treinos remotos seguros com revisão humana. Método 30™ e suporte pelo WhatsApp.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
