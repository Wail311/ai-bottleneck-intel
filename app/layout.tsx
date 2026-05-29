import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Copper Road",
  description: "Track the supply-chain chokepoints behind the AI buildout.",
  icons: {
    icon: [
      { url: "/copper-road-favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/copper-road-favicon-256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: { url: "/copper-road-icon-512.png", sizes: "512x512", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${newsreader.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
