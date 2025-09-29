import React from 'react';
import { useAppStore } from '../../../store/appStore';

interface PageContainerProps {
  /** Page content */
  children: React.ReactNode;
  /** Container max width */
  maxWidth?: 'small' | 'medium' | 'large' | 'full';
  /** Container padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Whether to center content */
  centered?: boolean;
}

/**
 * Main page container component that provides consistent spacing and layout
 * Replaces manual container divs across views
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'large',
  padding = 'medium',
  className = '',
  style = {},
  centered = true,
}) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'small':
        return '600px';
      case 'medium':
        return '900px';
      case 'large':
        return '1200px';
      case 'full':
        return '100%';
      default:
        return '1200px';
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return '0';
      case 'small':
        return '0.75rem';
      case 'medium':
        return '1.5rem';
      case 'large':
        return '2rem';
      default:
        return '1.5rem';
    }
  };

  return (
    <div
      className={`page-container theme-${theme} ${className}`}
      style={{
        maxWidth: getMaxWidth(),
        margin: centered ? '0 auto' : '0',
        padding: getPadding(),
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;