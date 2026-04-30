import type { MetadataRoute } from 'next';

const baseUrl = 'https://webblestudio.com';

// Pagine con ISR: lastmod aggiornato ad ogni revalidation
// Pagine statiche: lastmod fisso all'ultima modifica reale
export const revalidate = 86400; // rigenera la sitemap ogni 24 ore

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date('2024-12-19'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chi-siamo`,
      lastModified: new Date('2024-12-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
