import type { Locale } from "@/lib/locales";

interface LocalizedText {
  it: string;
  en: string;
}

export interface ProjectProcessStep {
  title: LocalizedText;
  items: LocalizedText[];
}

export interface Project {
  slug: string;
  name: string;
  subtitle: LocalizedText;
  tags: string[];
  info: {
    client: LocalizedText;
    industry: LocalizedText;
    services: LocalizedText;
    location: LocalizedText;
  };
  about: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  process: ProjectProcessStep[];
  heroImage?: string;
  galleryImages?: string[];
  reels?: {
    video: string;
    thumbnail: string;
    instagramUrl: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "mavimatt",
    name: "Mavimatt",
    subtitle: { it: "Company profile", en: "Company profile" },
    tags: ["Brand identity", "Visual identity", "Printed media"],
    info: {
      client: { it: "Mavimatt", en: "Mavimatt" },
      industry: { it: "Interior design", en: "Interior design" },
      services: { it: "Branding e design", en: "Branding and design" },
      location: { it: "Italia", en: "Italy" },
    },
    about: {
      it: "Mavimatt è un brand italiano di arredamento di lusso con una forte identità visiva radicata nella qualità artigianale. Il progetto ha richiesto la progettazione di un company profile che riflettesse i valori del brand: eleganza, precisione e attenzione al dettaglio.",
      en: "Mavimatt is an Italian luxury furniture brand with a strong visual identity rooted in artisanal quality. The project required designing a company profile that reflected the brand's values: elegance, precision and attention to detail.",
    },
    challenge: {
      it: "Tradurre in formato stampato l'identità di un brand che vive di emozione visiva e qualità materica, mantenendo coerenza con il linguaggio digitale già consolidato.",
      en: "Translating the identity of a brand that thrives on visual emotion and material quality into a printed format, while maintaining consistency with the established digital language.",
    },
    solution: {
      it: "Abbiamo integrato l'identità visiva di Mavimatt in un company profile che usa spazio bianco, tipografia raffinata e fotografia di prodotto per comunicare lusso e competenza.",
      en: "We integrated Mavimatt's visual identity into a company profile that uses white space, refined typography and product photography to communicate luxury and expertise.",
    },
    process: [
      {
        title: { it: "Discovery", en: "Discovery" },
        items: [
          { it: "Briefing", en: "Briefing" },
          { it: "Analisi del brand", en: "Brand analysis" },
          { it: "Roadmap", en: "Roadmap" },
          { it: "Moodboard", en: "Moodboard" },
        ],
      },
      {
        title: { it: "Design", en: "Design" },
        items: [
          { it: "Architettura visiva", en: "Visual architecture" },
          { it: "Layout e griglia", en: "Layout & grid" },
          { it: "Tipografia", en: "Typography" },
          { it: "Revisioni", en: "Revisions" },
        ],
      },
      {
        title: { it: "Produzione", en: "Production" },
        items: [
          { it: "File print-ready", en: "Print-ready files" },
          { it: "Specifiche stampa", en: "Print specs" },
          { it: "Revisione finale", en: "Final review" },
          { it: "Consegna", en: "Delivery" },
        ],
      },
      {
        title: { it: "Post-lancio", en: "Post-launch" },
        items: [
          { it: "Feedback", en: "Feedback" },
          { it: "Ottimizzazioni", en: "Optimisations" },
          { it: "Asset digitali", en: "Digital assets" },
          { it: "Supporto", en: "Support" },
        ],
      },
    ],
    heroImage: "/img/homepage/placeholder.png",
    galleryImages: [
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
    ],
  },
  {
    slug: "holdup-agency",
    name: "Holdup Agency",
    subtitle: { it: "Sito web & branding", en: "Website & branding" },
    tags: ["Web design", "Sviluppo web", "Brand identity"],
    info: {
      client: { it: "Holdup Agency", en: "Holdup Agency" },
      industry: { it: "Agenzia creativa", en: "Creative agency" },
      services: { it: "Design e sviluppo", en: "Design and development" },
      location: { it: "Italia", en: "Italy" },
    },
    about: {
      it: "Un sito che racconta la visione di un'agenzia creativa attraverso un design audace e memorabile. Ogni sezione è stata pensata per comunicare personalità e competenza.",
      en: "A website that tells the story of a creative agency through bold and memorable design. Every section was crafted to communicate personality and expertise.",
    },
    challenge: {
      it: "Costruire un'identità digitale forte che distinguesse l'agenzia in un mercato saturo, senza cadere in cliché del settore creativo.",
      en: "Building a strong digital identity that would set the agency apart in a saturated market, without falling into creative industry clichés.",
    },
    solution: {
      it: "Design system custom con tipografia espressiva, micro-animazioni GSAP e un layout non convenzionale che riflette l'approccio creativo dell'agenzia.",
      en: "Custom design system with expressive typography, GSAP micro-animations and an unconventional layout that reflects the agency's creative approach.",
    },
    process: [
      {
        title: { it: "Strategia", en: "Strategy" },
        items: [
          { it: "Posizionamento", en: "Positioning" },
          { it: "Analisi competitor", en: "Competitor analysis" },
          { it: "Architettura info", en: "Info architecture" },
          { it: "Wireframe", en: "Wireframes" },
        ],
      },
      {
        title: { it: "Design", en: "Design" },
        items: [
          { it: "Design system", en: "Design system" },
          { it: "UI mockup", en: "UI mockups" },
          { it: "Animazioni", en: "Animations" },
          { it: "Revisioni", en: "Revisions" },
        ],
      },
      {
        title: { it: "Sviluppo", en: "Development" },
        items: [
          { it: "Next.js", en: "Next.js" },
          { it: "GSAP", en: "GSAP" },
          { it: "CMS", en: "CMS" },
          { it: "Performance", en: "Performance" },
        ],
      },
      {
        title: { it: "Lancio", en: "Launch" },
        items: [
          { it: "QA testing", en: "QA testing" },
          { it: "SEO tecnico", en: "Technical SEO" },
          { it: "Deploy", en: "Deploy" },
          { it: "Monitoraggio", en: "Monitoring" },
        ],
      },
    ],
    heroImage: "/img/homepage/placeholder.png",
    galleryImages: [
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
    ],
  },
  {
    slug: "x2m-creative",
    name: "X2M Creative",
    subtitle: { it: "Piattaforma B2B", en: "B2B platform" },
    tags: ["Web design", "Sviluppo web", "UX/UI"],
    info: {
      client: { it: "X2M Creative", en: "X2M Creative" },
      industry: { it: "Media & content", en: "Media & content" },
      services: { it: "Design e sviluppo", en: "Design and development" },
      location: { it: "Italia", en: "Italy" },
    },
    about: {
      it: "Piattaforma digitale B2B progettata per massimizzare le performance e semplificare i processi. Un prodotto che scala con il business del cliente.",
      en: "A B2B digital platform engineered for peak performance and streamlined operations. A product that scales with the client's business.",
    },
    challenge: {
      it: "Progettare una piattaforma B2B complessa che fosse intuitiva per utenti non tecnici, mantenendo la profondità funzionale richiesta dal business.",
      en: "Designing a complex B2B platform that would be intuitive for non-technical users while maintaining the functional depth required by the business.",
    },
    solution: {
      it: "Architettura informativa semplificata con dashboard modulare, onboarding progressivo e pattern UX collaudati per ridurre la curva di apprendimento.",
      en: "Simplified information architecture with a modular dashboard, progressive onboarding and proven UX patterns to reduce the learning curve.",
    },
    process: [
      {
        title: { it: "Research", en: "Research" },
        items: [
          { it: "User interviews", en: "User interviews" },
          { it: "Journey map", en: "Journey map" },
          { it: "Pain points", en: "Pain points" },
          { it: "Requisiti", en: "Requirements" },
        ],
      },
      {
        title: { it: "UX Design", en: "UX Design" },
        items: [
          { it: "Flussi utente", en: "User flows" },
          { it: "Prototyping", en: "Prototyping" },
          { it: "Usability test", en: "Usability test" },
          { it: "Iterazioni", en: "Iterations" },
        ],
      },
      {
        title: { it: "UI & Dev", en: "UI & Dev" },
        items: [
          { it: "Design system", en: "Design system" },
          { it: "Component lib", en: "Component lib" },
          { it: "API integration", en: "API integration" },
          { it: "Testing", en: "Testing" },
        ],
      },
      {
        title: { it: "Rilascio", en: "Release" },
        items: [
          { it: "Beta testing", en: "Beta testing" },
          { it: "Training", en: "Training" },
          { it: "Deploy", en: "Deploy" },
          { it: "Supporto", en: "Support" },
        ],
      },
    ],
    heroImage: "/img/homepage/placeholder.png",
    galleryImages: [
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
      "/img/homepage/placeholder.png",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function localizedField(field: LocalizedText, locale: Locale): string {
  return field[locale];
}
