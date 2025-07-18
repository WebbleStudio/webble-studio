import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Home/Hero';
import Payoff from '@/components/sections/Home/Payoff';

export default function Home() {
  return (
    <main>
      <Hero />
      <Payoff />
      <Container>
        <></>
      </Container>
    </main>
  );
}
