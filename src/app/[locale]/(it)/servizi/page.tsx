import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";

/**
 * Italian-language services page.
 * This route is only valid when locale === "it". Any other locale hitting
 * /[locale]/servizi receives a 404, because the English route uses /services.
 */

interface ServiziPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServiziPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "it") return {};

  const dict = await getDictionary("it");

  return generatePageMetadata(
    {
      locale: "it",
      pathSegment: "servizi",
      title: dict.services.title,
      description: dict.services.description,
      ogTitle: dict.services.og.title,
      ogDescription: dict.services.og.description,
    },
    { it: "servizi", en: "services" }
  );
}

export default async function ServiziPage({ params }: ServiziPageProps) {
  const { locale } = await params;
  if (locale !== "it") notFound();

  const dict = await getDictionary("it");

  return <></>;
}
