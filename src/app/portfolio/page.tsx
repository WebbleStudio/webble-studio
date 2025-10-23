/**
 * Portfolio Page - Server Component Ottimizzato per SEO
 * 
 * ARCHITETTURA IBRIDA:
 * - Server Component: Contenuto statico pre-renderizzato per Google
 * - Client Component: Filtri e interazioni dinamiche
 * - ISR: Revalidation ogni ora con cache invalidation
 * 
 * VANTAGGI SEO:
 * ✅ Tutti i progetti sono visibili ai crawler Google
 * ✅ Structured data completo
 * ✅ Meta tags ottimizzati
 * ✅ Performance eccellenti (Static Generation)
 * 
 * AGGIORNAMENTI DINAMICI:
 * ✅ ISR con revalidation automatica
 * ✅ Cache invalidation manuale dall'admin
 * ✅ Zero downtime per gli utenti
 */
import React from 'react';
import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Portfolio/Hero';
import PortfolioProjectsWrapper from '@/components/sections/Portfolio/PortfolioProjectsWrapper';
import { getPortfolioData } from '@/lib/serverActions';

// Force Node.js runtime (non Edge)
export const runtime = 'nodejs';
// Rimuoviamo force-static per permettere SSR con fallback
// export const dynamic = 'force-static';
export const revalidate = 3600; // ISR: revalidate ogni ora (3600s) - più frequente per aggiornamenti veloci

export default async function PortfolioPage() {
  // Server Action: fetch dati direttamente dal database
  // I dati sono cached e pre-renderizzati per SEO ottimale
  const { projects } = await getPortfolioData();

  return (
    <main>
      {/* Hero: Server Component - rendering statico */}
      <Hero />
      
      {/* SEO Content: Contenuto statico sempre visibile per Google */}
      <Container>
        <div className="sr-only">
          <h1>Portfolio Webble Studio - Progetti di Web Design e UI/UX</h1>
          <p>
            Scopri i nostri progetti di web design, UI/UX e strategie digitali. Portfolio creativo di Webble Studio con progetti innovativi e ad alte prestazioni. Case study e lavori realizzati per clienti in Italia e nel mondo.
          </p>
          <p>
            Esplora i nostri lavori di: web design Milano, portfolio creativo, progetti digitali, case study web design, UI/UX design, agenzia digitale portfolio, progetti web innovativi.
          </p>
        </div>
        
        {/* Portfolio Projects: Hybrid Component */}
        {/* 
          PortfolioProjectsWrapper è un Client Component che riceve
          i progetti già renderizzati dal server. Google vede tutto
          il contenuto mentre gli utenti hanno interazioni fluide.
        */}
        <PortfolioProjectsWrapper projects={projects} />
      </Container>
    </main>
  );
}
