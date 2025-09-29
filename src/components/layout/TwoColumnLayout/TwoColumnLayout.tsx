import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { useTwoColumnLayoutStyles, generateGridTemplate } from '../../../styles/components/TwoColumnLayout.styles';

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
  const styles = useTwoColumnLayoutStyles(theme);

  // Combine styles based on props
  const containerStyle = {
    ...styles.container,
    ...styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}` as keyof typeof styles],
    gridTemplateColumns: generateGridTemplate(leftRatio, rightRatio),
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={styles.leftColumn}>
        {leftColumn}
      </div>
      <div style={styles.rightColumn}>
        {rightColumn}
      </div>
    </div>
  );
};

export default TwoColumnLayout;