type AnimationState = 'closed' | 'open' | 'closing';

// Variants per l'overlay principale del menu
export const menuOverlayVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -30,
  },
};

// Variants per il contenuto del menu - ottimizzati senza blur per prestazioni
export const menuContentVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -25,
    scale: 0.9,
  },
};

// Variants per i singoli item del menu
export const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -15,
  },
};

// Variants per i separatori del menu
export const menuSeparatorVariants = {
  hidden: {
    opacity: 0,
    scaleX: 0,
  },
  visible: {
    opacity: 1,
    scaleX: 1,
  },
  exit: {
    opacity: 0,
    scaleX: 0,
  },
};

// Funzione per ottenere le transitions basate sullo stato dell'animazione
export const getMenuTransitions = (animationState: AnimationState) => {
  const baseTransition = {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  switch (animationState) {
    case 'open':
      return {
        ...baseTransition,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      };
    case 'closing':
      return {
        ...baseTransition,
        duration: 0.2,
        staggerChildren: 0.02,
        staggerDirection: -1,
      };
    case 'closed':
    default:
      return baseTransition;
  }
}; 