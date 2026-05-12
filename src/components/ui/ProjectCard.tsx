import Image from "next/image";

interface ProjectCardProps {
  name: string;
  category: string;
  href?: string;
  image?: string;
  tags?: string[];
}

export default function ProjectCard({ name, category, href, image, tags }: ProjectCardProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="group relative cursor-pointer overflow-hidden rounded-[4px]"
    >
      {image ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            className="scale-[1.01] object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="bg-foreground/10 aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.02]" />
      )}

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Text bottom-left */}
      <div className="absolute bottom-0 left-0 p-5 md:p-6">
        <h3 className="text-fig-h4 text-white">
          {name}
        </h3>
        <p className="text-fig-body mt-1 text-white/60">
          {tags && tags.length > 0 ? tags.join(" · ") : category}
        </p>
      </div>
    </Wrapper>
  );
}
