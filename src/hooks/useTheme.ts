import { useAppStore } from '../store/appStore';
import { useEffect } from 'react';
import type { Theme } from '../types';

/**
 * Custom hook that provides theme information and helper functions.
 * It's a wrapper around the theme state from the app store.
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useAppStore();

  // Helper to check if we're using the debian-like light theme
  const isDebianTheme = theme === 'light';

  // Get the appropriate value based on the current theme
  const getThemeValue = <T>(darkValue: T, lightValue: T): T => {
    return isDebianTheme ? lightValue : darkValue;
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Define the handler function
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };

    // Add the listener
    mediaQuery.addEventListener('change', handleThemeChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDebianTheme,
    getThemeValue,
  };
};
