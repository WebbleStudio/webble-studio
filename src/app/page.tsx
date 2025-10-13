/**
 * Home Page - Server Component
 * Usa Server Actions per fetch dati dal database
 * Zero Edge Functions, zero network overhead
 */
import { getHomeData } from '@/lib/serverActions';
import HomeContent from '@/components/sections/Home/HomeContent';

// Force Node.js runtime (non Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 3600; // ISR: revalidate ogni ora

export default async function Home() {
  // Server Action: fetch dati direttamente dal database
  // Nessuna API call, nessuna Edge Function
  const { heroProjects, serviceCategories } = await getHomeData();

  // Passa TUTTI i dati necessari al Client Component
  return <HomeContent heroProjects={heroProjects} serviceCategories={serviceCategories} />;
}
