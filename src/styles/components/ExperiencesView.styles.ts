import type { Theme } from '../../types';

export const useExperiencesViewStyles = (theme: Theme) => {
  return {
    // Main container
    experiencesView: {
      overflowX: 'hidden' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      width: '100%',
      maxWidth: '100%',
    },

    // Filter section
    experienceFilter: {
      marginBottom: 'var(--space-md)',
    },
  };
};

export default useExperiencesViewStyles;