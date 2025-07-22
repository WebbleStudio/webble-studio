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
};
