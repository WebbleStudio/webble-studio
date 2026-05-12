import Image from "next/image";
import type { Dictionary } from "@/lib/getDictionary";
import Eyebrow from "@/components/ui/Eyebrow";

interface BlogProps {
  dict: Dictionary["blog"];
}

/**
 * Blog teaser — header (eyebrow + H2 + "see more"), then a 3-up grid of
 * post cards (image / meta / title).
 */
export default function Blog({ dict }: BlogProps) {
  return (
    <section
      aria-label="Blog"
      className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]"
    >
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-4">
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <h2 className="text-fig-h2 text-white">{dict.headline}</h2>
        </div>

        <a
          href="#blog"
          className="text-fig-link inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white/85 transition-colors hover:border-white/30"
        >
          {dict.ctaLabel}
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 9L9 3M9 3H4M9 3V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </header>

      <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
        {dict.posts.map((post) => (
          <a
            key={post.title}
            href={post.href}
            className="group flex flex-col gap-4 overflow-hidden rounded-[8px]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-white/10 bg-black/40">
              <Image
                src={post.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-col gap-2 px-1 pb-2">
              <p className="text-fig-eyebrow text-silver">
                {post.category} · {post.date}
              </p>
              <h3 className="text-fig-h4 text-white group-hover:text-white/80 transition-colors">
                {post.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
