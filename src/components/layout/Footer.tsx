import type { Locale } from "@/lib/locales";
import type { Dictionary } from "@/lib/getDictionary";
import AnimatedFooterLogo from "@/components/animations/AnimatedFooterLogo";
import AnimatedFooterNavLink from "@/components/animations/AnimatedFooterNavLink";

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
      {/* Top row — separator spans full viewport width, content stays in max-w */}
      <div className="border-foreground/20 w-full border-b">
        <div className="mx-auto flex w-full max-w-[1300px] items-center justify-between gap-6 px-6 py-6 md:px-8 md:py-8 2xl:max-w-[1650px]">
          <h2 className="font-hero text-foreground text-[24px] leading-[1] tracking-[-2px] uppercase md:text-[48px] md:font-semibold">
            {dict.footer.title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br className="sm:hidden" />}
                {i < arr.length - 1 && <span className="hidden sm:inline"> </span>}
              </span>
            ))}
          </h2>
          <a
            href="#top"
            aria-label={dict.footer.backToTop}
            className="group flex h-[48px] shrink-0 items-center justify-center sm:h-[24px] md:h-[48px]"
          >
            <img
              src="/icons/empty-arrow.svg"
              alt=""
              aria-hidden="true"
              className="h-full w-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-8 2xl:max-w-[1650px]">
        {/* Main grid: logo | nav | socials — boxed.
            Padding is applied per-cell so the orange box fills its own cell
            flush against the outer border, while nav and socials get breathing room. */}
        <div className="border-foreground/20 mt-6 grid border md:mt-8 md:grid-cols-[320px_1fr_auto]">
          {/* Orange logo box — flush, no padding around it. Eyes animate on scroll. */}
          <div className="bg-accent flex h-32 w-full items-center justify-center p-8 md:h-full">
            <AnimatedFooterLogo />
          </div>

          {/* Nav links.
              Horizontal padding is applied per-link, not on the <nav>, so the
              separators between items span the full nav cell and visually
              touch the adjacent cells (orange box on the left, socials on the right). */}
          <nav aria-label="Footer navigation">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href} className="border-foreground/20 border-b md:last:border-b-0">
                  <AnimatedFooterNavLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials — two columns (3 + 3) at every breakpoint. */}
          <div className="border-foreground/20 p-4 md:border-l md:p-6">
            <p className="text-accent font-medium uppercase">{dict.footer.followLabel}</p>
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

        {/* Bottom row: email + arrow button.
            At md+ the button integrates into the container via border-l
            (no own border), and items-stretch makes it fill the row height. */}
        <div className="border-foreground/20 mb-6 flex h-12 flex-row items-stretch justify-between gap-0 border border-t-0 md:mb-8 md:h-14">
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-0 sm:items-start">
            <a
              href={`mailto:${dict.footer.email}`}
              className="text-foreground font-sans text-[16px] font-semibold sm:text-[22px] md:text-[22px]"
            >
              {dict.footer.email}
            </a>
          </div>
          <a
            href={`mailto:${dict.footer.email}`}
            aria-label={dict.footer.contactLabel}
            className="group border-foreground/20 hidden w-12 flex-none items-center justify-center self-stretch border-0 border-l bg-[#0d0d0d] sm:flex md:w-14"
          >
            <img
              src="/icons/diagonal-arrow.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
      <div
        className="bg-accent flex w-full items-center justify-center px-6"
        style={{ height: "30px" }}
      >
        <p
          className="text-[14px]"
          style={{ color: "var(--background)" }}
        >
          © 2026 Webble Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
