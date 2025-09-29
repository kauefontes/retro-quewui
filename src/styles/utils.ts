import { colors, spacing, borderRadius, transitions } from './tokens';

/**
 * Theme-aware style functions
 * Permite criar estilos que respondem ao tema atual
 */

export type Theme = 'dark' | 'light';

// Theme-aware color getter
export const getColor = (theme: Theme) => ({
  ...colors[theme],
  ...colors.status,
});

// Style factory para componentes
export const createStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
) => {
  return {
    dark: styleFactory('dark'),
    light: styleFactory('light'),
  };
};

// Utility functions
export const createSpacing = (...values: Array<keyof typeof spacing>) => 
  values.map(key => spacing[key]).join(' ');

export const createBorderRadius = (value: keyof typeof borderRadius) => 
  borderRadius[value];

export const createTransition = (property: string, duration: keyof typeof transitions = 'normal') =>
  `${property} ${transitions[duration]}`;

// Responsive utilities
export const responsive = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (min-width: 769px) and (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
};

// Common style patterns
export const commonStyles = {
  // Flexbox utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  // Text utilities
  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // Reset utilities
  resetButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    outline: 'none',
    cursor: 'pointer',
  },
  
  resetList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
};