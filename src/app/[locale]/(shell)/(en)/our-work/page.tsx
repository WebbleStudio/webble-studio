import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/portfolio/Hero";
import Projects from "@/components/sections/portfolio/Projects";
import Cta from "@/components/sections/Cta";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};

  const dict = await getDictionary("en");

  return generatePageMetadata(
    {
      locale: "en",
      pathSegment: "our-work",
      title: dict.portfolio.title,
      description: dict.portfolio.description,
      ogTitle: dict.portfolio.og.title,
      ogDescription: dict.portfolio.og.description,
    },
    { it: "i-nostri-lavori", en: "our-work" }
  );
}

export default async function OurWorkPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const dict = await getDictionary("en");

  return (
    <>
      <Hero
        eyebrow={dict.portfolio.hero.eyebrow}
        headline={dict.portfolio.hero.headline}
      />
      <Projects
        eyebrow={dict.portfolio.projects.eyebrow}
        items={dict.portfolio.projects.items}
        locale="en"
      />
      <Cta dict={dict.cta} />
    </>
  );
}
