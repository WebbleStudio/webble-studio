'use client';

import Link from 'next/link';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function AdminHeader() {
  const { theme, toggleTheme, mounted } = useDarkMode();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0b0b0b] border-b border-neutral-200 dark:border-neutral-700 h-[75px]">
      <div className="max-w-[1650px] mx-auto px-5 md:px-[30px] h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/img/webble-white-logo-nero.svg"
            alt="Webble Studio"
            className="h-8 dark:hidden"
          />
          <img
            src="/img/webble-white-logo.svg"
            alt="Webble Studio"
            className="h-8 hidden dark:block"
          />
        </div>

        {/* Right side - Toggle and Back button */}
        <div className="flex items-center gap-4">
          {/* Dark mode toggle - Custom implementation */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all duration-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm flex items-center justify-center"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                // Moon icon per dark mode - colore #0b0b0b in white mode
                <svg
                  className="w-4 h-4 text-[#0b0b0b] dark:text-[#fafafa]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                // Sun icon per light mode - colore #fafafa in dark mode
                <svg
                  className="w-4 h-4 text-[#fafafa]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Back to site button */}
          <Link
            href="/"
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}
