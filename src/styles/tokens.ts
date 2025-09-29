/**
 * Design Tokens - Sistema de Design Tipado
 * Centraliza todos os valores de design para garantir consistência
 */

// Spacing System
export const spacing = {
  none: '0',
  xxs: '0.25rem',    // 4px
  xs: '0.5rem',      // 8px
  sm: '0.75rem',     // 12px
  md: '1rem',        // 16px
  lg: '1.5rem',      // 24px
  xl: '2rem',        // 32px
  xxl: '3rem',       // 48px
} as const;

// Typography System
export const typography = {
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    md: '1rem',        // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.75rem',  // 28px
    '4xl': '2rem',     // 32px
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

// Color Palette
export const colors = {
  // Dark Theme Colors
  dark: {
    primary: '#00ffd9',
    background: '#0c0e14',
    backgroundSecondary: '#161b22',
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    border: '#103149',
    borderSecondary: '#30363d',
    accent: '#00ffd9',
    accentHover: 'rgba(0, 255, 217, 0.2)',
    cardBg: 'transparent',
    cardBgSelected: 'rgba(0, 255, 217, 0.1)',
    cardBgHover: 'rgba(0, 255, 217, 0.05)',
    input: 'rgba(0, 0, 0, 0.3)',
  },
  // Light Theme Colors (Debian-style)
  light: {
    primary: '#FFFFFF',
    background: '#0000AA',
    backgroundSecondary: '#0000B3',
    backgroundSelected: '#0000D3',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    border: '#666666',
    borderSecondary: '#FFFFFF',
    accent: '#FFFFFF',
    accentHover: 'rgba(255, 255, 255, 0.2)',
    cardBg: '#0000B3',
    cardBgSelected: '#0000D3',
    cardBgHover: 'rgba(255, 255, 255, 0.1)',
    input: 'rgba(0, 0, 0, 0.2)',
  },
  // Status Colors (theme-independent)
  status: {
    success: '#00AA00',
    error: '#FF6666',
    warning: '#FFCC00',
    info: '#0066FF',
  },
} as const;

// Border Radius System
export const borderRadius = {
  none: '0',
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  full: '9999px',    // circular
} as const;

// Shadow System
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const;

// Transition System
export const transitions = {
  fast: '0.2s ease',
  normal: '0.3s ease',
  slow: '0.5s ease',
  bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Z-Index System
export const zIndex = {
  background: -1,
  default: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 100,
  modal: 1000,
  tooltip: 2000,
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Type exports for IntelliSense
export type SpacingKey = keyof typeof spacing;
export type ColorTheme = keyof typeof colors;
export type FontSizeKey = keyof typeof typography.fontSizes;
export type FontWeightKey = keyof typeof typography.fontWeights;