import React from 'react';

interface SpacerProps {
  /** Spacing size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Direction of spacing */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Custom spacing value */
  custom?: string;
}

/**
 * Spacer component for consistent spacing between elements
 * Replaces manual margin/padding calculations
 */
export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  custom,
}) => {
  const getSpacing = () => {
    if (custom) return custom;
    
    switch (size) {
      case 'xs':
        return '0.25rem';
      case 'sm':
        return '0.5rem';
      case 'md':
        return '1rem';
      case 'lg':
        return '1.5rem';
      case 'xl':
        return '2rem';
      case 'xxl':
        return '3rem';
      default:
        return '1rem';
    }
  };

  const getStyle = () => {
    const spacing = getSpacing();
    
    switch (direction) {
      case 'vertical':
        return { height: spacing, width: '100%' };
      case 'horizontal':
        return { width: spacing, height: '100%' };
      case 'both':
        return { width: spacing, height: spacing };
      default:
        return { height: spacing, width: '100%' };
    }
  };

  return <div className="spacer" style={getStyle()} />;
};

export default Spacer;