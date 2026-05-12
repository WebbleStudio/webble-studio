import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { isValidLocale, locales } from "@/lib/locales";
import {
  getDictionary,
  type AboutSplit,
  type Dictionary,
  type TeamMember,
} from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import Eyebrow from "@/components/ui/Eyebrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return generatePageMetadata({
    locale,
    pathSegment: "about",
    title: dict.about.title,
    description: dict.about.description,
    ogTitle: dict.about.og.title,
    ogDescription: dict.about.og.description,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { about } = dict;

  return (
    <>
      <Hero hero={about.hero} secondaryCtaHref="#team" />

      <SectionGap />
      <SplitSection content={about.story} side="left" />

      <SectionGap />
      <SplitSection content={about.mission} side="right" />

      <SectionGap />
      <TeamSection team={about.team} />

      <SectionGap />
    </>
  );
}

/**
 * Two-column split — "side" determines which side the text sits on.
 *   side="left"  → text left, image right
 *   side="right" → text right, image left   (achieved with md:flex-row-reverse)
 *
 * Both columns top-align (`items-start`) so the eyebrow and the top edge of
 * the image share the same baseline. The image is square (1:1). On mobile
 * the layout stacks (image always above text) for a predictable reading order.
 */
function SplitSection({
  content,
  side,
}: {
  content: AboutSplit;
  side: "left" | "right";
}) {
  const reverseClass = side === "right" ? "md:flex-row-reverse" : "";

  return (
    <section
      aria-label={content.headline}
      className="mx-auto w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]"
    >
      <div className={`flex flex-col items-stretch gap-10 md:flex-row md:items-start md:gap-24 2xl:gap-32 ${reverseClass}`}>
        {/* Text column — sticks to the top of the viewport on desktop so it
            travels with the user until the bottom of the section, mirroring
            the home FAQ split. */}
        <RevealGroup
          staggerDelay={0.1}
          className="flex flex-1 flex-col items-start gap-5 md:sticky md:top-32 md:max-w-[480px] md:self-start md:pt-2"
        >
          <RevealItem>
            <Eyebrow>{content.eyebrow}</Eyebrow>
          </RevealItem>
          <RevealItem>
            <h2 className="text-fig-h2 text-white">{content.headline}</h2>
          </RevealItem>
          <RevealItem>
            <p className="text-fig-body text-silver">{content.body}</p>
          </RevealItem>
        </RevealGroup>

        {/* Image column */}
        <Reveal y={32} className="flex-1">
          <div className="relative aspect-square w-full overflow-hidden border border-white/10 bg-black/40">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Team section — centered intro (eyebrow / headline / body) followed by a
 * 3×3 grid of nine portrait photos (3:4 aspect, "verticale"). Holds the same
 * 3-column layout at every breakpoint to honour the explicit 3×3 request,
 * with tighter gaps on mobile so the cards stay legible.
 */
function TeamSection({ team }: { team: Dictionary["about"]["team"] }) {
  return (
    <section
      id="team"
      aria-label={team.headline}
      className="mx-auto w-full max-w-[1140px] px-6 md:px-8 2xl:max-w-[1340px]"
    >
      <RevealGroup
        staggerDelay={0.1}
        className="mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center"
      >
        <RevealItem>
          <Eyebrow>{team.eyebrow}</Eyebrow>
        </RevealItem>
        <RevealItem>
          <h2 className="text-fig-h2 text-white">{team.headline}</h2>
        </RevealItem>
        <RevealItem>
          <p className="text-fig-body text-silver">{team.body}</p>
        </RevealItem>
      </RevealGroup>

      <RevealGroup
        staggerDelay={0.06}
        className="mt-12 grid grid-cols-3 gap-3 sm:gap-5 md:mt-16 md:gap-6 2xl:mt-20"
      >
        {team.members.map((member) => (
          <RevealItem key={member.name} y={20}>
            <TeamCard member={member} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col gap-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-black/40">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 33vw, 380px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-fig-h5 text-white">{member.name}</h3>
        <p className="text-fig-eyebrow text-silver">{member.role}</p>
      </div>
    </article>
  );
}

function SectionGap() {
  return <div aria-hidden="true" className="h-[20vh] md:h-[30vh]" />;
}
