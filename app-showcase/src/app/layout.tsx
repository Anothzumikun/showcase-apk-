import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Showcase — Aplikasi & Game Buatan Sendiri",
    template: "%s | Showcase",
  },
  description:
    "Direktori resmi aplikasi dan game yang dikembangkan sendiri, lengkap dengan changelog, versi, dan tautan unduhan langsung dari developer.",
  openGraph: {
    type: "website",
    siteName: "Showcase",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${space.variable} ${jbmono.variable} font-sans antialiased bg-base`}>
        <Header />
        <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
        <BottomNav />
        <footer className="hidden md:block border-t border-surface-border py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Showcase. Semua aplikasi dikembangkan &amp; didistribusikan oleh pembuatnya sendiri.
        </footer>
      </body>
    </html>
  );
}
