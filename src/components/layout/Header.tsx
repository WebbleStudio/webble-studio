import { locales, localeConfig, type Locale } from "@/lib/locales";
import type { Dictionary } from "@/lib/getDictionary";
import AnimatedHeader from "@/components/animations/AnimatedHeader";
import AnimatedLogo from "@/components/animations/AnimatedLogo";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const navLinks = [
    { label: dict.nav.home, href: `/${locale}` },
    { label: dict.nav.about, href: `/${locale}/about` },
    { label: dict.nav.ourWork, href: `/${locale}/our-work` },
  ];

  return (
    <AnimatedHeader>
      <div className="relative mx-auto flex h-[75px] w-full max-w-[1300px] items-center justify-between px-6 md:px-8 2xl:max-w-[1650px]">
        {/* Desktop nav — hidden below md */}
        <nav className="hidden items-center gap-12 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-ui text-foreground hover:text-accent text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Logo — centered on desktop, left on mobile */}
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
          <AnimatedLogo locale={locale} siteName={dict.meta.siteName} />
        </div>

        {/* Desktop CTA — hidden below md */}
        <a
          href={`/${locale}/contact`}
          className="hidden items-center gap-2 bg-accent px-5 py-2.5 font-sans text-sm font-medium text-foreground md:flex"
        >
          <img src="/icons/facetime-icon-white.svg" alt="" aria-hidden="true" width={15} height={15} />
          {dict.nav.contactCta}
        </a>

        {/* Burger — visible only below md */}
        <button
          type="button"
          aria-label="Menu"
          className="flex flex-col items-center justify-center gap-[10px] border-[3px] border-[#242424] bg-[#0A0A0A] px-5 py-4 md:hidden"
        >
          <span className="bg-foreground block h-[2px] w-12" />
          <span className="bg-foreground block h-[2px] w-12" />
        </button>
      </div>
    </AnimatedHeader>
  );
}
