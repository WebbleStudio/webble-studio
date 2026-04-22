interface ReviewCardProps {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorImageSrc?: string;
  companyLogoSrc?: string;
}

const DEFAULT_QUOTE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function ReviewCard({
  quote = DEFAULT_QUOTE,
  authorName = "Marco Ibrahim",
  authorRole = "Ceo - Mavimatt",
  authorImageSrc = "/img/homepage/placeholder.png",
  companyLogoSrc = "/img/homepage/company-logos/mavimatt-logo.svg",
}: ReviewCardProps) {
  return (
    <article className="flex w-full max-w-[600px] flex-col bg-[#121212] p-6 md:p-8">
      <p className="text-foreground">{quote}</p>

      {/* Footer: author (photo + text) and company logo.
          Line heights are explicit so the two text rows sum to exactly 30px,
          which is then mirrored by the photo and the logo — all three
          elements share the same height. */}
      <div className="border-foreground/10 mt-6 flex items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-center gap-4">
          <img src={authorImageSrc} alt="" className="h-[30px] w-[30px] shrink-0 object-cover" />
          <div className="flex flex-col">
            <span className="text-foreground text-xs leading-4">{authorName}</span>
            <span className="text-foreground/60 text-[10px] leading-[14px]">{authorRole}</span>
          </div>
        </div>

        <img
          src={companyLogoSrc}
          alt=""
          aria-hidden="true"
          className="h-[30px] w-auto shrink-0 object-contain"
        />
      </div>
    </article>
  );
}
