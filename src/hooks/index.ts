/**
 * Centralized exports for all custom hooks
 * Provides a single import point for hooks across the application
 */

export { useTranslation } from './useTranslation';
export { useProjectTranslation } from './useProjectTranslation';
export { usePerformance } from './usePerformance';
export { useDarkMode } from './useDarkMode';
export { useApiCall } from './useApiCall';
export { useAnimationManager } from './useAnimationManager';
export { useServiceCategories } from './useServiceCategories';
export { useServiceImages } from './useServiceImages';
export { useHomeData } from './useHomeData';
export { usePortfolioData } from './usePortfolioData';
export { useBookings } from './useBookings';
export { useProjectsBatch } from './useProjectsBatch';
export { useHighlightsBatch } from './useHighlightsBatch';
export { useServicesBatch } from './useServicesBatch';

// Admin-specific hooks con cache 24h
export { useAdminCache, clearAdminCache, getCacheAge } from './useAdminCache';
export { useAdminBookings } from './useAdminBookings';
export { useCookieConsent } from './useCookieConsent';
export { useCookieManager } from './useCookieManager';
export { usePageTracking } from './usePageTracking';
export { useRevalidate } from './useRevalidate';

// Lazy loading hooks
export { useLazyLoad } from './useLazyLoad';
export { useSplineLazyLoad } from '../components/animations/useSplineLazyLoad';

// Animation hooks
export { useProjectSwitch } from '../components/animations/useProjectSwitch';
export { useHeaderAnimation } from '../components/animations/useHeaderAnimation';
export { useServiceCategoryAnimation } from '../components/animations/useServiceCategoryAnimation';
export { useMenuOverlayAnimation } from '../components/animations/useMenuOverlayAnimation';
export { usePortfolioFiltersAnimation } from '../components/animations/usePortfolioFiltersAnimation';
export { usePortfolioProjectsAnimation } from '../components/animations/usePortfolioProjectsAnimation';
