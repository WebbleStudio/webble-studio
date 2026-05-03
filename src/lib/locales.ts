export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";

export const localeConfig: Record<Locale, { label: string; hreflang: string; dateLocale: string }> =
  {
    it: { label: "Italiano", hreflang: "it", dateLocale: "it-IT" },
    en: { label: "English", hreflang: "en", dateLocale: "en-US" },
  };

export function isValidLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

export function validateLocale(value: unknown): Locale {
  if (isValidLocale(value)) return value;
  return defaultLocale;
}
