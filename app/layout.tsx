import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARISE — Solo Leveling System",
  description:
    "Личная система прокачки. Тренировки, питание и привычки в стиле «Поднятие уровня в одиночку».",
};

export const viewport: Viewport = {
  themeColor: "#0c1a2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${mono.variable} dark`}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
