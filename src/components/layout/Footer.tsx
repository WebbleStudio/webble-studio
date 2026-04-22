import type { Locale } from "@/lib/locales";
import type { Dictionary } from "@/lib/getDictionary";
import AnimatedFooterLogo from "@/components/animations/AnimatedFooterLogo";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Site footer.
 *
 * Responsive layout strategy:
 *  - Desktop (md+): 3-column grid [logo | nav | socials] with dedicated top
 *    title row and bottom email row, all enclosed in horizontal dividers.
 *  - Mobile: the grid collapses to a single column (top → bottom): title,
 *    orange logo banner (full width, shorter height), nav list, socials,
 *    email row. The visual hierarchy and divider rhythm is preserved so the
 *    mobile variant feels like a compressed version of the same design, not
 *    a different component.
 */
export default function Footer({ locale, dict }: FooterProps) {
  const navLinks = [
    { label: dict.footer.nav.home, href: `/${locale}` },
    { label: dict.footer.nav.about, href: `/${locale}/about` },
    { label: dict.footer.nav.portfolio, href: `/${locale}/our-work` },
    { label: dict.footer.nav.contact, href: `/${locale}/contact` },
  ];

  const socials: { label: string; href: string }[] = [
    { label: "X.com", href: "#" },
    { label: "Linkedin", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Tiktok", href: "#" },
    { label: "Youtube", href: "#" },
  ];

  return (
    <footer className="border-foreground/20 mt-24 w-full border-t md:mt-32">
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]">
        {/* Top row: big title + diagonal arrow (arrow height = 2× title line-height) */}
        <div className="border-foreground/20 flex items-center justify-between gap-6 border-b py-6 md:py-8">
          <h2 className="font-hero text-foreground text-[20px] leading-[1] tracking-[-2px] uppercase sm:text-[52px] md:text-[40px]">
            {dict.footer.title}
          </h2>
          <a
            href="#top"
            aria-label={dict.footer.backToTop}
            className="group flex h-[40px] shrink-0 items-center justify-center sm:h-[104px] md:h-[80px]"
          >
            <img
              src="/icons/empty-arrow.svg"
              alt=""
              aria-hidden="true"
              className="h-full w-auto transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        {/* Main grid: logo | nav | socials — boxed.
            Padding is applied per-cell so the orange box fills its own cell
            flush against the outer border, while nav and socials get breathing room. */}
        <div className="border-foreground/20 my-6 grid border md:my-8 md:grid-cols-[200px_1fr_auto]">
          {/* Orange logo box — flush, no padding around it. Eyes animate on scroll. */}
          <div className="bg-accent flex h-32 w-full items-center justify-center p-8 md:aspect-square md:h-auto">
            <AnimatedFooterLogo />
          </div>

          {/* Nav links.
              Horizontal padding is applied per-link, not on the <nav>, so the
              separators between items span the full nav cell and visually
              touch the adjacent cells (orange box on the left, socials on the right). */}
          <nav aria-label="Footer navigation">
            <ul>
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  className="border-foreground/20 border-b"
                >
                  <a
                    href={link.href}
                    className="group text-foreground flex items-center justify-between gap-4 px-4 py-4 font-sans text-sm font-medium md:px-6"
                  >
                    <span>{link.label}</span>
                    <img
                      src="/icons/diagonal-arrow.svg"
                      alt=""
                      aria-hidden="true"
                      width={18}
                      height={18}
                      className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials — two columns (3 + 2) */}
          <div className="p-4 md:p-6">
            <p className="text-accent font-medium uppercase">
              {dict.footer.followLabel}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {[socials.slice(0, 3), socials.slice(3)].map((group, gi) => (
                <ul key={gi} className="flex flex-col gap-3">
                  {group.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-accent font-sans text-sm font-medium transition-colors"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: email + arrow button */}
        <div className="flex flex-col items-start justify-between gap-4 pb-6 sm:flex-row sm:items-center md:pb-8">
          <div className="flex flex-col gap-1">
            <p className="text-accent font-medium uppercase">
              {dict.footer.contactLabel}
            </p>
            <a
              href={`mailto:${dict.footer.email}`}
              className="font-sans text-foreground text-[18px] font-semibold sm:text-[22px] md:text-[24px]"
            >
              {dict.footer.email}
            </a>
          </div>
          <a
            href={`mailto:${dict.footer.email}`}
            aria-label={dict.footer.contactLabel}
            className="group hidden h-12 w-12 shrink-0 items-center justify-center self-end bg-[#0d0d0d] sm:flex sm:self-auto"
          >
            <img
              src="/icons/diagonal-arrow.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
