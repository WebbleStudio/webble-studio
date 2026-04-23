import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, locales } from "@/lib/locales";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Payoff from "@/components/sections/Payoff";
import Container from "@/components/layout/Container";
import Spacer from "@/components/layout/Spacer";
import Process from "@/components/sections/Process";
import OurWork from "@/components/sections/OurWork";
import Problems from "@/components/sections/Problems";
import Services from "@/components/sections/Services";
import Counter from "@/components/sections/Counter";
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
      <Hero dict={dict.home} />
      <Container>
        <Payoff dict={dict.payoff} />
        <Spacer />
        <Process dict={dict.process} />
        <Spacer />
        <OurWork dict={dict.ourWork} />
        <Spacer />
        <Problems dict={dict.problems} />
        <Spacer />
        <Services dict={dict.homeServices} />
        <Spacer />
        <Counter dict={dict.counter} />
        <Spacer />
      </Container>
      <Testimonials dict={dict.testimonials} />
      <Spacer />
      <Container>
        <Faqs dict={dict.faqs} />
        <Spacer />
      </Container>
      <Cta dict={dict.cta} />
    </>
  );
}
