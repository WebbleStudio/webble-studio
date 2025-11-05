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
      {/* SEO-optimized intro paragraph - positioned before Hero for better snippet control */}
      {/* This paragraph matches the meta description to help Google prefer it over visible content */}
      <div className="absolute left-0 top-0 w-px h-px overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        <p>
          Contatta Webble Studio per il tuo progetto digitale. Agenzia web design Milano specializzata in strategie digitali creative e ad alte prestazioni. Prenota una call gratuita con i nostri founder. Siamo sempre pronti a rispondere alle tue domande.
        </p>
      </div>
      <Hero />
      <Container>
        <Title />
        <Contatti />
        <Form />
      </Container>
    </main>
  );
}
