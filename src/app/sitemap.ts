import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/locales";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://webble.studio";

/** Slug for the services page per locale */
const servicesSlugs: Record<Locale, string> = {
  it: "servizi",
  en: "services",
};

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  alternates: {
    languages: Record<string, string>;
  };
}

function buildAlternates(paths: Record<Locale, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const loc of locales) {
    result[loc] = `${BASE_URL}/${loc}${paths[loc] ? `/${paths[loc]}` : ""}`;
  }
  result["x-default"] = `${BASE_URL}/it${paths.it ? `/${paths.it}` : ""}`;
  return result;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: SitemapEntry[] = [];

  // Home pages
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: buildAlternates({ it: "", en: "" }),
      },
    });
  }

  // Services pages
  for (const locale of locales) {
    const slug = servicesSlugs[locale];
    entries.push({
      url: `${BASE_URL}/${locale}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: buildAlternates(servicesSlugs),
      },
    });
  }

  return entries;
}
