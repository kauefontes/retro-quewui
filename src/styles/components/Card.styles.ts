import type { CSSProperties } from 'react';
import { createStyles, getColor, createSpacing, createBorderRadius, createTransition } from '../../styles/utils';
import { shadows } from '../../styles/tokens';

/**
 * Card Styled Component
 * Componente base para cards reutilizáveis
 */

export const cardStyles = createStyles((theme) => {
  const colors = getColor(theme);
  
  return {
    // Base card styles
    base: {
      backgroundColor: theme === 'dark' ? 'rgba(16, 49, 73, 0.5)' : colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: theme === 'dark' ? createBorderRadius('md') : createBorderRadius('none'),
      transition: createTransition('all'),
      position: 'relative',
      color: colors.text,
    } as CSSProperties,

    // Variant styles
    primary: {
      backgroundColor: theme === 'dark' ? 'rgba(16, 49, 73, 0.8)' : '#0000B3',
      borderColor: theme === 'dark' ? colors.accent : '#FFFFFF',
    } as CSSProperties,

    secondary: {
      backgroundColor: theme === 'dark' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)',
      borderColor: theme === 'dark' ? colors.border : '#666666',
    } as CSSProperties,

    transparent: {
      backgroundColor: 'transparent',
      borderColor: theme === 'dark' ? colors.border : '#666666',
    } as CSSProperties,

    // Padding variants
    paddingNone: {
      padding: 0,
    } as CSSProperties,

    paddingSmall: {
      padding: createSpacing('sm'),
    } as CSSProperties,

    paddingMedium: {
      padding: createSpacing('md'),
    } as CSSProperties,

    paddingLarge: {
      padding: createSpacing('lg'),
    } as CSSProperties,

    // Interactive states
    clickable: {
      cursor: 'pointer',
    } as CSSProperties,

    hover: {
      backgroundColor: colors.cardBgHover,
      borderColor: colors.borderSecondary,
      transform: 'translateY(-2px)',
      boxShadow: shadows.md,
    } as CSSProperties,

    selected: {
      backgroundColor: colors.cardBgSelected,
      borderColor: colors.accent,
    } as CSSProperties,

    // Shadow variants
    shadowNone: {
      boxShadow: shadows.none,
    } as CSSProperties,

    shadowSmall: {
      boxShadow: shadows.sm,
    } as CSSProperties,

    shadowMedium: {
      boxShadow: shadows.md,
    } as CSSProperties,

    shadowLarge: {
      boxShadow: shadows.lg,
    } as CSSProperties,
  };
});

// Hook para usar os estilos de forma type-safe
export const useCardStyles = (theme: 'dark' | 'light') => {
  return cardStyles[theme];
};