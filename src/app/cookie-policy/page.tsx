'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks';
import Container from '@/components/layout/Container';

// Pure Static - NO runtime, NO functions (client-side only)

export default function CookiePolicyPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('titolare');

  // Sezioni dinamiche dalla traduzione
  const sections = [
    { id: 'titolare', title: t('cookies.policy.sections.data_controller.title') },
    { id: 'introduzione', title: t('cookies.policy.sections.intro.title') },
    { id: 'funzionali', title: t('cookies.policy.sections.functional.title') },
    { id: 'marketing', title: t('cookies.policy.sections.marketing_section.title') },
    { id: 'base-giuridica', title: t('cookies.policy.sections.legal_basis.title') },
    { id: 'trasferimenti', title: t('cookies.policy.sections.transfers.title') },
    { id: 'conservazione', title: t('cookies.policy.sections.retention.title') },
    { id: 'conseguenze', title: t('cookies.policy.sections.consequences.title') },
    { id: 'diritti', title: t('cookies.policy.sections.rights.title') },
    { id: 'autorita', title: t('cookies.policy.sections.authority.title') },
    { id: 'prima-terza', title: t('cookies.policy.sections.first_third.title') },
    { id: 'gestione', title: t('cookies.policy.sections.management.title') },
    { id: 'privacy-policy', title: t('cookies.policy.sections.privacy_link.title') },
    { id: 'aggiornamenti', title: t('cookies.policy.sections.updates.title') },
    { id: 'contatti', title: t('cookies.policy.sections.contacts.title') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-[#0b0b0b] transition-colors duration-500">
      {/* Container nero sotto header */}
      <div className="h-[90px] bg-[#0b0b0b]"></div>

      <div className="pt-[45px] pb-32">
        <Container>
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
              <nav className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-3 px-3">
                  {t('cookies.policy.sidebar_title')}
                </h2>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-[#F20352] text-white font-medium'
                            : 'text-gray-600 dark:text-[#fafafa]/70 hover:bg-gray-100 dark:hover:bg-[rgba(250,250,250,0.05)]'
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-12">
              {/* Header */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.policy.subtitle')}
                </p>
                <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-4">
                  {t('cookies.policy.last_update')}
                </p>
              </div>

              {/* Titolare */}
              <section
                id="titolare"
                className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.sections.data_controller.title')}
                </h2>
                <div className="text-gray-700 dark:text-[#fafafa]/80 space-y-2">
                  <p>
                    <strong>{t('cookies.policy.sections.data_controller.brand')}</strong>{' '}
                    {t('cookies.policy.sections.contacts.brand')}
                  </p>
                  <p>
                    <strong>{t('cookies.policy.sections.data_controller.company')}</strong>{' '}
                    {t('cookies.policy.sections.contacts.company')}
                  </p>
                  <p>
                    <strong>{t('cookies.policy.sections.data_controller.address')}</strong>{' '}
                    {t('cookies.policy.sections.contacts.address')}
                  </p>
                  <p>
                    <strong>{t('cookies.policy.sections.data_controller.ein')}</strong> 32-0774843
                  </p>
                  <p>
                    <strong>{t('cookies.policy.sections.data_controller.email')}</strong>{' '}
                    <a
                      href="mailto:webblestudio.com@gmail.com"
                      className="text-[#F20352] hover:underline"
                    >
                      webblestudio.com@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Introduzione */}
              <section id="introduzione" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.sections.intro.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
                  {t('cookies.policy.sections.intro.text1')}
                </p>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                  {t('cookies.policy.sections.intro.text2')}
                </p>
              </section>

              {/* Cookie Funzionali */}
              <section id="funzionali" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.functional.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
                  {t('cookies.policy.sections.functional.description')}
                </p>

                <div className="space-y-6">
                  {/* Vercel */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.functional.vercel.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.functional.vercel.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.functional.vercel.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.vercel.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.vercel.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.vercel.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.vercel.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.vercel.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.vercel.description_text')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cloudflare */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.functional.cloudflare.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.functional.cloudflare.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.functional.cloudflare.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.cloudflare.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.cloudflare.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.cloudflare.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.cloudflare.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.cloudflare.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.cloudflare.description_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.cloudflare.privacy_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.cloudflare.privacy_text')}{' '}
                          <a
                            href="https://www.cloudflare.com/privacypolicy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.functional.cloudflare.privacy_link')}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Google reCAPTCHA */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.functional.recaptcha.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.functional.recaptcha.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.functional.recaptcha.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.recaptcha.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.recaptcha.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.recaptcha.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.recaptcha.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.recaptcha.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.recaptcha.description_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.recaptcha.privacy_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.recaptcha.privacy_text')}{' '}
                          <a
                            href="https://policies.google.com/technologies/partner-sites"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.functional.recaptcha.privacy_link1')}
                          </a>{' '}
                          {t('cookies.policy.sections.functional.recaptcha.privacy_and')}{' '}
                          <a
                            href="https://business.safety.google/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.functional.recaptcha.privacy_link2')}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Video Widget */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.functional.youtube.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.functional.youtube.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.functional.youtube.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.youtube.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.youtube.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.youtube.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.youtube.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.youtube.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.youtube.description_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.functional.youtube.privacy_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.functional.youtube.privacy_text')}{' '}
                          <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.functional.youtube.privacy_link')}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookie Marketing */}
              <section id="marketing" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.marketing_section.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
                  {t('cookies.policy.sections.marketing_section.description')}
                </p>

                <div className="space-y-6">
                  {/* Google Analytics 4 */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.marketing_section.ga4.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.marketing_section.ga4.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.marketing_section.ga4.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.ga4.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.ga4.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.ga4.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.ga4.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.ga4.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.ga4.description_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.ga4.privacy_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.ga4.privacy_text')}{' '}
                          <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.marketing_section.ga4.privacy_link')}
                          </a>
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.ga4.cookies_title')}
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 list-disc list-inside space-y-1">
                          <li>
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                              _ga
                            </code>{' '}
                            - 2 anni
                          </li>
                          <li>
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                              _ga_*
                            </code>{' '}
                            - 2 anni
                          </li>
                          <li>
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                              _gid
                            </code>{' '}
                            - 24 ore
                          </li>
                          <li>
                            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                              _gat
                            </code>{' '}
                            - 1 minuto
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Google Tag Manager */}
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-[#fafafa]">
                          {t('cookies.policy.sections.marketing_section.gtm.name')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-1">
                          {t('cookies.policy.sections.marketing_section.gtm.provider')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                        {t('cookies.policy.sections.marketing_section.gtm.status')}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.gtm.purpose_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.gtm.purpose_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.gtm.data_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.gtm.data_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.gtm.description_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.gtm.description_text')}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.gtm.privacy_title')}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                          {t('cookies.policy.sections.marketing_section.gtm.privacy_text')}{' '}
                          <a
                            href="https://policies.google.com/technologies/partner-sites"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.marketing_section.gtm.privacy_link1')}
                          </a>{' '}
                          {t('cookies.policy.sections.marketing_section.gtm.privacy_and')}{' '}
                          <a
                            href="https://business.safety.google/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.marketing_section.gtm.privacy_link2')}
                          </a>
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                          {t('cookies.policy.sections.marketing_section.gtm.cookies_title')}
                        </h4>
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                            <strong>Nota:</strong>{' '}
                            {t('cookies.policy.sections.marketing_section.gtm.cookies_note')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Base Giuridica */}
              <section id="base-giuridica" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.legal_basis.title')}
                </h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-gray-400 dark:border-gray-600 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                      {t('cookies.policy.sections.legal_basis.functional_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                      <strong>{t('cookies.policy.sections.legal_basis.functional_basis')}</strong>{' '}
                      {t('cookies.policy.sections.legal_basis.functional_article')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70 mt-2">
                      {t('cookies.policy.sections.legal_basis.functional_text')}
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                      {t('cookies.policy.sections.legal_basis.marketing_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                      <strong>{t('cookies.policy.sections.legal_basis.marketing_basis')}</strong>{' '}
                      {t('cookies.policy.sections.legal_basis.marketing_article')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70 mt-2">
                      {t('cookies.policy.sections.legal_basis.marketing_text')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Trasferimenti */}
              <section id="trasferimenti" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.transfers.title')}
                </h2>

                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                      {t('cookies.policy.sections.transfers.us_company_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
                      <strong>Vady Solutions LLC</strong>{' '}
                      {t('cookies.policy.sections.transfers.us_company_text1')}{' '}
                      <strong>Stati Uniti (Delaware)</strong>.
                      {t('cookies.policy.sections.transfers.us_company_text2')}{' '}
                      <strong>GDPR (Regolamento Generale sulla Protezione dei Dati)</strong>{' '}
                      {t('cookies.policy.sections.transfers.us_company_text3')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                      {t('cookies.policy.sections.transfers.us_company_text4')}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                      {t('cookies.policy.sections.transfers.google_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-3">
                      {t('cookies.policy.sections.transfers.google_text1')}
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 list-disc list-inside space-y-1 mb-3">
                      <li>{t('cookies.policy.sections.transfers.google_ga')}</li>
                      <li>{t('cookies.policy.sections.transfers.google_gtm')}</li>
                    </ul>
                    <p className="text-sm text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                      {t('cookies.policy.sections.transfers.google_text2')}{' '}
                      <strong>{t('cookies.policy.sections.transfers.google_framework')}</strong>,{' '}
                      {t('cookies.policy.sections.transfers.google_text3')}{' '}
                      <strong>{t('cookies.policy.sections.transfers.google_scc')}</strong>{' '}
                      {t('cookies.policy.sections.transfers.google_text4')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70 mt-3">
                      {t('cookies.policy.sections.transfers.google_more')}{' '}
                      <a
                        href="https://business.safety.google/privacy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F20352] hover:underline"
                      >
                        {t('cookies.policy.sections.transfers.google_link')}
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Conservazione */}
              <section id="conservazione" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.retention.title')}
                </h2>

                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                    {t('cookies.policy.sections.retention.intro')}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                        {t('cookies.policy.sections.retention.functional_title')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                        {t('cookies.policy.sections.retention.functional_text')}
                      </p>
                    </div>

                    <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                        {t('cookies.policy.sections.retention.marketing_title')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                        {t('cookies.policy.sections.retention.marketing_text')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                      {t('cookies.policy.sections.retention.validity_title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.retention.validity_text')}{' '}
                      <strong>{t('cookies.policy.sections.retention.validity_days')}</strong>.{' '}
                      {t('cookies.policy.sections.retention.validity_text2')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Conseguenze */}
              <section id="conseguenze" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.consequences.title')}
                </h2>

                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                    {t('cookies.policy.sections.consequences.intro')}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                        {t('cookies.policy.sections.consequences.works_title')}
                      </h3>
                      <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 space-y-1 list-disc list-inside">
                        <li>{t('cookies.policy.sections.consequences.works_item1')}</li>
                        <li>{t('cookies.policy.sections.consequences.works_item2')}</li>
                        <li>{t('cookies.policy.sections.consequences.works_item3')}</li>
                        <li>{t('cookies.policy.sections.consequences.works_item4')}</li>
                        <li>{t('cookies.policy.sections.consequences.works_item5')}</li>
                      </ul>
                    </div>

                    <div className="border border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                        {t('cookies.policy.sections.consequences.not_works_title')}
                      </h3>
                      <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 space-y-1 list-disc list-inside">
                        <li>{t('cookies.policy.sections.consequences.not_works_item1')}</li>
                        <li>{t('cookies.policy.sections.consequences.not_works_item2')}</li>
                        <li>{t('cookies.policy.sections.consequences.not_works_item3')}</li>
                        <li>{t('cookies.policy.sections.consequences.not_works_item4')}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-[rgba(250,250,250,0.05)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                      <strong>Nota importante:</strong>{' '}
                      {t('cookies.policy.sections.consequences.note')}
                    </p>
                  </div>
                </div>
              </section>

              {/* Diritti */}
              <section id="diritti" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.rights.title')}
                </h2>

                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
                  {t('cookies.policy.sections.rights.intro')}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.access')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.access_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.rectification')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.rectification_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.erasure')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.erasure_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.restriction')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.restriction_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.portability')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.portability_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.objection')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.objection_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.withdraw')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.withdraw_text')}
                    </p>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                      {t('cookies.policy.sections.rights.complaint')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                      {t('cookies.policy.sections.rights.complaint_text')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                    <strong>{t('cookies.policy.sections.rights.exercise')}</strong>{' '}
                    <a
                      href="mailto:webblestudio.com@gmail.com"
                      className="text-[#F20352] hover:underline"
                    >
                      webblestudio.com@gmail.com
                    </a>
                    . {t('cookies.policy.sections.rights.exercise_response')}
                  </p>
                </div>
              </section>

              {/* Autorità */}
              <section id="autorita" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.authority.title')}
                </h2>

                <div className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                  <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
                    {t('cookies.policy.sections.authority.intro')}
                  </p>

                  <div className="space-y-2 text-gray-700 dark:text-[#fafafa]/80">
                    <p>
                      <strong>{t('cookies.policy.sections.authority.italy')}</strong>
                    </p>
                    <p className="ml-4">
                      <strong>{t('cookies.policy.sections.authority.name')}</strong>
                    </p>
                    <p className="ml-4">Piazza Venezia, 11 - 00187 Roma</p>
                    <p className="ml-4">
                      <strong>{t('cookies.policy.sections.authority.phone')}</strong>{' '}
                      <a href="tel:+39066977" className="text-[#F20352] hover:underline">
                        +39 06.69677.1
                      </a>
                    </p>
                    <p className="ml-4">
                      <strong>{t('cookies.policy.sections.authority.fax')}</strong> +39
                      06.69677.3785
                    </p>
                    <p className="ml-4">
                      <strong>Email:</strong>{' '}
                      <a href="mailto:garante@gpdp.it" className="text-[#F20352] hover:underline">
                        garante@gpdp.it
                      </a>
                    </p>
                    <p className="ml-4">
                      <strong>PEC:</strong>{' '}
                      <a
                        href="mailto:protocollo@pec.gpdp.it"
                        className="text-[#F20352] hover:underline"
                      >
                        protocollo@pec.gpdp.it
                      </a>
                    </p>
                    <p className="ml-4">
                      <strong>{t('cookies.policy.sections.authority.website')}</strong>{' '}
                      <a
                        href="https://www.garanteprivacy.it"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F20352] hover:underline"
                      >
                        www.garanteprivacy.it
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Prima/Terza Parte */}
              <section id="prima-terza" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.first_third.title')}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                      {t('cookies.policy.sections.first_third.first_title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 mb-3">
                      {t('cookies.policy.sections.first_third.first_text')}
                    </p>
                    <div className="bg-white dark:bg-[rgba(250,250,250,0.05)] rounded-lg p-3 border border-gray-200 dark:border-[rgba(250,250,250,0.1)]">
                      <p className="text-sm font-medium text-gray-900 dark:text-[#fafafa] mb-1">
                        {t('cookies.policy.sections.first_third.first_examples')}
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 list-disc list-inside">
                        <li>{t('cookies.policy.sections.first_third.first_item1')}</li>
                        <li>{t('cookies.policy.sections.first_third.first_item2')}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                      {t('cookies.policy.sections.first_third.third_title')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/80 mb-3">
                      {t('cookies.policy.sections.first_third.third_text')}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-[#fafafa] mb-1">
                        {t('cookies.policy.sections.first_third.third_examples')}
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 list-disc list-inside">
                        <li>{t('cookies.policy.sections.first_third.third_item1')}</li>
                        <li>{t('cookies.policy.sections.first_third.third_item2')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Gestione */}
              <section id="gestione" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
                  {t('cookies.policy.sections.management.title')}
                </h2>

                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                      {t('cookies.policy.sections.management.site_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-3">
                      {t('cookies.policy.sections.management.site_text')}{' '}
                      <strong>{t('cookies.policy.sections.management.site_button')}</strong>{' '}
                      {t('cookies.policy.sections.management.site_location')}{' '}
                      <strong>{t('cookies.policy.sections.management.site_position')}</strong>.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                      <strong>Nota:</strong> {t('cookies.policy.sections.management.site_note')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                      {t('cookies.policy.sections.management.browser_title')}
                    </h3>
                    <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-3">
                      {t('cookies.policy.sections.management.browser_text')}
                    </p>
                    <ul className="space-y-2 text-gray-700 dark:text-[#fafafa]/80">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <strong>Chrome:</strong>{' '}
                          <a
                            href="https://support.google.com/chrome/answer/95647"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.management.chrome')}
                          </a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <strong>Firefox:</strong>{' '}
                          <a
                            href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.management.firefox')}
                          </a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <strong>Safari:</strong>{' '}
                          <a
                            href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.management.safari')}
                          </a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <strong>Edge:</strong>{' '}
                          <a
                            href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F20352] hover:underline"
                          >
                            {t('cookies.policy.sections.management.edge')}
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy Policy Link */}
              <section
                id="privacy-policy"
                className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.sections.privacy_link.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                  {t('cookies.policy.sections.privacy_link.text')}{' '}
                  <a href="/privacy-policy" className="text-[#F20352] hover:underline font-medium">
                    {t('cookies.policy.sections.privacy_link.link')}
                  </a>{' '}
                  {t('cookies.policy.sections.privacy_link.text2')}
                </p>
              </section>

              {/* Aggiornamenti */}
              <section id="aggiornamenti" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.sections.updates.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                  {t('cookies.policy.sections.updates.text')}
                </p>
              </section>

              {/* Contatti */}
              <section
                id="contatti"
                className="border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] pt-8 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
                  {t('cookies.policy.sections.contacts.title')}
                </h2>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
                  {t('cookies.policy.sections.contacts.intro')}
                </p>
                <div className="text-gray-700 dark:text-[#fafafa]/80 space-y-1">
                  <p>
                    <strong>{t('cookies.policy.sections.contacts.brand')}</strong>
                  </p>
                  <p>{t('cookies.policy.sections.contacts.company')}</p>
                  <p>{t('cookies.policy.sections.contacts.address')}</p>
                  <p className="mt-3">
                    <strong>{t('cookies.policy.sections.contacts.email')}</strong>{' '}
                    <a
                      href="mailto:webblestudio.com@gmail.com"
                      className="text-[#F20352] hover:underline"
                    >
                      webblestudio.com@gmail.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
