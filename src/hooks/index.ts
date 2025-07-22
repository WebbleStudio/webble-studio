/**
 * Centralized exports for all custom hooks
 * Provides a single import point for hooks across the application
 */

export { useApiCall } from './useApiCall';

// Re-export animation hooks for backward compatibility
export { useProjectSwitch } from '../components/animations/useProjectSwitch';
export { useSplineLazyLoad } from '../components/animations/useSplineLazyLoad';
export { useServiceCategoryAnimation } from '../components/animations/useServiceCategoryAnimation';
export { useHeaderAnimation } from '../components/animations/useHeaderAnimation';
