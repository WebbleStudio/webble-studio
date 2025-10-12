import type { Metadata } from 'next';
import Hero from '@/components/sections/contatti/Hero';
import Title from '@/components/sections/contatti/Title';
import Contatti from '@/components/sections/contatti/contatti';
import Form from '@/components/sections/contatti/Form';
import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Contatti - Webble Studio',
  description:
    'Contattaci per discutere il tuo progetto digitale. Webble Studio è pronto a trasformare le tue idee in realtà.',
  keywords: ['contatti webble studio', 'richiedi preventivo', 'web agency contatti'],
  openGraph: {
    title: 'Contatti - Webble Studio',
    description:
      'Contattaci per discutere il tuo progetto digitale. Webble Studio è pronto a trasformare le tue idee in realtà.',
    type: 'website',
  },
};

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
