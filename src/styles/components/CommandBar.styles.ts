import type { Theme } from '../../types';
import * as tokens from '../tokens';

export const useCommandBarStyles = (theme: Theme) => {
  const isLight = theme === 'light';
  
  return {
    commandBar: {
      position: 'absolute' as const,
      width: '12%', // Reduced for essential commands only
      padding: '0.5rem',
      zIndex: 10,
      border: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`,
      borderRadius: '4px',
      flexShrink: 0,
      right: '1rem', // Position to the right
      bottom: '3.5rem', // Position above status bar
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      backgroundColor: isLight ? '#000080' : tokens.colors.dark.backgroundSecondary,
      color: isLight ? '#FFFFFF' : tokens.colors.dark.text,
      
      // Mobile responsiveness
      '@media (max-width: 768px)': {
        width: '20%'
      },
      '@media (max-width: 480px)': {
        width: '30%',
        right: '0.5rem',
        bottom: '3rem'
      }
    },

    content: {
      display: 'flex',
      flexDirection: 'column' as const, // Column for better organization
      padding: '0.5rem',
      gap: '0.5rem'
    },

    modeIndicator: {
      fontFamily: 'Share Tech Mono, monospace',
      fontSize: '0.8rem',
      opacity: 0.8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '0.5rem',
      borderBottom: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.border}`
    },

    adminIndicator: {
      marginLeft: '0.5rem',
      color: isLight ? '#ffcc00' : '#ff5f5f',
      fontWeight: 'bold'
    },

    itemsContainer: {
      boxSizing: 'border-box' as const,
      overflowX: 'hidden' as const,
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Two columns for two commands
      gap: '0.5rem'
    },

    item: {
      display: 'flex',
      flexDirection: 'column' as const, // Stack key and description
      alignItems: 'center',
      cursor: 'pointer',
      padding: '0.2rem',
      borderRadius: '2px',
      transition: 'background-color 0.2s',
      textAlign: 'center' as const
    },

    itemHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },

    itemFocus: {
      outline: '1px solid rgba(255, 255, 255, 0.3)'
    },

    key: {
      display: 'inline-block',
      padding: '0.1rem 0.3rem',
      border: `1px solid ${isLight ? '#FFFFFF' : tokens.colors.dark.accent}`,
      fontFamily: 'Share Tech Mono, monospace',
      fontWeight: 'bold',
      minWidth: '1rem',
      textAlign: 'center' as const,
      marginBottom: '0.25rem',
      color: isLight ? '#FFFFFF' : tokens.colors.dark.accent,
      backgroundColor: isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)'
    },

    description: {
      fontSize: '0.75rem',
      opacity: 0.8
    }
  };
};