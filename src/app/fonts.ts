// Import local font files instead of Google Fonts CDN
import '@fontsource/figtree/300.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';

// Font family configurations ciaooo
export const figtree = {
  style: {
    fontFamily: 'Figtree, system-ui, sans-serif',
  },
  className: 'font-figtree',
  variable: '--font-figtree',
};

export const poppins = {
  style: {
    fontFamily: 'Poppins, system-ui, sans-serif',
  },
  className: 'font-poppins',
  variable: '--font-poppins',
};

// CSS variables for use in components
export const fontVariables = `${figtree.variable} ${poppins.variable}`;
