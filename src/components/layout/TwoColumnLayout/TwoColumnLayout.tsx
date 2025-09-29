import React from 'react';
import { useAppStore } from '../../../store/appStore';

interface TwoColumnLayoutProps {
  /** Left column content */
  leftColumn: React.ReactNode;
  /** Right column content */
  rightColumn: React.ReactNode;
  /** Left column width ratio (1-4) */
  leftRatio?: 1 | 2 | 3 | 4;
  /** Right column width ratio (1-4) */
  rightRatio?: 1 | 2 | 3 | 4;
  /** Gap between columns */
  gap?: 'small' | 'medium' | 'large';
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Breakpoint for mobile stacking */
  stackOnMobile?: boolean;
}

/**
 * Two column layout component with responsive behavior
 * Used in AboutView and other pages that need side-by-side content
 */
export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftColumn,
  rightColumn,
  leftRatio = 2,
  rightRatio = 1,
  gap = 'medium',
  className = '',
  style = {},
  stackOnMobile = true,
}) => {
  const { theme } = useAppStore();

  const getGap = () => {
    switch (gap) {
      case 'small':
        return '1rem';
      case 'medium':
        return '2rem';
      case 'large':
        return '3rem';
      default:
        return '2rem';
    }
  };

  const getGridTemplate = () => {
    return `minmax(0, ${leftRatio}fr) minmax(0, ${rightRatio}fr)`;
  };

  return (
    <div
      className={`two-column-layout theme-${theme} ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: getGridTemplate(),
        gap: getGap(),
        width: '100%',
        ...style,
      }}
    >
      <div className="left-column">
        {leftColumn}
      </div>
      <div className="right-column">
        {rightColumn}
      </div>
    </div>
  );
};

export default TwoColumnLayout;