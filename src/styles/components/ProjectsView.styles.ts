import type { Theme } from '../../types';

export const useProjectsViewStyles = (theme: Theme) => {
  return {
    // Main container
    projectsView: {
      overflowX: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      maxHeight: '100%',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden' as const,
    },

    // Filter section
    projectFilter: {
      marginBottom: 'var(--space-md)',
    },

    // Content layout
    projectsContent: {
      display: 'flex',
      flex: 1,
      height: '100%',
      overflow: 'hidden' as const,
    },

    // Projects list
    projectsList: {
      width: '100%',
      maxWidth: '100%',
      paddingRight: 'var(--space-sm)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 'var(--space-md)',
    },

    projectsListWithDetails: {
      width: '35%',
      maxWidth: '35%',
      paddingRight: 'var(--space-sm)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 'var(--space-md)',
    },

    // Details panel
    projectDetailsPanel: {
      width: '65%',
      paddingLeft: 'var(--space-sm)',
    },

    // State components
    loadingState: {
      padding: 'var(--space-xl)',
      textAlign: 'center' as const,
      opacity: 0.7,
    },

    errorState: {
      padding: 'var(--space-md)',
      color: 'var(--error-color)',
      borderLeft: '3px solid var(--error-color)',
    },

    emptyState: {
      padding: 'var(--space-md)',
      textAlign: 'center' as const,
      opacity: 0.7,
    },

    // Live badge
    liveBadge: {
      fontSize: 'var(--text-xs)',
      backgroundColor: 'var(--success-color)',
      color: 'white',
      padding: 'var(--space-xxs) var(--space-xs)',
      borderRadius: 'var(--radius-sm)',
      fontWeight: 'normal' as const,
      marginLeft: 'var(--space-xs)',
    },

    // Mobile responsive styles
    projectsContentMobile: {
      display: 'flex',
      flex: 1,
      height: '100%',
      overflow: 'hidden' as const,
      flexDirection: 'column' as const,
    },

    projectsListMobile: {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '30vh',
      paddingRight: '0',
      paddingBottom: 'var(--space-md)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 'var(--space-md)',
    },

    projectDetailsPanelMobile: {
      width: '100%',
      maxWidth: '100%',
      paddingLeft: '0',
      paddingTop: 'var(--space-md)',
      borderTop: '1px solid var(--border-primary)',
      borderLeft: 'none',
    },
  };
};

export default useProjectsViewStyles;