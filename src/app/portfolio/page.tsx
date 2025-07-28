'use client';

import React from 'react';
import Container from '@/components/layout/Container';
import PortfolioHero from '@/components/sections/Portfolio/PortfolioHero';
import PortfolioProjects from '@/components/sections/Portfolio/PortfolioProjects';

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioHero />
      <Container>
        <PortfolioProjects />
      </Container>
    </main>
  );
}
