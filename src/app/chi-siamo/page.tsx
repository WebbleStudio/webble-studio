import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import ChiSiamoHero from '@/components/sections/chi-siamo/hero';
import Team from '@/components/sections/chi-siamo/Team';
import Contact from '@/components/sections/Home/Contact';

export const metadata: Metadata = {
  title: 'Chi Siamo - Webble Studio',
  description: 'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali.',
  keywords: ['team webble studio', 'chi siamo', 'web agency', 'team creativo'],
  openGraph: {
    title: 'Chi Siamo - Webble Studio',
    description: 'Scopri il team di Webble Studio: creativi, designer e sviluppatori appassionati di web design, UI/UX e strategie digitali.',
    type: 'website',
  },
};

export default function ChiSiamoPage() {
  return (
    <div>
      <ChiSiamoHero />
      <Container>
      <Team />
        <Contact />
      </Container>
    </div>
  );
}
