import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, locales } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import CompanyLogos from "@/components/sections/CompanyLogos";
import Bottlenecks from "@/components/sections/Bottlenecks";
import CaseStudies from "@/components/sections/CaseStudies";
import ImpactStats from "@/components/sections/ImpactStats";
import HowItWorks from "@/components/sections/HowItWorks";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import Faqs from "@/components/sections/Faqs";
import Cta from "@/components/sections/Cta";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
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

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Hero hero={dict.home.hero} />

      <CompanyLogos dict={dict.companies} />

      <div aria-hidden="true" className="h-[10vh]" />
      <Bottlenecks dict={dict.bottlenecks} />

      <div aria-hidden="true" className="h-[15vh]" />
      <CaseStudies dict={dict.caseStudies} />

      {/* Wider gap on desktop so the stacking deck has fully scrolled out
          of the viewport before the stats grid enters — otherwise the two
          sections briefly share viewport space while the deck unsticks. */}
      <div aria-hidden="true" className="h-[40vh] lg:h-[65vh]" />
      <ImpactStats dict={dict.impactStats} />

      <SectionGap />
      <HowItWorks dict={dict.process} />

      <SectionGap />
      <Services dict={dict.homeServices} />

      <SectionGap />
      <WhyUs dict={dict.whyUs} />

      <SectionGap />
      <Testimonials dict={dict.testimonials} />

      <SectionGap />
      <Faqs dict={dict.faqs} />

      <SectionGap />
      <Cta dict={dict.cta} />
    </>
  );
}

/**
 * Vertical rhythm between sections — denser on mobile, more breathing room on
 * desktop, matching the proportions in the Figma reference.
 */
function SectionGap() {
  return <div aria-hidden="true" className="h-[40vh]" />;
}
