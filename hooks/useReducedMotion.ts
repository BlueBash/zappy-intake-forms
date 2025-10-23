import { useEffect, useState } from 'react';

/**
 * Hook to detect user's motion preferences
 * Returns true if user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Animation configuration based on motion preferences
 */
export const useAnimationConfig = () => {
  const reducedMotion = useReducedMotion();

  return {
    reducedMotion,
    // Standard durations - Slower, more refined
    duration: {
      fast: reducedMotion ? 0.01 : 0.35,
      normal: reducedMotion ? 0.01 : 0.45,
      slow: reducedMotion ? 0.01 : 0.65,
      page: reducedMotion ? 0.01 : 0.5,
    },
    // Standard easing - Smoother curves
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    smoothEase: [0.4, 0, 0.2, 1] as [number, number, number, number],
    // Motion variants
    fadeIn: reducedMotion ? 
      { initial: { opacity: 1 }, animate: { opacity: 1 } } : 
      { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slideUp: reducedMotion ? 
      { initial: { y: 0, opacity: 1 }, animate: { y: 0, opacity: 1 } } : 
      { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  };
};