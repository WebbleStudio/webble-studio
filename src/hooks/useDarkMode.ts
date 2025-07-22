import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Inizializza il tema dal localStorage o preferenza del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    setMounted(true);
  }, []);

  // Applica il tema al documento
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;

      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      localStorage.setItem('theme', theme);
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
