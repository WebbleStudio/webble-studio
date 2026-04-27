interface ReviewCardProps {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorImageSrc?: string;
  companyLogoSrc?: string;
  /** If provided, wraps the card in an <a> and enables the hover glow (md+). */
  href?: string;
  /** Merged onto the root element (e.g. narrower max-width for desktop parallax layout). */
  className?: string;
}

const DEFAULT_QUOTE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const cardClass = (className?: string) =>
  `group relative flex w-full max-w-[600px] flex-col border border-foreground/20 bg-[#121212] p-6 md:p-8 ${className ?? ""}`;

function CardInner({
  quote,
  authorName,
  authorRole,
  authorImageSrc,
  companyLogoSrc,
  href,
}: ReviewCardProps) {
  return (
    <>
      {/* Inner glow — visible on hover when card is a link (md+) */}
      {href && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
          style={{
            boxShadow: "inset 0 0 40px 6px rgba(255, 92, 0, 0.12)",
            borderColor: "rgba(255, 92, 0, 0.25)",
          }}
        />
      )}

      <p className="text-foreground relative md:text-sm 2xl:text-base">{quote}</p>

      <div className="border-foreground/10 relative mt-6 flex items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-center gap-4">
          <img
            src={authorImageSrc}
            alt=""
            className="h-[30px] w-[30px] shrink-0 object-cover xs:h-[38px] xs:w-[38px]"
          />
          <div className="flex flex-col">
            <span className="text-foreground text-xs leading-4 xs:text-sm xs:leading-5">
              {authorName}
            </span>
            <span className="text-foreground/60 text-[10px] leading-[14px] xs:text-xs xs:leading-4">
              {authorRole}
            </span>
          </div>
        </div>

        <img
          src={companyLogoSrc}
          alt=""
          aria-hidden="true"
          className="h-[30px] w-auto shrink-0 object-contain xs:h-[38px]"
        />
      </div>
    </>
  );
}

export default function ReviewCard({
  quote = DEFAULT_QUOTE,
  authorName = "Marco Ibrahim",
  authorRole = "Ceo - Mavimatt",
  authorImageSrc = "/img/homepage/placeholder.png",
  companyLogoSrc = "/img/homepage/company-logos/mavimatt-logo.svg",
  href,
  className,
}: ReviewCardProps) {
  const inner = (
    <CardInner
      quote={quote}
      authorName={authorName}
      authorRole={authorRole}
      authorImageSrc={authorImageSrc}
      companyLogoSrc={companyLogoSrc}
      href={href}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass(className)}
      >
        {inner}
      </a>
    );
  }

  return <article className={cardClass(className)}>{inner}</article>;
}
