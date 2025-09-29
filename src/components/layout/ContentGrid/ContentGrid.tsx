import React from 'react';

interface ContentGridProps {
  /** Grid content */
  children: React.ReactNode;
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Gap between grid items */
  gap?: 'small' | 'medium' | 'large';
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Auto-fit behavior for responsive grids */
  autoFit?: boolean;
  /** Minimum column width for auto-fit */
  minColumnWidth?: string;
}

/**
 * Flexible grid component for laying out cards and content
 * Used for stats cards, project grids, etc.
 */
export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  columns = 3,
  gap = 'medium',
  className = '',
  style = {},
  autoFit = false,
  minColumnWidth = '250px',
}) => {
  const getGap = () => {
    switch (gap) {
      case 'small':
        return '0.5rem';
      case 'medium':
        return '1rem';
      case 'large':
        return '1.5rem';
      default:
        return '1rem';
    }
  };

  const getGridColumns = () => {
    if (autoFit) {
      return `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`;
    }
    return `repeat(${columns}, 1fr)`;
  };

  return (
    <div
      className={`content-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        gap: getGap(),
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ContentGrid;