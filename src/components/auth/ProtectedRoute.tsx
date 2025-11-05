'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Reset redirect flag se cambia il pathname
    if (pathname !== '/admin') {
      redirectAttempted.current = false;
      setIsRedirecting(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Aspetta che il loading finisca
    if (status === 'loading') {
      return;
    }

    // Se non c'è sessione e non abbiamo ancora tentato il redirect
    if (!session && !isRedirecting && !redirectAttempted.current && pathname === '/admin') {
      redirectAttempted.current = true;
      setIsRedirecting(true);
      
      // Usa replace invece di push per evitare loop
      router.replace('/login');
    }
  }, [session, status, router, isRedirecting, pathname]);

  // Mostra loading mentre verifica la sessione
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352] mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Se non c'è sessione e stiamo reindirizzando, mostra loading
  if (!session && (isRedirecting || redirectAttempted.current)) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352] mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Reindirizzamento al login...</p>
        </div>
      </div>
    );
  }

  // Se non c'è sessione, non renderizzare nulla (il redirect è già in corso)
  if (!session) {
    return null;
  }

  // Se c'è sessione, renderizza i children
  return <>{children}</>;
}
