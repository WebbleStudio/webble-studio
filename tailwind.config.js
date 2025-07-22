/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
    },
  },
  plugins: [],
};
