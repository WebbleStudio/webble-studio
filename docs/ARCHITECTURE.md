# Webble Studio — Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Locale Routing](#locale-routing)
4. [Dictionary Loading](#dictionary-loading)
5. [Metadata and Hreflang](#metadata-and-hreflang)
6. [SEO Strategy](#seo-strategy)
7. [Sitemap](#sitemap)
8. [Proxy](#proxy)
9. [How to Add a New Language](#how-to-add-a-new-language)
10. [How to Add a New Page](#how-to-add-a-new-page)
11. [Best Practices](#best-practices)
12. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
13. [Deployment SEO Checklist](#deployment-seo-checklist)

---

## Overview

This project implements a production-ready multilingual website using **Next.js App Router** with **TypeScript strict mode**. Every language has its own canonical URL prefix (`/it/...`, `/en/...`). There is no runtime language detection, no forced automatic redirects between locales, and no query-parameter-based language switching.

The architecture follows these core principles:

- **Zero client-side translation logic** — all dictionary loading happens on the server.
- **Type safety throughout** — `Locale` is a discriminated union, not a plain string.
- **Centralized configuration** — adding a new language requires changes in exactly two places.
- **SEO-first** — each page produces a complete set of hreflang alternates, a canonical URL, OpenGraph tags, and Twitter Card metadata.

---

## Folder Structure

```
webble-studio/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: owns <html lang> and <body>
│   │   ├── page.tsx                    # Root page: redirects / → /it
│   │   ├── sitemap.ts                  # Multilingual sitemap generator
│   │   └── [locale]/
│   │       ├── layout.tsx              # Locale layout: header, nav, footer
│   │       ├── page.tsx                # Home page per locale
│   │       ├── servizi/
│   │       │   └── page.tsx            # IT-only services page (/it/servizi)
│   │       └── services/
│   │           └── page.tsx            # EN-only services page (/en/services)
│   ├── lib/
│   │   ├── locales.ts                  # Locale type, config, validation
│   │   ├── getDictionary.ts            # Dictionary loader and types
│   │   └── metadata.ts                 # Centralized metadata generator
│   └── proxy.ts                        # Forwards x-locale header to root layout
├── locales/
│   ├── it.json                         # Italian translations
│   └── en.json                         # English translations
└── docs/
    └── ARCHITECTURE.md                 # This file
```

---

## Locale Routing

### How it works

All pages live under `src/app/[locale]/`. The `[locale]` dynamic segment captures the language prefix directly from the URL path:

```
/it         → app/[locale]/page.tsx         (locale = "it")
/en         → app/[locale]/page.tsx         (locale = "en")
/it/servizi → app/[locale]/servizi/page.tsx (locale = "it")
/en/services→ app/[locale]/services/page.tsx(locale = "en")
```

### Locale validation

Every page and layout that consumes `params.locale` validates it immediately:

```ts
const { locale } = await params;
if (!isValidLocale(locale)) notFound();
```

`isValidLocale` is a type guard defined in `lib/locales.ts`. If an unknown locale is passed (e.g. `/fr/`), Next.js returns a 404 — there are no silent fallbacks.

### Static generation

`generateStaticParams` is exported from `[locale]/layout.tsx` and `[locale]/page.tsx`:

```ts
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
```

This ensures all locale variants are pre-rendered at build time (SSG).

### Translated slugs

Service pages use locale-specific URL slugs:

| Locale | Path           |
| ------ | -------------- |
| `it`   | `/it/servizi`  |
| `en`   | `/en/services` |

Each route segment (`servizi/`, `services/`) is a separate folder in `app/[locale]/`. A page inside each folder checks that the locale matches the expected language and returns `notFound()` otherwise:

```ts
// app/[locale]/servizi/page.tsx
if (locale !== "it") notFound();
```

This prevents crawlers from indexing `/en/servizi` or `/it/services`.

---

## Dictionary Loading

### File format

Translation files are plain JSON located in `locales/`:

```
locales/
├── it.json
└── en.json
```

### Dictionary type

A single `Dictionary` interface in `lib/getDictionary.ts` defines the complete shape of every translation file. This is the single source of truth — if a key is missing from a JSON file, TypeScript will fail at build time.

```ts
export interface Dictionary {
  meta: { siteName: string };
  nav: { home: string; services: string; contact: string };
  home: { title: string; description: string /* … */ };
  services: { slug: string; title: string /* … */ };
}
```

### Loading mechanism

Dictionaries are loaded using dynamic `import()`, which enables code splitting per locale. Each locale's JSON is only loaded when a page for that locale is rendered.

```ts
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("../../locales/it.json").then((mod) => mod.default as Dictionary),
  en: () => import("../../locales/en.json").then((mod) => mod.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
```

All calls to `getDictionary` happen in Server Components only. No dictionary data is sent to the client beyond what is rendered into HTML.

---

## Metadata and Hreflang

### generatePageMetadata

`lib/metadata.ts` exports a single `generatePageMetadata` function used in every page's `generateMetadata` export:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = await getDictionary(locale);
  return generatePageMetadata({
    locale,
    title: dict.home.title,
    description: dict.home.description,
    ogTitle: dict.home.og.title,
    ogDescription: dict.home.og.description,
  });
}
```

### Hreflang alternates

For each page, `generatePageMetadata` builds the complete set of `<link rel="alternate" hreflang>` tags via the `alternates.languages` field of Next.js `Metadata`:

```ts
alternates: {
  canonical: "https://webble.studio/it",
  languages: {
    "it": "https://webble.studio/it",
    "en": "https://webble.studio/en",
    "x-default": "https://webble.studio/it",
  },
},
```

For pages with translated slugs (e.g. services), the `localeSlugs` parameter maps each locale to its correct path segment:

```ts
generatePageMetadata(
  { locale: "it", pathSegment: "servizi" /* … */ },
  { it: "servizi", en: "services" } // localeSlugs
);
```

This ensures hreflang links point to the correct translated URL rather than mirroring the Italian slug into the English URL tree.

### x-default

The `x-default` hreflang always points to the Italian (default) locale. This signals to search engines that Italian is the primary version when no language preference is matched.

### OpenGraph and Twitter Card

Both are generated automatically from the title and description passed to `generatePageMetadata`. The `ogImage` parameter defaults to `/og-default.png` when not provided. All images are sized at 1200×630.

### Canonical URLs

Each page produces an explicit canonical URL:

```ts
canonical: `${BASE_URL}/${locale}/${pathSegment}`,
```

This prevents duplicate content issues in cases where a page might be accessible via multiple paths.

---

## SEO Strategy

| Concern                    | Solution                                             |
| -------------------------- | ---------------------------------------------------- |
| Separate URLs per language | `/it/...` and `/en/...` path prefixes                |
| No duplicate content       | Canonical URLs on every page                         |
| Hreflang                   | Full set via `alternates.languages` in metadata      |
| x-default                  | Always points to default locale (`it`)               |
| No query-param routing     | Locale is path-based only                            |
| No forced redirects        | `/` redirects to `/it` only; locale URLs are stable  |
| Server-side rendering      | All pages are SSG or SSR — no client-only content    |
| Multilingual sitemap       | `app/sitemap.ts` covers all locale/page combos       |
| `<html lang>`              | Set server-side via proxy + root layout              |
| Translated slugs           | `/it/servizi` and `/en/services` are separate routes |

---

## Sitemap

`src/app/sitemap.ts` exports a default function that Next.js automatically serves at `/sitemap.xml`. It generates one entry per locale per page and includes `alternates.languages` for each entry so Google understands the full multilingual structure.

```ts
{
  url: "https://webble.studio/it/servizi",
  alternates: {
    languages: {
      "it": "https://webble.studio/it/servizi",
      "en": "https://webble.studio/en/services",
      "x-default": "https://webble.studio/it/servizi",
    },
  },
}
```

To add a new page to the sitemap, add an entry block following the existing pattern and provide the `localeSlugs` map for that page.

---

## Proxy

In Next.js 16 the `middleware.ts` file convention was renamed to `proxy.ts` (and the exported function from `middleware` to `proxy`). This clarifies that the feature runs at the network edge, in front of the application, rather than being Express-style middleware.

`src/proxy.ts` runs on every non-static request. Its sole responsibility is to extract the locale from the first path segment and forward it as the `x-locale` response header. The root layout reads this header to set `<html lang>` server-side.

```
Request: GET /it/servizi
         ↓
proxy.ts extracts "it" → sets header x-locale: it
         ↓
app/layout.tsx reads x-locale → renders <html lang="it">
         ↓
app/[locale]/layout.tsx validates locale → renders header/nav/footer
         ↓
app/[locale]/servizi/page.tsx checks locale === "it" → renders content
```

The proxy never modifies the URL, sets cookies, or performs redirects.

---

## How to Add a New Language

Follow these four steps to add, for example, French (`fr`):

### 1. Register the locale

```ts
// src/lib/locales.ts
export const locales = ["it", "en", "fr"] as const;

export const localeConfig = {
  // existing…
  fr: { label: "Français", hreflang: "fr", dateLocale: "fr-FR" },
};
```

### 2. Create the translation file

```bash
cp locales/en.json locales/fr.json
# Translate all values in fr.json
```

### 3. Register the loader

```ts
// src/lib/getDictionary.ts
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("../../locales/it.json").then(/* … */),
  en: () => import("../../locales/en.json").then(/* … */),
  fr: () => import("../../locales/fr.json").then(/* … */),
};
```

### 4. Create locale-specific route folders (if using translated slugs)

```bash
# If the French slug for services is "services" (same as EN) or "nos-services":
mkdir -p src/app/\[locale\]/nos-services
# Copy and adapt src/app/[locale]/services/page.tsx
# Update localeSlugs in generatePageMetadata: { it: "servizi", en: "services", fr: "nos-services" }
```

### 5. Update the sitemap

Add the new locale and its slugs to `servicesSlugs` in `src/app/sitemap.ts`.

No other files require modification. The layout, nav, hreflang generation, and sitemap all iterate over the `locales` array automatically.

---

## How to Add a New Page

### Shared slug across locales (e.g. `/about`)

1. Create `src/app/[locale]/about/page.tsx`
2. Add translations to every `locales/*.json` file under a new key (e.g. `about`)
3. Update `Dictionary` interface in `lib/getDictionary.ts`
4. Call `generatePageMetadata` in the page's `generateMetadata` export
5. Add the page to `src/app/sitemap.ts`

### Translated slug (e.g. `/it/chi-siamo` and `/en/about-us`)

1. Create `src/app/[locale]/chi-siamo/page.tsx` (check `locale !== "it"` → 404)
2. Create `src/app/[locale]/about-us/page.tsx` (check `locale !== "en"` → 404)
3. Add translations under a shared key (e.g. `about`) in each JSON file
4. Pass `localeSlugs: { it: "chi-siamo", en: "about-us" }` to `generatePageMetadata`
5. Update `src/app/[locale]/layout.tsx` nav links if needed
6. Add both URL variants to the sitemap with shared alternates

---

## Best Practices

- **Always validate the locale param** before any dictionary or metadata call.
- **Keep `Dictionary` interface in sync** with JSON files. TypeScript catches missing keys at build time.
- **Use `generateStaticParams`** in every `[locale]` layout and page to enable static generation at build time.
- **Never import dictionaries on the client.** All `getDictionary` calls must be in async Server Components.
- **Use `process.env.NEXT_PUBLIC_SITE_URL`** for the base URL. Set it correctly in production.
- **Set `x-default` to the primary locale**, not to a root redirect.
- **Use translated slugs** for content pages to maximize SEO value per language.
- **Keep hreflang accurate.** An Italian user landing on `/en/services` via a wrong hreflang link creates a bad UX and a search engine trust signal issue.

---

## Common Mistakes to Avoid

| Mistake                                                        | Why It's Harmful                                  | Correct Approach                                  |
| -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Using `?lang=it` query params                                  | Duplicate content; search engines may ignore      | Path-based locale prefix only                     |
| Auto-redirecting `/en/` to `/it/`                              | Breaks shared links; hreflang becomes meaningless | Never redirect between locales                    |
| Returning the same content for `/it/servizi` and `/en/servizi` | Duplicate content penalty                         | Enforce locale check; return 404 for wrong locale |
| Hardcoding the base URL                                        | Breaks staging and preview deployments            | Always use `NEXT_PUBLIC_SITE_URL`                 |
| Generating hreflang only on some pages                         | Partial hreflang is worse than none               | Use `generatePageMetadata` on every page          |
| Loading dictionaries in Client Components                      | Sends all locale data to the browser              | Server Components only for dictionary loading     |
| Missing `x-default`                                            | Google doesn't know which locale is primary       | Always include `x-default` in alternates          |
| Incorrect `x-default` pointing to a redirect                   | Google may devalue it                             | Point `x-default` directly to a real page         |

---

## Deployment SEO Checklist

Before going live, verify each item:

- [ ] `NEXT_PUBLIC_SITE_URL` is set to the production domain (no trailing slash)
- [ ] `/sitemap.xml` is accessible and contains all locale variants
- [ ] `/robots.txt` references the sitemap URL
- [ ] Every page has a canonical URL in `<head>`
- [ ] Every page has a complete set of `<link rel="alternate" hreflang>` tags
- [ ] `<html lang>` is correctly set for each locale (verify in DevTools)
- [ ] `/it/servizi` returns 404 for locale `en` (and vice versa)
- [ ] Google Search Console is configured with the production site
- [ ] Submit the sitemap to Google Search Console
- [ ] Verify hreflang implementation with the [hreflang testing tool](https://technicalseo.com/tools/hreflang/)
- [ ] Run a Lighthouse SEO audit on both locale home pages
- [ ] Ensure no `noindex` directives are present on production pages
- [ ] OG images are accessible at their absolute URLs (test with the [OG Debugger](https://developers.facebook.com/tools/debug/))
- [ ] Twitter Card tags are valid (test with [Card Validator](https://cards-dev.twitter.com/validator))
