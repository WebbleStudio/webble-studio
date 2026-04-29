import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";

/**
 * English-language services page.
 * This route is only valid when locale === "en". Any other locale hitting
 * /[locale]/services receives a 404, because the Italian route uses /servizi.
 */

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};

  const dict = await getDictionary("en");

  return generatePageMetadata(
    {
      locale: "en",
      pathSegment: "services",
      title: dict.services.title,
      description: dict.services.description,
      ogTitle: dict.services.og.title,
      ogDescription: dict.services.og.description,
    },
    { it: "servizi", en: "services" }
  );
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();

  const dict = await getDictionary("en");

  return <></>;
}
