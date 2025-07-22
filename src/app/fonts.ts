import { Figtree, Poppins } from 'next/font/google';

// Figtree font configuration
export const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Poppins font configuration
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// CSS variables for use in components
export const fontVariables = `${figtree.variable} ${poppins.variable}`;
