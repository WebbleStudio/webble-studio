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

export interface BottleneckItem {
  title: string;
  description: string;
}

export interface ImpactStat {
  value: string;
  suffix: string;
  label: string;
  description: string;
}

export interface AboutSplit {
  eyebrow: string;
  headline: string;
  body: string;
  image: string;
  imageAlt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
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
  about: {
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
    story: AboutSplit;
    mission: AboutSplit;
    team: {
      eyebrow: string;
      headline: string;
      body: string;
      members: TeamMember[];
    };
  };
  contact: {
    title: string;
    description: string;
    og: {
      title: string;
      description: string;
    };
    eyebrow: string;
    headline: string;
    subtitle: string;
    form: {
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      companyLabel: string;
      companyPlaceholder: string;
      budgetLabel: string;
      budgetPlaceholder: string;
      budgetOptions: string[];
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      termsPrefix: string;
      termsLink: string;
      termsAnd: string;
      privacyLink: string;
      successHeadline: string;
      successBody: string;
      errorRequired: string;
      errorEmail: string;
      errorGeneric: string;
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
  bottlenecks: {
    eyebrow: string;
    headline: string;
    body: string;
    items: BottleneckItem[];
  };
  impactStats: {
    items: ImpactStat[];
  };
  process: {
    eyebrow: string;
    headline: string;
    body: string;
    steps: ProcessStep[];
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
    ctaLabel: string;
    reviews: TestimonialReview[];
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
  portfolio: {
    slug: string;
    title: string;
    description: string;
    og: {
      title: string;
      description: string;
    };
    hero: {
      eyebrow: string;
      headline: string;
    };
    projects: {
      eyebrow: string;
      items: {
        name: string;
        category: string;
        image?: string;
        tags?: string[];
        slug?: string;
      }[];
    };
  };
  project: {
    labels: {
      client: string;
      industry: string;
      services: string;
      location: string;
      about: string;
      challengeAndSolution: string;
      challenge: string;
      solution: string;
      process: string;
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
