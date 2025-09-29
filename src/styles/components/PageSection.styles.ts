import type { CSSProperties } from 'react';
import { createStyles, getColor, createSpacing, createTransition } from '../../styles/utils';
import { typography } from '../../styles/tokens';

/**
 * PageSection Styled Component
 * Seções padronizadas com título, badge e actions
 */

export const pageSectionStyles = createStyles((theme) => {
  const colors = getColor(theme);
  
  return {
    // Base section styles
    section: {
      width: '100%',
      color: colors.text,
    } as CSSProperties,

    // Header container
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    } as CSSProperties,

    // Title area (title + subtitle)
    titleArea: {
      flex: 1,
    } as CSSProperties,

    // Base title styles
    titleBase: {
      fontWeight: typography.fontWeights.bold,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.accent,
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      gap: createSpacing('sm'),
      margin: 0,
      transition: createTransition('all'),
    } as CSSProperties,

    // Title size variants
    titleSmall: {
      fontSize: typography.fontSizes.lg,
      paddingBottom: createSpacing('xxs'),
      borderBottomWidth: '1px',
    } as CSSProperties,

    titleMedium: {
      fontSize: typography.fontSizes['2xl'],
      paddingBottom: createSpacing('xs'),
      borderBottomWidth: '2px',
    } as CSSProperties,

    titleLarge: {
      fontSize: typography.fontSizes['3xl'],
      paddingBottom: createSpacing('sm'),
      borderBottomWidth: '3px',
    } as CSSProperties,

    // Header margin variants (spacing after title)
    headerMarginSmall: {
      marginBottom: createSpacing('md'),
    } as CSSProperties,

    headerMarginMedium: {
      marginBottom: createSpacing('lg'),
    } as CSSProperties,

    headerMarginLarge: {
      marginBottom: createSpacing('xl'),
    } as CSSProperties,

    // Subtitle styles
    subtitle: {
      margin: `${createSpacing('xs')} 0 0 0`,
      fontSize: typography.fontSizes.sm,
      opacity: 0.7,
      color: colors.text,
    } as CSSProperties,

    // Action area
    action: {
      marginLeft: createSpacing('md'),
      flexShrink: 0,
    } as CSSProperties,

    // Content area
    content: {
      // Content styles can be added here if needed
    } as CSSProperties,
  };
});

// Hook para usar os estilos de forma type-safe
export const usePageSectionStyles = (theme: 'dark' | 'light') => {
  return pageSectionStyles[theme];
};