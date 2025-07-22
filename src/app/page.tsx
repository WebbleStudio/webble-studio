import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Home/Hero';
import Payoff from '@/components/sections/Home/Payoff';
import KeyPoints from '@/components/sections/Home/KeyPoints';
import Services from '@/components/sections/Home/Services';
import Projects from '@/components/sections/Home/Projects';
import Contact from '@/components/sections/Home/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Payoff />
      <Container>
        <KeyPoints />
        <Services />
      </Container>
        <Projects />
      <Container>
         <Contact />
      </Container>
    </main>
  );
}
