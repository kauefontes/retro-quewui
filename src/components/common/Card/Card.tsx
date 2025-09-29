import React from 'react';
import { useAppStore } from '../../../store/appStore';

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
  const isDebianTheme = theme === 'light';

  // Padding sizes
  const paddingMap = {
    none: '0',
    small: '0.5rem',
    medium: '0.75rem',
    large: '1rem'
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(16, 49, 73, 0.8)',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        };
      case 'secondary':
        return {
          backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,0,0.1)',
          borderColor: isDebianTheme ? '#666666' : '#103149',
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
          borderColor: isDebianTheme ? '#666666' : '#103149',
        };
      default:
        return {
          backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(16, 49, 73, 0.5)',
          borderColor: isDebianTheme ? '#666666' : '#103149',
        };
    }
  };

  const cardStyles: React.CSSProperties = {
    padding: paddingMap[padding],
    borderRadius: isDebianTheme ? '0' : '0.25rem',
    border: border ? '1px solid' : 'none',
    color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
    cursor: clickable || onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...style,
  };

  // Hover effects for clickable cards
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickable || onClick) {
      e.currentTarget.style.opacity = '0.8';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickable || onClick) {
      e.currentTarget.style.opacity = '1';
    }
  };

  return (
    <div
      className={`card ${className}`}
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;