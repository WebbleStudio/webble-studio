'use client';

import { usePathname } from 'next/navigation';
import LenisScroll from './LenisScroll';

export default function LenisProvider() {
  const pathname = usePathname();
  
  // Disabilita Lenis per admin e portfolio
  const isAdminOrPortfolio = pathname.startsWith('/admin') || pathname.startsWith('/portfolio');
  
  return <LenisScroll disabled={isAdminOrPortfolio} />;
}
