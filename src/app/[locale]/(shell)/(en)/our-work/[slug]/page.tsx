import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/getDictionary";
import { generatePageMetadata } from "@/lib/metadata";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  localizedField,
} from "@/data/projects";
import Hero from "@/components/sections/project/Hero";
import Info from "@/components/sections/project/Info";
import About from "@/components/sections/project/About";
import Gallery from "@/components/sections/project/Gallery";
import InstagramReels from "@/components/sections/project/InstagramReels";
import ChallengeAndSolution from "@/components/sections/project/ChallengeAndSolution";
import Process from "@/components/sections/project/Process";
import Cta from "@/components/sections/Cta";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en") return {};

  const project = getProjectBySlug(slug);
  if (!project) return {};

  return generatePageMetadata(
    {
      locale: "en",
      pathSegment: `our-work/${slug}`,
      title: `${project.name} — Webble Studio`,
      description: localizedField(project.about, "en").slice(0, 160),
      ogTitle: `${project.name} — Webble Studio`,
    },
    { it: `i-nostri-lavori/${slug}`, en: `our-work/${slug}` }
  );
}

export default async function ProjectPageEN({ params }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== "en") notFound();

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const dict = await getDictionary("en");
  const loc = "en" as const;
  const labels = dict.project.labels;

  const about = localizedField(project.about, loc);

  return (
    <>
      {/* 1. Hero */}
      <Hero
        name={project.name}
        subtitle={localizedField(project.subtitle, loc)}
        tags={project.tags}
        heroImage={project.heroImage}
      />

      {/* 2. Info */}
      <Info
        items={[
          { label: labels.client,   value: localizedField(project.info.client, loc) },
          { label: labels.industry, value: localizedField(project.info.industry, loc) },
          { label: labels.services, value: localizedField(project.info.services, loc) },
          { label: labels.location, value: localizedField(project.info.location, loc) },
        ]}
      />

      {/* 3. About */}
      <About label={labels.about} body={about} />

      {/* 4. Media */}
      {project.reels && project.reels.length > 0 ? (
        <InstagramReels reels={project.reels} className="pb-12 md:pb-20" />
      ) : (
        <Gallery
          layout="bento"
          className="pb-12 md:pb-20"
          images={project.galleryImages?.slice(0, 3)}
          alt={project.name}
        />
      )}

      {/* 5. Challenge & Solution */}
      <ChallengeAndSolution
        sectionLabel={labels.challengeAndSolution}
        challengeLabel={labels.challenge}
        challengeBody={localizedField(project.challenge, loc)}
        solutionLabel={labels.solution}
        solutionBody={localizedField(project.solution, loc)}
      />

      {/* 6. Process */}
      <Process label={labels.process} steps={project.process} locale={loc} />

      {/* 7. Remaining gallery */}
      {(() => {
        const g = project.galleryImages ?? [];
        const o = project.reels ? 0 : 3;
        if (g.length <= o) return null;
        return (
          <div className="flex flex-col gap-3 pt-12 pb-12 md:gap-4 md:pt-20 md:pb-20">
            <Gallery layout="full" images={g.slice(o, o + 1)} alt={project.name} />
            {g.length > o + 1 && (
              <Gallery layout="grid" images={g.slice(o + 1, o + 3)} alt={project.name} />
            )}
            {g.length > o + 3 && (
              <Gallery layout="full" images={g.slice(o + 3, o + 4)} alt={project.name} />
            )}
            {g.length > o + 4 && (
              <Gallery layout="grid" images={g.slice(o + 4, o + 6)} alt={project.name} />
            )}
          </div>
        );
      })()}

      {/* 8. CTA */}
      <Cta dict={dict.cta} />
    </>
  );
}
