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
  if (locale !== "it") return {};

  const dict = await getDictionary("it");

  return generatePageMetadata(
    {
      locale: "it",
      pathSegment: "i-nostri-lavori",
      title: dict.portfolio.title,
      description: dict.portfolio.description,
      ogTitle: dict.portfolio.og.title,
      ogDescription: dict.portfolio.og.description,
    },
    { it: "i-nostri-lavori", en: "our-work" }
  );
}

export default async function INostriLavoriPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "it") notFound();

  const dict = await getDictionary("it");

  return (
    <>
      <Hero
        eyebrow={dict.portfolio.hero.eyebrow}
        headline={dict.portfolio.hero.headline}
      />
      <Projects
        eyebrow={dict.portfolio.projects.eyebrow}
        items={dict.portfolio.projects.items}
        locale="it"
      />
      <Cta dict={dict.cta} />
    </>
  );
}
