import React from 'react';
import Hero from '@/components/sections/contatti/Hero';
import Title from '@/components/sections/contatti/Title';
import Contatti from '@/components/sections/contatti/contatti';
import Form from '@/components/sections/contatti/Form';
import Container from '@/components/layout/Container';

// Server Component - HTML statico
export default function Contact() {
  return (
    <main>
      <Hero />
      <Container>
        <Title />
        <Contatti />
        <Form />
      </Container>
    </main>
  );
}

// Forza la rigenerazione statica SOLO on-demand
export const revalidate = false;
