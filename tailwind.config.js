/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Abilita dark mode basata su classe
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '390px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1300px',
      '2xl': '1920px',
    },
    extend: {
      colors: {
        main: 'var(--main-color)',
        second: 'var(--second-color)',

        // Sistema completo dark mode
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-primary-60': 'var(--text-primary-60)',
        'text-inverse': 'var(--text-inverse)',

        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-glass': 'var(--bg-glass)',
        'bg-overlay': 'var(--bg-overlay)',
        'bg-card': 'var(--bg-card)',

        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        'border-primary-20': 'var(--border-primary-20)',
        'border-primary-40': 'var(--border-primary-40)',
        'border-primary-50': 'var(--border-primary-50)',
        'border-dark-20': 'var(--border-dark-20)',
        'border-dark-40': 'var(--border-dark-40)',
        'border-dark-50': 'var(--border-dark-50)',

        'hover-overlay': 'var(--hover-overlay)',
        'hover-bg-secondary': 'var(--hover-bg-secondary)',

        'icon-filter': 'var(--icon-filter)',
        'button-glass-bg': 'var(--button-glass-bg)',
        'button-glass-border': 'var(--button-glass-border)',

        'line-fixed': 'var(--line-fixed)',
        'line-fixed-focus': 'var(--line-fixed-focus)',

        // Nuovo: border specifico per label progetti
        'label-project': 'var(--border-label-project)',
      },
      fontFamily: {
        figtree: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
