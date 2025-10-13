import { Variants } from 'framer-motion';

// Animation configuration constants - ottimizzato per performance
export const ANIMATION_CONFIG = {
  durations: {
    container: 0.4, // Ridotto da 0.5
    title: 0.3, // Ridotto da 0.4
    image: 0.4, // Ridotto da 0.5
    labels: 0.3, // Ridotto da 0.4
    label: 0.25, // Ridotto da 0.3
    background: 0.5, // Ridotto da 0.6
    arrow: 0.2, // Ridotto da 0.3
  },
  stagger: {
    container: 0.06, // Ridotto da 0.08
    labels: 0.04, // Ridotto da 0.06
    characters: 0.02, // Nuovo: per character animations
  },
  easing: [0.25, 0.1, 0.25, 1] as const,
  // Nuove costanti per ottimizzazioni
  performance: {
    maxBlur: 6, // Ridotto da 10px
    reducedMotion: false, // Detectable via CSS media query
  },
};

// Project animation variants - ottimizzati
export const projectAnimationVariants = {
  container: {
    initial: { opacity: 0, y: 15 }, // Ridotto da y: 20
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.container,
        ease: ANIMATION_CONFIG.easing,
        staggerChildren: ANIMATION_CONFIG.stagger.container,
      },
    },
    exit: {
      opacity: 0,
      y: -8, // Ridotto da -10
      transition: { duration: 0.25 }, // Ridotto da 0.3
    },
  } as Variants,

  title: {
    initial: { opacity: 0, x: -20 }, // Ridotto da x: -30
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.title,
        ease: ANIMATION_CONFIG.easing,
      },
    },
    exit: {
      opacity: 0,
      x: 20, // Ridotto da x: 30
      transition: {
        duration: 0.25, // Ridotto da 0.3
        ease: ANIMATION_CONFIG.easing,
      },
    },
  } as Variants,

  titleTypewriter: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: ANIMATION_CONFIG.stagger.characters,
        delayChildren: 0.03, // Ridotto da 0.05
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.01, // Ridotto da 0.015
        staggerDirection: -1,
      },
    },
  } as Variants,

  // Ottimizzato: rimosso blur per performance massima
  titleChar: {
    initial: {
      opacity: 0,
      y: 10, // Ridotto ulteriormente
      scale: 0.8, // Ridotto da 0.5 per essere meno aggressivo
      // Rimosso blur completamente
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3, // Ridotto da 0.4
        ease: ANIMATION_CONFIG.easing,
      },
    },
    exit: {
      opacity: 0,
      y: -5, // Ridotto da -8
      scale: 0.95, // Meno aggressivo
      transition: {
        duration: 0.1, // Ridotto da 0.15
        ease: 'easeIn',
      },
    },
  } as Variants,

  // Semplificato per performance
  titleCursor: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1.0, // Ridotto da 1.2
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 }, // Ridotto
    },
  } as Variants,

  image: {
    initial: { opacity: 0, y: 15 }, // Ridotto da y: 20
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.image,
        ease: ANIMATION_CONFIG.easing,
      },
    },
  } as Variants,

  // Animazione elegante senza blur - crossfade smooth
  imageFadeUp: {
    initial: {
      opacity: 0,
      scale: 1.01, // Scale molto leggero per evitare il "pop"
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4, ease: 'easeOut' },
        scale: { duration: 0.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.99, // Scale molto leggero
      transition: {
        duration: 0.3,
        ease: 'easeIn',
        opacity: { duration: 0.2, ease: 'easeIn' },
        scale: { duration: 0.3, ease: 'easeIn' },
      },
    },
  } as Variants,

  // Nuova animazione: slide crossfade (più elegante)
  imageSlideCrossfade: {
    initial: {
      opacity: 0,
      x: 20, // Leggero movimento orizzontale
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4, ease: 'easeOut' },
        x: { duration: 0.6, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
        opacity: { duration: 0.2, ease: 'easeIn' },
        x: { duration: 0.4, ease: 'easeIn' },
      },
    },
  } as Variants,

  // Animazione: zoom crossfade (molto elegante) - crossfade perfetto
  imageZoomCrossfade: {
    initial: {
      opacity: 0,
      scale: 1.05, // Zoom in leggero
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4, ease: 'easeOut' },
        scale: { duration: 0.6, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95, // Zoom out leggero
      transition: {
        duration: 0.3, // Ridotto per crossfade più veloce
        ease: 'easeIn',
        opacity: { duration: 0.3, ease: 'easeIn' },
        scale: { duration: 0.3, ease: 'easeIn' },
      },
    },
  } as Variants,

  // Nuova animazione: crossfade perfetto senza vuoti
  imagePerfectCrossfade: {
    initial: {
      opacity: 0,
      scale: 1.02, // Scale molto leggero
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.4, ease: 'easeOut' },
        scale: { duration: 0.5, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98, // Scale molto leggero
      transition: {
        duration: 0.3, // Stessa durata per crossfade perfetto
        ease: 'easeIn',
        opacity: { duration: 0.3, ease: 'easeIn' },
        scale: { duration: 0.3, ease: 'easeIn' },
      },
    },
  } as Variants,

  labels: {
    initial: { opacity: 0, y: 12 }, // Ridotto da y: 15
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.labels,
        staggerChildren: ANIMATION_CONFIG.stagger.labels,
      },
    },
  } as Variants,

  label: {
    initial: { opacity: 0, y: 6 }, // Ridotto da y: 8
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.label,
        ease: ANIMATION_CONFIG.easing,
      },
    },
  } as Variants,

  arrow: {
    initial: { scale: 1 },
    hover: {
      scale: 1.15, // Ridotto da 1.2
      rotate: [0, -8, 8, 0], // Ridotto da [-10, 10]
      transition: {
        duration: ANIMATION_CONFIG.durations.arrow,
        ease: ANIMATION_CONFIG.easing,
      },
    },
    tap: {
      scale: 0.92, // Ridotto da 0.9
      transition: { duration: 0.08 }, // Ridotto
    },
  } as Variants,

  background: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: ANIMATION_CONFIG.durations.background,
      ease: ANIMATION_CONFIG.easing,
    },
  },

  // Ottimizzato SENZA BLUR per evitare problemi su Chromium/Brave
  h3: {
    initial: {
      opacity: 0,
      y: 12, // Ridotto da 15
      scale: 0.97, // Scale invece di blur
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4, // Ridotto da 0.5
        ease: ANIMATION_CONFIG.easing,
        delay: 0.08, // Ridotto da 0.1
      },
    },
    exit: {
      opacity: 0,
      y: -8, // Ridotto da -10
      scale: 0.98, // Scale invece di blur
      transition: {
        duration: 0.25, // Ridotto da 0.3
        ease: 'easeIn',
      },
    },
  } as Variants,
};
