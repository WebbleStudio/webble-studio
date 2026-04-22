import type { Metadata } from "next";
import { locales, localeConfig, type Locale } from "@/lib/locales";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webble.studio";

export interface MetadataParams {
  locale: Locale;
  /** Pathname relative to the locale segment, e.g. "" for home, "servizi" for services */
  pathSegment?: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

/**
 * Returns the canonical URL and the full set of hreflang alternate URLs.
 *
 * The alternate for a given locale maps to the locale-specific path segment
 * stored in the translation file (e.g. "servizi" for IT, "services" for EN).
 * When the pathSegment map is not provided every locale points to its root.
 */
function buildAlternates(
  locale: Locale,
  pathSegment?: string,
  /** Optional per-locale slug overrides, e.g. { it: "servizi", en: "services" } */
  localeSlugs?: Partial<Record<Locale, string>>
): { canonical: string; languages: Record<string, string> } {
  const canonical = pathSegment ? `${BASE_URL}/${locale}/${pathSegment}` : `${BASE_URL}/${locale}`;

  const languages: Record<string, string> = {};

  for (const loc of locales) {
    const slug = localeSlugs?.[loc] ?? pathSegment ?? "";
    const href = slug ? `${BASE_URL}/${loc}/${slug}` : `${BASE_URL}/${loc}`;
    languages[localeConfig[loc].hreflang] = href;
  }

  // x-default points to the Italian version (default locale)
  const defaultSlug = localeSlugs?.["it"] ?? pathSegment ?? "";
  languages["x-default"] = defaultSlug ? `${BASE_URL}/it/${defaultSlug}` : `${BASE_URL}/it`;

  return { canonical, languages };
}

export function generatePageMetadata(
  params: MetadataParams,
  localeSlugs?: Partial<Record<Locale, string>>
): Metadata {
  const { locale, pathSegment, title, description, ogTitle, ogDescription, ogImage } = params;

  const { canonical, languages } = buildAlternates(locale, pathSegment, localeSlugs);

  const resolvedOgImage = ogImage ?? `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url: canonical,
      siteName: "Webble Studio",
      locale: localeConfig[locale].dateLocale,
      type: "website",
      images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: ogTitle ?? title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [resolvedOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}
