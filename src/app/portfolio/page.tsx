import { createClient } from '@supabase/supabase-js';
import Container from '@/components/layout/Container';
import Hero from '@/components/sections/Portfolio/Hero';
import PortfolioProjectsStatic from '@/components/sections/Portfolio/PortfolioProjectsStatic';

// Server-side data fetching (STATICO - esegue al BUILD TIME)
async function getPortfolioData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('order_position', { ascending: true });

  return {
    projects: projects || [],
  };
}

// Server Component - genera HTML statico al build
export default async function PortfolioPage() {
  // Fetch data server-side al build time (1 sola volta)
  const { projects } = await getPortfolioData();

  return (
    <main>
      <Hero />
      <Container>
        <PortfolioProjectsStatic projects={projects} />
      </Container>
    </main>
  );
}

// Forza la rigenerazione statica SOLO on-demand (quando admin clicca "Aggiorna Sito")
export const revalidate = false;
