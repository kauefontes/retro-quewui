import type { Theme } from '../../types';

export const useMainContentStyles = (_theme: Theme) => {
  return {
    mainContentContainer: {
      boxSizing: 'border-box' as const,
      overflowX: 'hidden' as const,
      padding: '1rem',
      height: 'calc(100vh - 160px)', // Adequate height considering header and footer
      overflow: 'hidden' as const,
      position: 'relative' as const
    },

    // Specific styles for nested components
    projectsView: {
      height: '100%',
      maxHeight: '100%',
      overflow: 'hidden' as const
    },

    listDetailLayout: {
      height: 'calc(100% - 70px)', // Considering filter tags space
      maxHeight: 'calc(100% - 70px)',
      overflow: 'hidden' as const
    },

    projectDetailImage: {
      maxHeight: '300px',
      objectFit: 'contain' as const
    }
  };
};