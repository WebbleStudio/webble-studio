import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, locales } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import CompanyLogos from "@/components/sections/CompanyLogos";
import CaseStudies from "@/components/sections/CaseStudies";
import HowItWorks from "@/components/sections/HowItWorks";
import Integrations from "@/components/sections/Integrations";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Blog from "@/components/sections/Blog";
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

      <SectionGap />
      <CaseStudies dict={dict.caseStudies} />

      <SectionGap />
      <HowItWorks dict={dict.process} />

      <SectionGap />
      <Integrations dict={dict.integrations} />

      <SectionGap />
      <Services dict={dict.homeServices} />

      <SectionGap />
      <WhyUs dict={dict.whyUs} />

      <SectionGap />
      <Testimonials dict={dict.testimonials} />

      <SectionGap />
      <Pricing dict={dict.pricing} />

      <SectionGap />
      <Blog dict={dict.blog} />

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
  return <div aria-hidden="true" className="h-20 md:h-28 2xl:h-36" />;
}
