/**
 * Home Page - Server Component
 * Usa Server Actions per fetch dati dal database
 * Zero Edge Functions, zero network overhead
 */
import { getHomeData } from '@/lib/serverActions';
import HomeContent from '@/components/sections/Home/HomeContent';

export default async function Home() {
  // Server Action: fetch dati direttamente dal database
  // Nessuna API call, nessuna Edge Function
  const { heroProjects, serviceCategories } = await getHomeData();

  // Passa TUTTI i dati necessari al Client Component
  return <HomeContent heroProjects={heroProjects} serviceCategories={serviceCategories} />;
}
