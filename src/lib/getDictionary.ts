import type { Locale } from "@/lib/locales";

export interface ServiceItem {
  name: string;
  description: string;
}

export interface FounderCard {
  name: string;
  role: string;
  ctaLabel: string;
  image: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  image: string;
}

export interface CaseStudy {
  index: string;
  year: string;
  category: string;
  brand: string;
  image: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
}

export interface IntegrationTool {
  name: string;
}

export interface HomeService {
  index: string;
  title: string;
  description: string;
  image: string;
  points: string[];
}

export type WhyUsKind = "check" | "warn" | "cross";

export interface WhyUsRow {
  label: string;
  values: { kind: WhyUsKind; text: string }[];
}

export interface TestimonialReview {
  brand: string;
  quote: string;
  authorName: string;
  authorRole: string;
  image: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  ctaLabel: string;
  popular?: boolean;
  features: string[];
}

export interface BlogPost {
  category: string;
  date: string;
  title: string;
  image: string;
  href: string;
}

export interface Dictionary {
  meta: {
    siteName: string;
  };
  nav: {
    home: string;
    about: string;
    ourWork: string;
    services: string;
    contact: string;
    contactCta: string;
  };
  home: {
    title: string;
    description: string;
    og: {
      title: string;
      description: string;
    };
    hero: {
      services: { label: string }[];
      subheadline: string;
      chipLabel: string;
      headline: string;
      primaryCta: string;
      secondaryCta: string;
      founder: FounderCard;
    };
  };
  companies: {
    eyebrow: string;
    logos: { name: string; src: string }[];
  };
  caseStudies: {
    eyebrow: string;
    headline: string;
    body: string;
    ctaLabel: string;
    allCtaLabel: string;
    items: CaseStudy[];
  };
  process: {
    eyebrow: string;
    headline: string;
    body: string;
    steps: ProcessStep[];
  };
  integrations: {
    eyebrow: string;
    headline: string;
    body: string;
    tools: IntegrationTool[];
  };
  homeServices: {
    eyebrow: string;
    headline: string;
    body: string;
    items: HomeService[];
  };
  whyUs: {
    eyebrow: string;
    headline: string;
    body: string;
    brandLabel: string;
    columns: string[];
    rows: WhyUsRow[];
  };
  testimonials: {
    eyebrow: string;
    headline: string;
    reviews: TestimonialReview[];
    metrics: { value: string; suffix: string; label: string }[];
  };
  pricing: {
    eyebrow: string;
    headline: string;
    monthlyLabel: string;
    yearlyLabel: string;
    yearlyDiscount: string;
    guaranteeLabel: string;
    popularLabel: string;
    currency: string;
    perMonth: string;
    plans: PricingPlan[];
  };
  blog: {
    eyebrow: string;
    headline: string;
    ctaLabel: string;
    posts: BlogPost[];
  };
  faqs: {
    eyebrow: string;
    headline: string;
    founder: FounderCard;
    items: { question: string; answer: string }[];
  };
  cta: {
    eyebrow: string;
    body: string;
    ctaLabel: string;
  };
  footer: {
    title: string;
    nav: {
      home: string;
      about: string;
      portfolio: string;
      contact: string;
    };
    followLabel: string;
    contactLabel: string;
    email: string;
    backToTop: string;
  };
  booking: {
    headline: string;
    headlineAccent: string;
    stepType: string;
    stepDate: string;
    stepSlot: string;
    stepForm: string;
    stepConfirm: string;
    duration: string;
    noSlots: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    confirm: string;
    submit: string;
    back: string;
    close: string;
    confirmed: string;
    meetLink: string;
    contactEmail: string;
    contactLabel: string;
    loading: string;
    slotTaken: string;
    error: string;
  };
  services: {
    slug: string;
    title: string;
    description: string;
    headline: string;
    subheadline: string;
    list: ServiceItem[];
    og: {
      title: string;
      description: string;
    };
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("../../locales/it.json").then((mod) => mod.default as Dictionary),
  en: () => import("../../locales/en.json").then((mod) => mod.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
