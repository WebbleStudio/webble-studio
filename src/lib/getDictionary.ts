import type { Locale } from "@/lib/locales";

export interface ServiceItem {
  name: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
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
    headline: string;
    subheadline: string;
    cta: string;
    ctaShort: string;
    ctaSecondary: string;
    og: {
      title: string;
      description: string;
    };
  };
  ourWork: {
    headline: string;
    projects: {
      name: string;
      description: string;
    }[];
  };
  problems: {
    headline: string;
    labels: string[];
  };
  process: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    steps: ProcessStep[];
  };
  payoff: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  counter: {
    count: string;
    label: string;
    body: string;
  };
  testimonials: {
    headline: string;
    reviews: {
      quote: string;
      authorName: string;
      authorRole: string;
      href?: string;
    }[];
  };
  faqs: {
    eyebrow: string;
    headline: string;
    moreQuestions: string;
    contactLabel: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    eyebrow: string;
    headline: string;
    body: string;
    buttonLabel: string;
  };
  homeServices: {
    image: string;
    items: {
      label: string;
    }[];
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
