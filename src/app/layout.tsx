import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Mohave, Figtree, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
import { defaultLocale, isValidLocale } from "@/lib/locales";
import GrainOverlay from "@/components/ui/GrainOverlay";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const mohave = Mohave({
  subsets: ["latin"],
  variable: "--font-mohave",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

const grtskGiga = localFont({
  src: [
    {
      path: "../../public/fonts/GrtskGiga-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GrtskGiga-semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-grtsk-giga",
  display: "swap",
});

/**
 * Root layout. Owns <html> and <body> as required by Next.js App Router.
 * Reads the locale forwarded by proxy.ts to set the correct lang attribute
 * server-side without any client-side hydration mismatch.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const rawLocale = headersList.get("x-locale") ?? defaultLocale;
  const lang = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${mohave.variable} ${figtree.variable} ${pixelifySans.variable} ${grtskGiga.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}
