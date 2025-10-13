/**
 * Portfolio Page - Server Component
 * Usa Server Actions per fetch dati dal database
 * Zero Edge Functions, zero network overhead
 */
import React from 'react';
import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Portfolio/Hero';
import PortfolioProjects from '@/components/sections/Portfolio/PortfolioProjects';
import { getPortfolioData } from '@/lib/serverActions';

// Force Node.js runtime (non Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 3600; // ISR: revalidate ogni ora

export default async function PortfolioPage() {
  // Server Action: fetch dati direttamente dal database
  const { projects } = await getPortfolioData();

  return (
    <main>
      <Hero />
      <Container>
        <PortfolioProjects projects={projects} />
      </Container>
    </main>
  );
}
