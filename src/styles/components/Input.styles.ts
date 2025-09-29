import type { CSSProperties } from 'react';
import { createStyles, getColor, createSpacing, createBorderRadius, createTransition } from '../../styles/utils';
import { typography } from '../../styles/tokens';

/**
 * Input Styled Component
 * Sistema completo de inputs para formulários
 */

export const inputStyles = createStyles((theme) => {
  const colors = getColor(theme);
  
  return {
    // Base input styles
    base: {
      fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace",
      fontSize: typography.fontSizes.md,
      padding: createSpacing('sm'),
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: theme === 'dark' ? createBorderRadius('sm') : createBorderRadius('none'),
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      color: colors.text,
      transition: createTransition('all'),
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    } as CSSProperties,

    // Size variants
    small: {
      padding: createSpacing('xs', 'sm'),
      fontSize: typography.fontSizes.sm,
    } as CSSProperties,

    medium: {
      padding: createSpacing('sm'),
      fontSize: typography.fontSizes.md,
    } as CSSProperties,

    large: {
      padding: createSpacing('md'),
      fontSize: typography.fontSizes.lg,
    } as CSSProperties,

    // States
    focus: {
      borderColor: colors.accent,
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.15)',
    } as CSSProperties,

    error: {
      borderColor: colors.error,
      backgroundColor: theme === 'dark' ? 'rgba(255, 102, 102, 0.1)' : 'rgba(255, 102, 102, 0.05)',
    } as CSSProperties,

    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    } as CSSProperties,

    // Textarea specific
    textarea: {
      resize: 'vertical',
      minHeight: '120px',
      fontFamily: "'Share Tech Mono', 'JetBrains Mono', monospace",
    } as CSSProperties,

    // Label styles
    label: {
      display: 'block',
      marginBottom: createSpacing('xs'),
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: colors.text,
    } as CSSProperties,

    // Error message styles
    errorMessage: {
      fontSize: typography.fontSizes.xs,
      color: colors.error,
      marginTop: createSpacing('xxs'),
    } as CSSProperties,

    // Field wrapper styles
    fieldWrapper: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: createSpacing('md'),
    } as CSSProperties,

    // Input group styles (for buttons with inputs)
    inputGroup: {
      display: 'flex',
      alignItems: 'stretch',
    } as CSSProperties,

    inputGroupInput: {
      flex: 1,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: 0,
    } as CSSProperties,

    inputGroupButton: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0,
    } as CSSProperties,
  };
});

// Hook para usar os estilos de forma type-safe
export const useInputStyles = (theme: 'dark' | 'light') => {
  return inputStyles[theme];
};