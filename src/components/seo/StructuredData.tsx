import Script from 'next/script';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'ContactPage' | 'AboutPage' | 'CollectionPage' | 'FAQPage';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webblestudio.com';

    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Webble Studio',
          alternateName: 'Webble',
          url: baseUrl,
          logo: `${baseUrl}/img/thumbnails/webble-thumbnail.jpg`,
          description:
            'Web design, social e advertising: Webble Studio trasforma idee in strategie digitali creative e ad alte prestazioni.',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IT',
            addressLocality: 'Milano',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+39-XXX-XXX-XXXX',
            contactType: 'customer service',
            availableLanguage: ['Italian', 'English'],
          },
          sameAs: [
            'https://www.instagram.com/webblestudio',
            'https://www.linkedin.com/company/webble-studio',
            'https://www.behance.net/webblestudio',
          ],
          foundingDate: '2024',
          numberOfEmployees: '5-10',
          industry: 'Web Design',
          services: [
            'Web Design',
            'UI/UX Design',
            'Social Media Marketing',
            'Digital Advertising',
            'Web Development',
          ],
        };

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Webble Studio',
          url: baseUrl,
          description:
            'Web design, social e advertising: Webble Studio trasforma idee in strategie digitali creative e ad alte prestazioni.',
          publisher: {
            '@type': 'Organization',
            name: 'Webble Studio',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

      case 'ContactPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contatti - Webble Studio',
          url: `${baseUrl}/contatti`,
          description:
            'Contattaci per discutere il tuo progetto digitale. Webble Studio trasforma le tue idee in strategie digitali creative e ad alte prestazioni.',
          mainEntity: {
            '@type': 'Organization',
            name: 'Webble Studio',
            url: baseUrl,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Contatti',
                item: `${baseUrl}/contatti`,
              },
            ],
          },
        };

      case 'AboutPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'Chi Siamo - Webble Studio',
          url: `${baseUrl}/chi-siamo`,
          description:
            'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali.',
          mainEntity: {
            '@type': 'Organization',
            name: 'Webble Studio',
            url: baseUrl,
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Chi Siamo',
                item: `${baseUrl}/chi-siamo`,
              },
            ],
          },
        };

      case 'CollectionPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Portfolio - Webble Studio',
          url: `${baseUrl}/portfolio`,
          description:
            'Scopri i nostri progetti di web design, UI/UX e strategie digitali. Portfolio creativo di Webble Studio con progetti innovativi e ad alte prestazioni.',
          mainEntity: {
            '@type': 'ItemList',
            name: 'Portfolio Webble Studio',
            description: 'Raccolta dei progetti di Webble Studio',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Portfolio',
                item: `${baseUrl}/portfolio`,
              },
            ],
          },
        };

      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Quanto costa un sito web?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Il costo di un sito web dipende dalle esigenze specifiche del progetto. Offriamo soluzioni personalizzate per ogni budget, dal sito vetrina al portale complesso.',
              },
            },
            {
              '@type': 'Question',
              name: 'Quanto tempo ci vuole per realizzare un sito web?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'I tempi di realizzazione variano da 2-4 settimane per un sito vetrina a 2-3 mesi per progetti complessi. Forniamo sempre una timeline dettagliata durante la consulenza.',
              },
            },
            {
              '@type': 'Question',
              name: 'Fornite supporto dopo la consegna?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sì, offriamo supporto tecnico e aggiornamenti post-consegna. Includiamo anche formazione per la gestione autonoma del sito.',
              },
            },
            {
              '@type': 'Question',
              name: 'Realizzate siti responsive?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Assolutamente sì. Tutti i nostri siti sono responsive e ottimizzati per dispositivi mobili, tablet e desktop.',
              },
            },
            {
              '@type': 'Question',
              name: 'Includete SEO nel servizio?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sì, l\'ottimizzazione SEO è inclusa in tutti i nostri progetti. Implementiamo best practices per migliorare la visibilità sui motori di ricerca.',
              },
            },
          ],
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
