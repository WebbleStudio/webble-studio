'use client';

import React from 'react';
import Container from '@/components/layout/Container';
import Hero from '@/components/sections/portfolio/Hero';
import PortfolioProjects from '@/components/sections/Portfolio/PortfolioProjects';

export default function PortfolioPage() {
  return (
    <main>
      <Hero />
      <Container>
        <PortfolioProjects />
      </Container>
    </main>
  );
}
