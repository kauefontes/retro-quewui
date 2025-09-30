import type { Theme } from '../../types';

export const useTerminalHeaderStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  
  return {
    terminalHeader: {
      display: 'flex',
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: 'var(--space-sm) var(--space-md)',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box' as const,
      backgroundColor: isDark ? 'var(--dark-bg-secondary)' : 'var(--light-bg-secondary)',
      color: isDark ? 'var(--dark-text-primary)' : 'var(--light-text-primary)',
      borderBottom: isDark 
        ? '1px solid var(--dark-border-primary)' 
        : '1px solid var(--light-border-secondary)',
    },

    terminalHeaderLeft: {
      display: 'flex',
      alignItems: 'center' as const,
    },

    terminalTitle: {
      fontWeight: 'bold' as const,
      marginRight: 'var(--space-md)',
    },

    cmdModeIndicator: {
      opacity: 0.7,
    },

    cmdModeIndicatorActive: {
      color: 'var(--accent-color)',
      opacity: 1,
    },

    terminalHeaderButtons: {
      display: 'flex',
      gap: 'var(--space-xs)',
    },

    cmdModeButton: {
      width: '80px',
      textAlign: 'center' as const,
    },

    themeToggleButton: {
      width: '80px',
      textAlign: 'center' as const,
    },
  };
};

export default useTerminalHeaderStyles;