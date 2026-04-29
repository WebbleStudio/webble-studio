import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import HostingCard from "./HostingCard";
import FloatingChatWidget from "@/components/ui/FloatingChatWidget";
import BookingModal from "@/components/ui/BookingModal";

interface HostingPageProps {
  params: Promise<{ locale: string }>;
}

const t = {
  it: {
    metaTitle: "Hosting — Webble Studio",
    metaDesc: "Attiva o rinnova il piano hosting del tuo sito Webble Studio.",
    eyebrow: "Hosting",
    title: <>Paga ora <br /> il tuo hosting</>,
    subtitle: (
      <>
        Attiva o rinnova il piano hosting per il tuo sito.{" "}
        <br />
        Pagamento sicuro, attivazione immediata.
      </>
    ),
    copyright: "Tutti i diritti riservati.",
    card: {
      monthly: "Mensile",
      yearly: "Annuale",
      monthlyBadge: "Piano mensile",
      yearlyBadge: "Piano annuale",
      perMonth: "/ mese",
      perYear: "/ anno",
      monthlyDesc: "Rinnovo automatico mensile.",
      yearlyDesc: "Equivale a ~€16,65/mese.",
      featuresLabel: "Incluso nel piano",
      features: [
        "Hosting su server europei ad alte prestazioni",
        "Certificato SSL incluso e rinnovo automatico",
        "Backup giornalieri automatici",
        "Aggiornamenti di sicurezza continui",
        "Uptime garantito 99.9%",
        "Supporto tecnico prioritario",
      ],
      cta: "Paga ora",
      questions: "Hai domande?",
      contact: "Contattaci",
    },
  },
  en: {
    metaTitle: "Hosting — Webble Studio",
    metaDesc: "Activate or renew your Webble Studio website hosting plan.",
    eyebrow: "Hosting",
    title: <>Pay now <br /> for your hosting</>,
    subtitle: (
      <>
        Activate or renew your website hosting plan.{" "}
        <br />
        Secure payment, immediate activation.
      </>
    ),
    copyright: "All rights reserved.",
    card: {
      monthly: "Monthly",
      yearly: "Yearly",
      monthlyBadge: "Monthly plan",
      yearlyBadge: "Yearly plan",
      perMonth: "/ mo",
      perYear: "/ yr",
      monthlyDesc: "Automatic monthly renewal.",
      yearlyDesc: "Equivalent to ~€16.65/month.",
      featuresLabel: "Included in the plan",
      features: [
        "Hosting on high-performance European servers",
        "SSL certificate included with automatic renewal",
        "Automatic daily backups",
        "Continuous security updates",
        "99.9% guaranteed uptime",
        "Priority technical support",
      ],
      cta: "Pay now",
      questions: "Have questions?",
      contact: "Contact us",
    },
  },
} as const;

export async function generateMetadata({ params }: HostingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = isValidLocale(locale) ? (locale as "it" | "en") : "it";
  return {
    title: t[lang].metaTitle,
    description: t[lang].metaDesc,
  };
}

export default async function HostingPage({ params }: HostingPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const lang = locale as "it" | "en";
  const copy = t[lang];
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-6 py-16 md:px-8">
        <div className="mx-auto w-full max-w-[1300px] 2xl:max-w-[1650px]">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-12">
            {/* ── Left ──────────────────────────────────────────────── */}
            <div className="flex flex-1 justify-center">
              <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left lg:max-w-[480px]">
                <p className="text-accent text-[14px] font-medium uppercase md:text-base">
                  {copy.eyebrow}
                </p>
                <h1 className="font-hero text-foreground text-[28px] uppercase tracking-[-2px] xl:text-[38px]">
                  {copy.title}
                </h1>
                <p className="max-w-[400px] lg:max-w-none">{copy.subtitle}</p>
              </div>
            </div>

            {/* ── Right: card ───────────────────────────────────────── */}
            <div className="flex flex-1 justify-center">
              <HostingCard translations={copy.card} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright strip ───────────────────────────────────────── */}
      <footer className="border-t border-foreground/10 px-6 py-5 md:px-8">
        <p className="text-center font-sans text-[12px] text-foreground/30">
          © {new Date().getFullYear()} Webble Studio. {copy.copyright}
        </p>
      </footer>

      <FloatingChatWidget />
      <BookingModal dict={dict} />
    </div>
  );
}
