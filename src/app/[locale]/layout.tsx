import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, localeConfig, isValidLocale } from "@/lib/locales";
import { BookingProvider } from "@/context/BookingContext";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webble.studio";

  return (
    <BookingProvider locale={locale}>
      {/* Hreflang links injected once per locale layout render */}
      {locales.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={localeConfig[loc].hreflang}
          href={`${BASE_URL}/${loc}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/it`} />
      {children}
    </BookingProvider>
  );
}
