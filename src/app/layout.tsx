import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LokalLens AI",
  description: "Empowering Indonesian UMKM with professional AI product visuals, marketing copy, and trend analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full antialiased selection:bg-brand-500/30 selection:text-brand-900",
        dmSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full font-sans bg-white text-brand-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
