import Container from '@/components/layout/Container';
import ChiSiamoHero from '@/components/sections/chi-siamo/hero';
import Team from '@/components/sections/chi-siamo/Team';
import Contact from '@/components/sections/Home/Contact';

// Pure Static - NO runtime, NO functions
export const dynamic = 'error'; // Forza static, errore se prova dynamic

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
