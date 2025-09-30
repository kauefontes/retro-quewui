import type { Theme } from '../../../types';

export const useTerminalLayoutStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  
  return {
    terminalContainer: {
      boxSizing: 'border-box' as const,
      overflowX: 'hidden' as const,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
      backgroundColor: isDark ? 'var(--dark-bg-primary)' : 'var(--light-bg-primary)',
      color: isDark ? 'var(--dark-text-primary)' : 'var(--light-text-primary)',
    },

    terminalWindow: {
      height: 'calc(100vh - 2rem)',
      margin: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
      boxSizing: 'border-box' as const,
      backgroundColor: isDark ? 'black' : 'var(--light-bg-primary)',
      border: isDark 
        ? '2px solid var(--dark-border-secondary)' 
        : '2px solid var(--light-border-secondary)',
      boxShadow: isDark 
        ? '0 0 10px rgba(0, 255, 217, 0.6)' 
        : 'inset 1px 1px 0px #FFFFFF, inset -1px -1px 0px #707070',
      borderRadius: isDark ? 'var(--radius-sm)' : 'var(--radius-none)',
    },

    terminalContentWrapper: {
      flex: '1 1 auto',
      overflow: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      padding: 'var(--space-md)',
    },

    // Mobile responsive styles
    terminalWindowMobile: {
      height: 'calc(100vh - 1rem)',
      margin: '0.5rem',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden' as const,
      boxSizing: 'border-box' as const,
      backgroundColor: isDark ? 'black' : 'var(--light-bg-primary)',
      border: isDark 
        ? '2px solid var(--dark-border-secondary)' 
        : '2px solid var(--light-border-secondary)',
      boxShadow: isDark 
        ? '0 0 10px rgba(0, 255, 217, 0.6)' 
        : 'inset 1px 1px 0px #FFFFFF, inset -1px -1px 0px #707070',
      borderRadius: isDark ? 'var(--radius-sm)' : 'var(--radius-none)',
    },
  };
};

export default useTerminalLayoutStyles;