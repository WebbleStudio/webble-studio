import Script from 'next/script';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'ContactPage' | 'AboutPage' | 'CollectionPage';
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
          legalName: 'Vady Solutions LLC',
          alternateName: 'Webble',
          url: baseUrl,
          logo: `${baseUrl}/img/webble-white-logo.svg`,
          image: `${baseUrl}/img/thumbnails/webble-thumbnail.jpg`,
          description:
            'Webble Studio trasforma idee in campagne che si distinguono, dall\'idea ai risultati, senza perdere tempo. Web design, UI/UX, social media e advertising.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '16192 Coastal Hwy',
            addressLocality: 'Lewes',
            addressRegion: 'DE',
            postalCode: '19958',
            addressCountry: 'US',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'info@webblestudio.com',
            contactType: 'customer service',
            availableLanguage: ['Italian', 'English'],
          },
          sameAs: [
            'https://instagram.com/studiowebble',
            'https://www.linkedin.com/company/webblestudio/',
            'https://www.tiktok.com/@webblestudio',
            'https://www.youtube.com/@webblestudio',
            'https://www.facebook.com/p/Webble-Studio-61566664251140/',
            'https://x.com/webblestudio',
            'https://www.threads.com/@studiowebble',
            'https://www.behance.net/Webble',
            'https://it.pinterest.com/webblestudio/',
          ],
          foundingDate: '2023',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5.0',
            reviewCount: '12',
          },
          areaServed: ['IT', 'US', 'EU'],
          knowsAbout: [
            'Web Design',
            'UI/UX Design',
            'Social Media Marketing',
            'Digital Advertising',
            'Brand Identity',
            'Web Development',
            'Project Management',
          ],
          slogan: 'Scopri cosa significa essere unici',
        };

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Webble Studio',
          url: baseUrl,
          description:
            'Webble Studio trasforma idee in campagne che si distinguono, dall\'idea ai risultati, senza perdere tempo. Web design, UI/UX, social media e advertising.',
          publisher: {
            '@type': 'Organization',
            name: 'Webble Studio',
            legalName: 'Vady Solutions LLC',
          },
          inLanguage: ['it-IT', 'en-US'],
          copyrightYear: 2023,
          copyrightHolder: {
            '@type': 'Organization',
            name: 'Vady Solutions LLC',
          },
        };

      case 'ContactPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contatti - Webble Studio',
          url: `${baseUrl}/contatti`,
          description:
            'Contattaci per trasformare le tue idee in campagne che si distinguono. Webble Studio: dall\'idea ai risultati, senza perdere tempo.',
          mainEntity: {
            '@type': 'Organization',
            name: 'Webble Studio',
            legalName: 'Vady Solutions LLC',
            url: baseUrl,
            email: 'info@webblestudio.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '16192 Coastal Hwy',
              addressLocality: 'Lewes',
              addressRegion: 'DE',
              postalCode: '19958',
              addressCountry: 'US',
            },
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
            'Scopri il team di Webble Studio: Vadim e Gabriele, fondatori e creative director. Trasformiamo idee in campagne che si distinguono.',
          mainEntity: {
            '@type': 'Organization',
            name: 'Webble Studio',
            legalName: 'Vady Solutions LLC',
            url: baseUrl,
            founder: [
              {
                '@type': 'Person',
                name: 'Vadim Zaporojan',
                jobTitle: 'Co-Founder & Creative Director',
                sameAs: ['https://www.linkedin.com/in/vadimzaporojan/'],
              },
              {
                '@type': 'Person',
                name: 'Gabriele Consolo',
                jobTitle: 'Co-Founder & Creative Director',
                sameAs: ['https://www.linkedin.com/in/gabriele-consolo-12b32832b/'],
              },
            ],
            employee: [
              {
                '@type': 'Person',
                name: 'Matias Plaza',
                jobTitle: 'SMM e Digital Strategist',
              },
              {
                '@type': 'Person',
                name: 'Victor Sirbu',
                jobTitle: 'Fotografo e Videomaker',
              },
              {
                '@type': 'Person',
                name: 'Anselmo D. G. Vicente',
                jobTitle: 'Full Stack Developer',
              },
              {
                '@type': 'Person',
                name: 'Imane Eshakhi',
                jobTitle: 'Graphic e Motion Designer',
              },
            ],
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
            'Dove la creatività incontra la strategia. Esplora i progetti di Webble Studio: web design, UI/UX, social media e advertising che si distinguono.',
          mainEntity: {
            '@type': 'ItemList',
            name: 'Portfolio Webble Studio',
            description:
              'Raccolta dei progetti di web design, UI/UX, social media e advertising realizzati da Webble Studio',
            itemListElement: data?.projects || [],
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
