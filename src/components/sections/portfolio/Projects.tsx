import ProjectCard from "@/components/ui/ProjectCard";
import AnimatedStaggerChildren from "@/components/animations/AnimatedStaggerChildren";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getProjectBySlug, projects as allProjects } from "@/data/projects";
import type { Locale } from "@/lib/locales";

interface ProjectItem {
  name: string;
  category: string;
  image?: string;
  tags?: string[];
  slug?: string;
}

interface ProjectsProps {
  eyebrow: string;
  items: ProjectItem[];
  locale: Locale;
}

const PORTFOLIO_SLUG: Record<Locale, string> = {
  it: "i-nostri-lavori",
  en: "our-work",
};

export default function Projects({ eyebrow, items, locale }: ProjectsProps) {
  const portfolioPath = PORTFOLIO_SLUG[locale];

  return (
    <section aria-label="Projects" className="bg-background">
      <div className="mx-auto w-full max-w-[1300px] px-6 py-16 md:px-8 md:py-24 2xl:max-w-[1650px]">
        <RevealGroup>
          <RevealItem>
            <p className="text-fig-eyebrow text-foreground/40 mb-10 md:mb-14">
              {eyebrow}
            </p>
          </RevealItem>
        </RevealGroup>

        <AnimatedStaggerChildren
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5"
          stagger={0.1}
        >
          {items.map((project, i) => {
            const slug =
              project.slug ??
              allProjects.find((p) => p.name === project.name)?.slug ??
              project.name.toLowerCase().replace(/\s+/g, "-");
            const projectExists = getProjectBySlug(slug);
            const href = projectExists
              ? `/${locale}/${portfolioPath}/${slug}`
              : undefined;

            return (
              <ProjectCard
                key={i}
                name={project.name}
                category={project.category}
                href={href}
                image={project.image}
                tags={project.tags}
              />
            );
          })}
        </AnimatedStaggerChildren>
      </div>
    </section>
  );
}
