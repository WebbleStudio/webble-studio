import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, localeConfig, isValidLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

  const dict = await getDictionary(locale);
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webble.studio";

  return (
    <>
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

      <Header locale={locale} dict={dict} />

      <main>{children}</main>

      <Footer locale={locale} dict={dict} />
    </>
  );
}
