import { useAppStore } from '../store/appStore';

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
  
  return {
    theme,
    setTheme,
    toggleTheme,
    isDebianTheme,
    getThemeValue,
  };
};