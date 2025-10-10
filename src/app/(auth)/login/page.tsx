'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/hooks/useDarkMode';
import AnimatedText from '@/components/ui/AnimatedText';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: session, status } = useSession();
  const router = useRouter();

  // Inizializza il theme system
  useDarkMode();

  // Gestisci il redirect se l'utente è già loggato
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/admin');
    }
  }, [session, status, router]);

  // Se l'utente è già loggato, reindirizza a /admin
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0b0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352]"></div>
      </div>
    );
  }

  // Se l'utente è già autenticato, mostra loading mentre redirect
  if (status === 'authenticated' && session) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F20352] mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Reindirizzamento...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenziali non valide');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b0b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e titolo */}
        <div className="text-center mb-8">
          <AnimatedText
            as="h1"
            className="text-2xl font-figtree font-medium text-black dark:text-white mb-2"
          >
            Admin Login
          </AnimatedText>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Accedi alla dashboard di amministrazione
          </p>
        </div>

        {/* Form di login */}
        <div className="bg-white dark:bg-[#0b0b0b] border border-neutral-200 dark:border-neutral-700 rounded-[25px] p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-black dark:text-white"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#F20352] transition-colors"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-black dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#F20352] transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#F20352] hover:bg-[#F20352]/90 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accesso in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © 2024 Webble Studio. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </div>
  );
}
