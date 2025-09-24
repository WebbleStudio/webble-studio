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

  // Ottimizzato: meno blur, scale ridotto
  imageFadeUp: {
    initial: {
      y: 20, // Ridotto da 30
      opacity: 0,
      filter: `blur(${ANIMATION_CONFIG.performance.maxBlur}px)`, // Ridotto blur
      scale: 1.03, // Ridotto da 1.05
    },
    animate: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.6, // Ridotto da 0.8
        ease: ANIMATION_CONFIG.easing,
        opacity: { duration: 0.4, ease: 'easeOut' }, // Ridotto
        y: { duration: 0.6, ease: ANIMATION_CONFIG.easing },
        filter: { duration: 0.5, ease: 'easeOut' }, // Ridotto
        scale: { duration: 0.6, ease: 'easeOut' }, // Ridotto
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97, // Ridotto da 0.95
      filter: `blur(${ANIMATION_CONFIG.performance.maxBlur / 3}px)`, // Blur minimo
      transition: {
        duration: 0.3, // Ridotto da 0.4
        ease: 'easeIn',
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

  // Ottimizzato con meno blur
  h3: {
    initial: {
      opacity: 0,
      y: 12, // Ridotto da 15
      filter: `blur(${ANIMATION_CONFIG.performance.maxBlur / 2}px)`, // Blur ridotto
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4, // Ridotto da 0.5
        ease: ANIMATION_CONFIG.easing,
        delay: 0.08, // Ridotto da 0.1
      },
    },
    exit: {
      opacity: 0,
      y: -8, // Ridotto da -10
      filter: `blur(${ANIMATION_CONFIG.performance.maxBlur / 3}px)`,
      transition: {
        duration: 0.25, // Ridotto da 0.3
        ease: 'easeIn',
      },
    },
  } as Variants,
};
