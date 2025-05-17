import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './TechTag.css';

interface TechTagProps {
  /** The text to display in the tag */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional delete handler */
  onDelete?: () => void;
  /** Whether the tag is in selected state */
  isSelected?: boolean;
  /** Additional class name */
  className?: string;
  /** Size variant */
  size?: 'small' | 'medium';
}

/**
 * TechTag component for displaying technologies, languages, or skills
 * Used in projects, experiences, and other places where technologies are shown
 */
export const TechTag: React.FC<TechTagProps> = ({
  label,
  onClick,
  onDelete,
  isSelected = false,
  className = '',
  size = 'small'
}) => {
  const { theme } = useTheme();
  
  const tagClasses = [
    'tech-tag',
    `tech-tag-${size}`,
    isSelected ? 'selected' : '',
    `theme-${theme}`,
    onClick ? 'clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <span 
      className={tagClasses}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {label}
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="tech-tag-delete-btn"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TechTag;