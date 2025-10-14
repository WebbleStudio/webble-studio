'use client';

import { usePathname } from 'next/navigation';
import LenisScroll from './LenisScroll';

export default function LenisProvider() {
  const pathname = usePathname();
  
  // Disabilita Lenis solo per admin
  const isAdmin = pathname.startsWith('/admin');
  
  return <LenisScroll disabled={isAdmin} />;
}
