import type { CSSProperties } from 'react';
import { createStyles } from '../../styles/utils';
import { spacing } from '../../styles/tokens';

/**
 * TwoColumnLayout Styled Component
 * Layout responsivo de duas colunas com ratios customizáveis
 */

export const twoColumnLayoutStyles = createStyles((_theme) => {
  return {
    // Base layout styles
    container: {
      display: 'grid',
      width: '100%',
    } as CSSProperties,

    // Gap variants
    gapSmall: {
      gap: spacing.md,  // 1rem
    } as CSSProperties,

    gapMedium: {
      gap: spacing.xl,  // 2rem
    } as CSSProperties,

    gapLarge: {
      gap: spacing.xxl, // 3rem
    } as CSSProperties,

    // Column containers
    leftColumn: {
      minWidth: 0, // Prevents overflow
    } as CSSProperties,

    rightColumn: {
      minWidth: 0, // Prevents overflow
    } as CSSProperties,

    // Mobile stacking behavior will be handled via CSS classes or window resize listener
  };
});

// Helper function to generate grid template columns
export const generateGridTemplate = (leftRatio: number, rightRatio: number): string => {
  return `minmax(0, ${leftRatio}fr) minmax(0, ${rightRatio}fr)`;
};

// Hook para usar os estilos de forma type-safe
export const useTwoColumnLayoutStyles = (theme: 'dark' | 'light') => {
  return twoColumnLayoutStyles[theme];
};