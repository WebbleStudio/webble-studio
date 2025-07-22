import { Variants } from 'framer-motion';

// Animation configuration constants
export const ANIMATION_CONFIG = {
  durations: {
    container: 0.5,
    title: 0.4,
    image: 0.5,
    labels: 0.4,
    label: 0.3,
    background: 0.6,
    arrow: 0.3,
  },
  stagger: {
    container: 0.08,
    labels: 0.06,
  },
  easing: [0.25, 0.1, 0.25, 1] as const,
};

// Project animation variants
export const projectAnimationVariants = {
  container: {
    initial: { opacity: 0, y: 20 },
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
      y: -10,
      transition: { duration: 0.3 },
    },
  } as Variants,

  title: {
    initial: { opacity: 0, x: -30 },
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
      x: 30,
      transition: {
        duration: 0.3,
        ease: ANIMATION_CONFIG.easing,
      },
    },
  } as Variants,

  titleTypewriter: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.025,
        delayChildren: 0.05,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.015,
        staggerDirection: -1,
      },
    },
  } as Variants,

  titleChar: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.3,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.3, ease: 'easeOut' },
        scale: { duration: 0.4, ease: 'backOut' },
        filter: { duration: 0.4, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.8,
      filter: 'blur(8px)',
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  } as Variants,

  titleCursor: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  } as Variants,

  image: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.durations.image,
        ease: ANIMATION_CONFIG.easing,
      },
    },
  } as Variants,

  imageFadeUp: {
    initial: {
      y: 30,
      opacity: 0,
      filter: 'blur(8px)',
      scale: 1.05,
    },
    animate: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.6, ease: 'easeOut' },
        y: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
        filter: { duration: 0.7, ease: 'easeOut' },
        scale: { duration: 0.8, ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  } as Variants,

  labels: {
    initial: { opacity: 0, y: 15 },
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
    initial: { opacity: 0, y: 8 },
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
      scale: 1.2,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: ANIMATION_CONFIG.durations.arrow,
        ease: ANIMATION_CONFIG.easing,
      },
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 },
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

  h3: {
    initial: {
      opacity: 0,
      y: 15,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: ANIMATION_CONFIG.easing,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: 'blur(4px)',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  } as Variants,
};
