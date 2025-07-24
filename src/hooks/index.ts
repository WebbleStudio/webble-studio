/**
 * Centralized exports for all custom hooks
 * Provides a single import point for hooks across the application
 */

export { useSectionScroll } from './useSectionScroll';
export { useTranslation } from './useTranslation';
export { usePerformance } from './usePerformance';
export { useDarkMode } from './useDarkMode';
export { useApiCall } from './useApiCall';
export { useAnimationManager } from './useAnimationManager';

// Lazy loading hooks
export { useLazyLoad } from './useLazyLoad';
export { useSplineLazyLoad } from '../components/animations/useSplineLazyLoad';

// Animation hooks
export { useProjectSwitch } from '../components/animations/useProjectSwitch';
export { useHeaderAnimation } from '../components/animations/useHeaderAnimation';
export { useServiceCategoryAnimation } from '../components/animations/useServiceCategoryAnimation';
export { useMenuOverlayAnimation } from '../components/animations/useMenuOverlayAnimation';
