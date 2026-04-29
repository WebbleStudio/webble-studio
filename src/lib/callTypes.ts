export interface CallType {
  id: string;
  label: Record<"it" | "en", string>;
  description: Record<"it" | "en", string>;
  duration: number; // minuti
}

export const CALL_TYPES: CallType[] = [
  {
    id: "intro",
    label: { it: "Intro Call", en: "Intro Call" },
    description: {
      it: "Una breve chiamata per conoscerci e capire le tue esigenze.",
      en: "A short call to get to know each other and understand your needs.",
    },
    duration: 15,
  },
  {
    id: "consulenza",
    label: { it: "Consulenza", en: "Consultation" },
    description: {
      it: "Analizziamo insieme il tuo progetto e definiamo la strategia migliore.",
      en: "We analyze your project together and define the best strategy.",
    },
    duration: 30,
  },
  {
    id: "deep-dive",
    label: { it: "Deep Dive", en: "Deep Dive" },
    description: {
      it: "Sessione approfondita per progetti complessi e piani d'azione dettagliati.",
      en: "In-depth session for complex projects and detailed action plans.",
    },
    duration: 60,
  },
];

export function getCallType(id: string): CallType | undefined {
  return CALL_TYPES.find((t) => t.id === id);
}
