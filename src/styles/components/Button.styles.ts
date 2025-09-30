import type { CSSProperties } from 'react';
import { createStyles, getColor, createSpacing, createBorderRadius, createTransition } from '../../styles/utils';
import { typography } from '../../styles/tokens';

/**
 * Button Styled Component
 * Sistema completo de botões com variantes
 */

export const buttonStyles = createStyles((theme) => {
  const colors = getColor(theme);
  
  return {
    // Base button styles
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace",
      fontWeight: typography.fontWeights.medium,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      cursor: 'pointer',
      transition: createTransition('all'),
      textDecoration: 'none',
      outline: 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
    } as CSSProperties,

    // Size variants
    small: {
      padding: createSpacing('xs', 'sm'),
      fontSize: typography.fontSizes.sm,
      minHeight: '32px',
    } as CSSProperties,

    medium: {
      padding: createSpacing('sm', 'md'),
      fontSize: typography.fontSizes.md,
      minHeight: '40px',
    } as CSSProperties,

    large: {
      padding: createSpacing('md', 'lg'),
      fontSize: typography.fontSizes.lg,
      minHeight: '48px',
    } as CSSProperties,

    // Style variants
    primary: {
      backgroundColor: colors.accent,
      color: theme === 'dark' ? colors.background : colors.background,
      borderRadius: theme === 'dark' ? createBorderRadius('md') : createBorderRadius('none'),
      borderColor: colors.accent,
    } as CSSProperties,

    secondary: {
      backgroundColor: 'transparent',
      color: colors.text,
      borderColor: colors.border,
      borderRadius: theme === 'dark' ? createBorderRadius('md') : createBorderRadius('none'),
    } as CSSProperties,

    terminal: {
      backgroundColor: 'transparent',
      color: colors.accent,
      borderColor: colors.accent,
      borderRadius: theme === 'dark' ? createBorderRadius('md') : createBorderRadius('none'),
    } as CSSProperties,

    ghost: {
      backgroundColor: 'transparent',
      color: colors.text,
      border: 'none',
      borderRadius: theme === 'dark' ? createBorderRadius('md') : createBorderRadius('none'),
    } as CSSProperties,

    // Hover states
    primaryHover: {
      filter: 'brightness(1.1)',
      transform: 'translateY(-1px)',
    } as CSSProperties,

    secondaryHover: {
      borderColor: colors.accent,
      color: colors.accent,
    } as CSSProperties,

    terminalHover: {
      backgroundColor: colors.accentHover,
    } as CSSProperties,

    ghostHover: {
      backgroundColor: colors.cardBgHover,
    } as CSSProperties,

    // States
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    } as CSSProperties,

    loading: {
      cursor: 'wait',
    } as CSSProperties,

    // Icon spacing
    iconLeft: {
      marginRight: createSpacing('xs'),
    } as CSSProperties,

    iconRight: {
      marginLeft: createSpacing('xs'),
    } as CSSProperties,

    iconOnly: {
      padding: createSpacing('sm'),
      minWidth: '40px',
    } as CSSProperties,
  };
});

// Hook para usar os estilos de forma type-safe
export const useButtonStyles = (theme: 'dark' | 'light') => {
  return buttonStyles[theme];
};