'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Container from '@/components/layout/Container';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('controller');

  const sections = [
    { id: 'controller', title: t('cookies.privacy.controller.title') },
    { id: 'data-collected', title: t('cookies.privacy.data_collected.title') },
    { id: 'purposes', title: t('cookies.privacy.purposes.title') },
    { id: 'recipients', title: t('cookies.privacy.recipients.title') },
    { id: 'retention', title: t('cookies.privacy.retention.title') },
    { id: 'rights', title: t('cookies.privacy.rights.title') },
    { id: 'transfers', title: t('cookies.privacy.transfers.title') },
    { id: 'security', title: t('cookies.privacy.security.title') },
    { id: 'cookies', title: t('cookies.privacy.cookies_link.title') },
    { id: 'authority', title: t('cookies.privacy.authority.title') },
    { id: 'changes', title: t('cookies.privacy.changes.title') },
    { id: 'contacts', title: t('cookies.privacy.contacts.title') },
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
                {t('cookies.privacy.sidebar_title')}
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
              {t('cookies.privacy.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-[#fafafa]/80">
              {t('cookies.privacy.subtitle')}
            </p>
            <p className="text-sm text-gray-500 dark:text-[#fafafa]/60 mt-4">
              {t('cookies.privacy.last_update')}
            </p>
          </div>

          {/* Introduzione */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6">
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
              {t('cookies.privacy.intro.text')}
            </p>
          </div>
          
          {/* Titolare */}
          <section id="controller" className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
              {t('cookies.privacy.controller.title')}
            </h2>
            <div className="text-gray-700 dark:text-[#fafafa]/80 space-y-2">
              <p><strong>{t('cookies.privacy.controller.brand')}</strong> {t('cookies.privacy.controller.brand_val')}</p>
              <p><strong>{t('cookies.privacy.controller.company')}</strong> {t('cookies.privacy.controller.company_val')}</p>
              <p><strong>{t('cookies.privacy.controller.address')}</strong> {t('cookies.privacy.controller.address_val')}</p>
              <p><strong>{t('cookies.privacy.controller.ein')}</strong> {t('cookies.privacy.controller.ein_val')}</p>
              <p><strong>{t('cookies.privacy.controller.email')}</strong> <a href="mailto:webblestudio.com@gmail.com" className="text-[#F20352] hover:underline">webblestudio.com@gmail.com</a></p>
            </div>
          </section>

          {/* Dati Raccolti */}
          <section id="data-collected" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.data_collected.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.data_collected.intro')}
            </p>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.data_collected.contact_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.data_collected.contact_items')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.data_collected.booking_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.data_collected.booking_items')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.data_collected.navigation_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.data_collected.navigation_items')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.data_collected.consent_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.data_collected.consent_items')}
                </p>
              </div>
            </div>
          </section>

          {/* Finalità */}
          <section id="purposes" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.purposes.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.purposes.intro')}
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.purposes.service_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-2">
                  {t('cookies.privacy.purposes.service_text')}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                  <strong>{t('cookies.privacy.purposes.service_legal')}</strong>
                </p>
              </div>

              <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.purposes.communication_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-2">
                  {t('cookies.privacy.purposes.communication_text')}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                  <strong>{t('cookies.privacy.purposes.communication_legal')}</strong>
                </p>
              </div>

              <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.purposes.analytics_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-2">
                  {t('cookies.privacy.purposes.analytics_text')}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                  <strong>{t('cookies.privacy.purposes.analytics_legal')}</strong>
                </p>
              </div>

              <div className="border-l-4 border-gray-400 dark:border-gray-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.purposes.security_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-2">
                  {t('cookies.privacy.purposes.security_text')}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/70">
                  <strong>{t('cookies.privacy.purposes.security_legal')}</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Destinatari */}
          <section id="recipients" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.recipients.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.recipients.intro')}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.recipients.vercel_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.recipients.vercel_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.recipients.supabase_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.recipients.supabase_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-4 bg-white dark:bg-[rgba(250,250,250,0.02)]">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.recipients.google_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.recipients.google_text')}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                <strong>Nota:</strong> {t('cookies.privacy.recipients.note')}
              </p>
            </div>
          </section>

          {/* Conservazione */}
          <section id="retention" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.retention.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.retention.intro')}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.retention.contact_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.retention.contact_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.retention.booking_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.retention.booking_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-2">
                  {t('cookies.privacy.retention.analytics_title')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.retention.analytics_text')}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-[rgba(250,250,250,0.05)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                <strong>Nota:</strong> {t('cookies.privacy.retention.note')}
              </p>
            </div>
          </section>

          {/* Diritti */}
          <section id="rights" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.rights.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.rights.intro')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.access')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.access_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.rectification')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.rectification_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.erasure')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.erasure_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.restriction')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.restriction_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.portability')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.portability_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.objection')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.objection_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.withdraw')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.withdraw_text')}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {t('cookies.privacy.rights.complaint')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.rights.complaint_text')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                <strong>{t('cookies.privacy.rights.exercise')}</strong>{' '}
                <a href="mailto:webblestudio.com@gmail.com" className="text-[#F20352] hover:underline">webblestudio.com@gmail.com</a>. {t('cookies.privacy.rights.response')}
              </p>
            </div>
          </section>

          {/* Trasferimenti */}
          <section id="transfers" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.transfers.title')}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                  {t('cookies.privacy.transfers.us_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                  {t('cookies.privacy.transfers.us_text')}
                </p>
              </div>

              <div className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#fafafa] mb-3">
                  {t('cookies.privacy.transfers.providers_title')}
                </h3>
                <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-3">
                  {t('cookies.privacy.transfers.providers_text')}
                </p>
                <ul className="text-sm text-gray-600 dark:text-[#fafafa]/80 list-disc list-inside space-y-1 mb-4">
                  <li>{t('cookies.privacy.transfers.vercel')}</li>
                  <li>{t('cookies.privacy.transfers.supabase')}</li>
                  <li>{t('cookies.privacy.transfers.google')}</li>
                </ul>
                <p className="text-sm text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
                  {t('cookies.privacy.transfers.guarantees')}
                </p>
              </div>
            </div>
          </section>

          {/* Sicurezza */}
          <section id="security" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.security.title')}
            </h2>
            
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-6">
              {t('cookies.privacy.security.intro')}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg">
                <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.security.encryption')}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg">
                <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.security.database')}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg">
                <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.security.access')}
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg">
                <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                  {t('cookies.privacy.security.monitoring')}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-[rgba(250,250,250,0.05)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-lg p-4">
              <p className="text-sm text-gray-700 dark:text-[#fafafa]/80">
                <strong>Nota:</strong> {t('cookies.privacy.security.note')}
              </p>
            </div>
          </section>

          {/* Cookie Link */}
          <section id="cookies" className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
              {t('cookies.privacy.cookies_link.title')}
            </h2>
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
              {t('cookies.privacy.cookies_link.text')}{' '}
              <a href="/cookie-policy" className="text-[#F20352] hover:underline font-medium">
                {t('cookies.privacy.cookies_link.link')}
              </a>
            </p>
          </section>

          {/* Autorità */}
          <section id="authority" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-6">
              {t('cookies.privacy.authority.title')}
            </h2>
            
            <div className="bg-white dark:bg-[rgba(250,250,250,0.02)] border border-gray-200 dark:border-[rgba(250,250,250,0.1)] rounded-xl p-6">
              <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
                {t('cookies.privacy.authority.intro')}
              </p>
              
              <div className="space-y-2 text-gray-700 dark:text-[#fafafa]/80">
                <p><strong>{t('cookies.privacy.authority.name')}</strong></p>
                <p className="ml-4">{t('cookies.privacy.authority.address')}</p>
                <p className="ml-4"><strong>{t('cookies.privacy.authority.phone')}</strong> <a href="tel:+39066977" className="text-[#F20352] hover:underline">+39 06.69677.1</a></p>
                <p className="ml-4"><strong>Fax:</strong> +39 06.69677.3785</p>
                <p className="ml-4"><strong>{t('cookies.privacy.authority.email')}</strong> <a href="mailto:garante@gpdp.it" className="text-[#F20352] hover:underline">garante@gpdp.it</a></p>
                <p className="ml-4"><strong>{t('cookies.privacy.authority.pec')}</strong> <a href="mailto:protocollo@pec.gpdp.it" className="text-[#F20352] hover:underline">protocollo@pec.gpdp.it</a></p>
                <p className="ml-4"><strong>{t('cookies.privacy.authority.website')}</strong> <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-[#F20352] hover:underline">www.garanteprivacy.it</a></p>
              </div>
            </div>
          </section>

          {/* Modifiche */}
          <section id="changes" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
              {t('cookies.privacy.changes.title')}
            </h2>
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed">
              {t('cookies.privacy.changes.text')}
            </p>
          </section>

          {/* Contatti */}
          <section id="contacts" className="border-t border-gray-200 dark:border-[rgba(250,250,250,0.1)] pt-8 scroll-mt-24">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
              {t('cookies.privacy.contacts.title')}
            </h2>
            <p className="text-gray-700 dark:text-[#fafafa]/80 leading-relaxed mb-4">
              {t('cookies.privacy.contacts.intro')}
            </p>
            <div className="text-gray-700 dark:text-[#fafafa]/80 space-y-1">
              <p><strong>{t('cookies.privacy.contacts.brand')}</strong></p>
              <p>{t('cookies.privacy.contacts.company')}</p>
              <p>{t('cookies.privacy.contacts.address')}</p>
              <p className="mt-3"><strong>{t('cookies.privacy.contacts.email')}</strong> <a href="mailto:webblestudio.com@gmail.com" className="text-[#F20352] hover:underline">webblestudio.com@gmail.com</a></p>
            </div>
          </section>

          </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

