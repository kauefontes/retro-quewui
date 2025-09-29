import React, { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { useCardStyles } from '../../../styles/components/Card.styles';

interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional additional class name */
  className?: string;
  /** Card padding size */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Whether to show border */
  border?: boolean;
  /** Card background variant */
  variant?: 'default' | 'primary' | 'secondary' | 'transparent';
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Click handler for interactive cards */
  onClick?: () => void;
  /** Whether card is clickable (affects cursor and hover) */
  clickable?: boolean;
}

/**
 * Generic Card component with theme-aware styling
 * Base component for all card-like interfaces
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  border = true,
  variant = 'default',
  style = {},
  onClick,
  clickable = false,
  ...props
}) => {
  const { theme } = useAppStore();
  const styles = useCardStyles(theme);
  const [isHovered, setIsHovered] = useState(false);

  // Combine styles based on props and state
  const cardStyle = {
    ...styles.base,
    ...(variant !== 'default' ? styles[variant as keyof typeof styles] : {}),
    ...styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
    ...(border ? {} : { border: 'none' }),
    ...(clickable || onClick ? styles.clickable : {}),
    ...(isHovered && (clickable || onClick) ? styles.hover : {}),
    ...style,
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;