import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Inizializza il tema dal localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const initialTheme = savedTheme || 'light'; // Default sempre light

      setTheme(initialTheme);
      setMounted(true);
    } catch (error) {
      // Fallback se localStorage non è disponibile
      setTheme('light');
      setMounted(true);
    }
  }, []);

  // Applica il tema al documento
  useEffect(() => {
    if (mounted) {
      try {
        const root = document.documentElement;

        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);
      } catch (error) {
        // Gestisci errori di localStorage o DOM
        console.warn('Unable to set theme:', error);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  return {
    theme,
    mounted,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
  };
}
