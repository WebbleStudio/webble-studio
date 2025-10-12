/**
 * Centralized exports for all custom hooks
 * Provides a single import point for hooks across the application
 */

// Core hooks
export { useTranslation } from './core/useTranslation';
export { useProjectTranslation } from './core/useProjectTranslation';
export { useDarkMode } from './core/useDarkMode';
export { useApiCall } from './core/useApiCall';

// Performance hooks
export { usePerformance } from './performance/usePerformance';
export { useLazyLoad } from './performance/useLazyLoad';
export { useSplineLazyLoad } from './performance/useSplineLazyLoad';

// Animation hooks
export { useAnimationManager } from './animations/useAnimationManager';
export { useProjectSwitch } from './useProjectSwitch';
export { useServiceCategoryAnimation } from './useServiceCategoryAnimation';
export { useMenuOverlayAnimation } from './useMenuOverlayAnimation';
export { useServiceTitleScrollAnimation } from './useServiceTitleAnimation';
export { useTiltCard } from './useTiltCard';
export { usePortfolioFiltersAnimation } from '../components/animations/usePortfolioFiltersAnimation';
export { usePortfolioProjectsAnimation } from '../components/animations/usePortfolioProjectsAnimation';

// Data hooks
export { useServiceCategories } from './useServiceCategories';
export { useServiceImages } from './data/useServiceImages';
export { useHomeData } from './data/useHomeData';
export { usePortfolioData } from './data/usePortfolioData';
export { useBookings } from './data/useBookings';
export { useProjects } from './data/useProjects';
export { useHeroProjects } from './data/useHeroProjects';
export { useProjectsBatch } from './data/useProjectsBatch';
export { useHighlightsBatch } from './data/useHighlightsBatch';
export { useServicesBatch } from './data/useServicesBatch';

// Types
export type { Project } from './data/useProjects';
export type { HeroProjectConfig } from './data/useHeroProjects';
export type { EnrichedHeroProject } from './data/useHomeData';
export type { Booking } from './data/useBookings';
export type { ServiceCategory } from './useServiceCategories';

// Admin-specific hooks con cache 24h
export { useAdminCache, clearAdminCache, getCacheAge } from './useAdminCache';
export { useAdminBookings } from './admin/useAdminBookings';
export { useRevalidate } from './admin/useRevalidate';

// UI hooks
export { useCookieConsent } from './ui/useCookieConsent';
export { useCookieManager } from './ui/useCookieManager';
export { usePageTracking } from './ui/usePageTracking';

// Additional hooks
export { useNetworkOptimization } from './useNetworkOptimization';
export { useAnalytics } from './useAnalytics';
export { menuOverlayVariants, menuItemVariants } from './menuAnimations';
