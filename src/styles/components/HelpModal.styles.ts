import type { Theme } from '../../types';
import * as tokens from '../tokens';

export const useHelpModalStyles = (theme: Theme) => {
  const isLight = theme === 'light';
  
  return {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },

    modal: {
      width: '90%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflowY: 'auto' as const,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
      animation: 'modalFadeIn 0.2s ease-out forwards',
      backgroundColor: isLight ? '#000080' : tokens.colors.dark.background,
      border: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`,
      color: isLight ? '#FFFFFF' : tokens.colors.dark.text
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderBottom: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`
    },

    title: {
      margin: 0,
      fontSize: '1.25rem',
      fontFamily: 'Share Tech Mono, monospace',
      fontWeight: 'bold'
    },

    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0 0.5rem',
      margin: '-0.5rem',
      fontFamily: 'inherit',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent
    },

    content: {
      padding: '1rem'
    },

    section: {
      marginBottom: '1.5rem'
    },

    sectionTitle: {
      margin: '0 0 0.75rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      borderBottom: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`,
      paddingBottom: '0.25rem',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent
    },

    commandsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gridGap: '0.75rem',
      
      // Mobile responsiveness
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },

    commandItem: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Share Tech Mono, monospace'
    },

    commandKey: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '0.1rem 0.4rem',
      borderRadius: '2px',
      marginRight: '0.5rem',
      border: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.accent}`,
      fontWeight: 'bold',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent
    },

    commandDesc: {
      fontSize: '0.9rem'
    }
  };
};