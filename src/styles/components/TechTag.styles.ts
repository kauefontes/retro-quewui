import type { CSSProperties } from 'react';
import { createStyles, getColor, createSpacing, createBorderRadius, createTransition } from '../../styles/utils';
import { typography } from '../../styles/tokens';

/**
 * TechTag Styled Component
 * Exemplo de como migrar de CSS para TypeScript styles
 */

export const techTagStyles = createStyles((theme) => {
  const colors = getColor(theme);
  
  return {
    // Base tech tag styles
    base: {
      display: 'inline-block',
      fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace",
      transition: createTransition('all', 'fast'),
      color: colors.accent,
      borderRadius: theme === 'dark' ? createBorderRadius('sm') : createBorderRadius('none'),
      cursor: 'default',
    } as CSSProperties,

    // Size variants
    small: {
      padding: createSpacing('xxs', 'xs'),
      fontSize: typography.fontSizes.xs,
    } as CSSProperties,

    medium: {
      padding: createSpacing('xs', 'sm'), 
      fontSize: typography.fontSizes.sm,
    } as CSSProperties,

    // Background variants
    default: {
      backgroundColor: theme === 'dark' 
        ? 'rgba(0, 0, 0, 0.5)' 
        : 'rgba(255, 255, 255, 0.2)',
    } as CSSProperties,

    selected: {
      backgroundColor: theme === 'dark' 
        ? colors.accentHover 
        : colors.cardBgSelected,
    } as CSSProperties,

    // Interactive states
    clickable: {
      cursor: 'pointer',
    } as CSSProperties,

    hover: {
      backgroundColor: theme === 'dark' 
        ? colors.accentHover 
        : colors.cardBgSelected,
    } as CSSProperties,

    // Delete button
    deleteButton: {
      marginLeft: createSpacing('xxs'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'inherit',
      fontSize: typography.fontSizes.md,
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      lineHeight: 1,
      transition: createTransition('opacity'),
    } as CSSProperties,

    deleteButtonHover: {
      opacity: 0.8,
    } as CSSProperties,
  };
});

// Hook para usar os estilos de forma type-safe
export const useTechTagStyles = (theme: 'dark' | 'light') => {
  return techTagStyles[theme];
};