import type { Theme } from '../../types';

export const useBootScreenStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  
  return {
    bootScreen: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 'var(--space-xl)',
      height: '100vh',
      fontFamily: "'Share Tech Mono', monospace",
      overflow: 'hidden' as const,
      backgroundColor: isDark ? 'black' : 'var(--light-bg-primary)',
      color: isDark ? 'var(--dark-accent-color)' : 'var(--light-text-primary)',
    },

    bootHeader: {
      textAlign: 'center' as const,
      marginBottom: 'var(--space-xl)',
    },

    asciiArt: {
      marginBottom: 'var(--space-md)',
      lineHeight: 1.2,
      whiteSpace: 'pre' as const,
      fontSize: 'var(--text-sm)',
      overflow: 'hidden' as const,
      textOverflow: 'clip' as const,
    },

    bootTitle: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'bold' as const,
      marginBottom: 'var(--space-xs)',
    },

    bootSubtitle: {
      marginBottom: 'var(--space-md)',
      opacity: 0.8,
    },

    bootMessages: {
      width: '100%',
      maxWidth: '28rem',
    },

    bootMessage: {
      display: 'flex',
      alignItems: 'center' as const,
      marginBottom: 'var(--space-xs)',
      animation: 'fadeIn 0.3s ease-in-out',
    },

    bootPrompt: {
      color: 'var(--accent-color)',
      marginRight: 'var(--space-xs)',
    },

    // Mobile responsive styles
    asciiArtMobile: {
      marginBottom: 'var(--space-md)',
      lineHeight: 1.2,
      whiteSpace: 'pre' as const,
      fontSize: '0.7rem',
      overflow: 'hidden' as const,
      textOverflow: 'clip' as const,
    },

    bootTitleMobile: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'bold' as const,
      marginBottom: 'var(--space-xs)',
    },

    asciiArtHidden: {
      display: 'none',
    },
  };
};

export default useBootScreenStyles;