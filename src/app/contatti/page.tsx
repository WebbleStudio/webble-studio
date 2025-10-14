import Hero from '@/components/sections/contatti/Hero';
import Title from '@/components/sections/contatti/Title';
import Contatti from '@/components/sections/contatti/contatti';
import Form from '@/components/sections/contatti/Form';
import Container from '@/components/layout/Container';

// Pure Static - NO runtime, NO functions
export const dynamic = 'error'; // Forza static, errore se prova dynamic

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
