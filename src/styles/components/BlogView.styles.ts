import type { Theme } from '../../types';

export const useBlogViewStyles = (theme: Theme) => {
  const isDebianTheme = theme === 'light';
  
  return {
    // Base prose styles
    prose: {
      fontSize: '1rem',
      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
    },

    // Prose headings
    proseHeadings: {
      fontWeight: 'bold',
      marginTop: '1.5rem',
      marginBottom: '1rem',
    },

    proseH1: {
      fontSize: '1.5rem',
    },

    proseH2: {
      fontSize: '1.25rem',
    },

    proseH3: {
      fontSize: '1.125rem',
    },

    // Prose text elements
    proseParagraph: {
      marginTop: '1rem',
      marginBottom: '1rem',
    },

    proseLists: {
      marginTop: '1rem',
      marginBottom: '1rem',
      paddingLeft: '1.5rem',
    },

    proseUnorderedList: {
      listStyleType: 'disc',
    },

    proseOrderedList: {
      listStyleType: 'decimal',
    },

    // Code styling
    proseInlineCode: {
      fontFamily: 'monospace',
      paddingLeft: '0.25rem',
      paddingRight: '0.25rem',
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      borderRadius: '0.25rem',
      backgroundColor: isDebianTheme 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)',
    },

    proseCodeBlock: {
      marginTop: '1rem',
      marginBottom: '1rem',
      padding: '1rem',
      borderRadius: '0.25rem',
      overflowX: 'auto' as const,
      backgroundColor: isDebianTheme 
        ? 'rgba(0, 0, 0, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)',
    },

    proseCodeBlockCode: {
      padding: '0',
      backgroundColor: 'transparent',
    },

    // Blockquote
    proseBlockquote: {
      paddingLeft: '1rem',
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      borderLeftColor: isDebianTheme ? '#007ef2' : '#C0C0C0',
      fontStyle: 'italic',
      marginTop: '1rem',
      marginBottom: '1rem',
    },

    // Links
    proseLink: {
      textDecoration: 'underline',
      color: isDebianTheme ? '#00ffd9' : '#00AAFF',
    },

    // Theme-specific overrides
    proseThemeLight: {
      color: 'black',
    },
  };
};

export default useBlogViewStyles;