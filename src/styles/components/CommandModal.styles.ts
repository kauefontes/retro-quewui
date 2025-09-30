import type { Theme } from '../../types';
import * as tokens from '../tokens';

export const useCommandModalStyles = (theme: Theme) => {
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  
  return {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },

    modal: {
      width: '90%',
      maxWidth: '500px',
      backgroundColor: isLight ? '#000080' : tokens.colors.dark.backgroundSecondary,
      border: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`,
      borderRadius: tokens.borderRadius.md,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
      animation: 'modalFadeIn 0.2s ease-out forwards'
    },

    inputContainer: {
      boxSizing: 'border-box' as const,
      overflowX: 'hidden' as const,
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`
    },

    prompt: {
      fontFamily: 'Share Tech Mono, monospace',
      fontWeight: 'bold',
      marginRight: '0.5rem',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent
    },

    inputWrapper: {
      flex: 1,
      position: 'relative' as const
    },

    input: {
      width: '100%',
      maxWidth: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '1rem',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.text,
      padding: '0.25rem 0',
      caretColor: 'transparent'
    },

    inputError: {
      color: isLight ? '#FFCC00' : '#FF5555'
    },

    cursor: {
      position: 'absolute' as const,
      top: 0,
      width: '0.6rem',
      height: '1.2rem',
      backgroundColor: isLight ? '#FFFFFF' : tokens.colors.dark.accent,
      opacity: 0.7,
      animation: 'blink 1s step-end infinite'
    },

    shortcutHelp: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      padding: '0.5rem 1rem',
      fontSize: '0.8rem',
      opacity: 0.7,
      backgroundColor: isLight ? '#000080' : tokens.colors.dark.background,
      color: isLight ? '#FFFFFF' : tokens.colors.dark.textSecondary
    },

    loginMessage: {
      width: '100%',
      maxWidth: '100%',
      textAlign: 'center' as const,
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent,
      fontWeight: 'bold',
      opacity: 1
    },

    helpModalActive: {
      padding: '0.5rem 1rem',
      margin: '0.5rem',
      backgroundColor: 'rgba(255, 255, 0, 0.2)',
      border: '1px solid #ffcc00',
      color: '#ffcc00',
      textAlign: 'center' as const,
      borderRadius: tokens.borderRadius.md,
      fontSize: '0.9rem'
    },

    helpMessage: {
      color: '#ffcc00',
      textAlign: 'center' as const,
      fontStyle: 'italic',
      padding: '0.5rem'
    },

    // Error state for input
    commandError: {
      padding: '0.5rem 1rem',
      color: isLight ? '#FFCC00' : '#FF5555',
      textAlign: 'center' as const,
      fontSize: '0.9rem',
      backgroundColor: isDark ? 'rgba(255, 85, 85, 0.1)' : 'rgba(255, 204, 0, 0.1)'
    }
  };
};