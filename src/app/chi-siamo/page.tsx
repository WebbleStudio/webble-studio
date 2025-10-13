import Container from '@/components/layout/Container';
import ChiSiamoHero from '@/components/sections/chi-siamo/hero';
import Team from '@/components/sections/chi-siamo/Team';
import Contact from '@/components/sections/Home/Contact';

// Force Node.js runtime (non Edge)
export const runtime = 'nodejs';

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
