import React, { useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useTechTagStyles } from '../../../styles/components/TechTag.styles';

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
  const styles = useTechTagStyles(theme);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

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

  // Combine styles based on state
  const tagStyle = {
    ...styles.base,
    ...styles[size],
    ...(isSelected ? styles.selected : styles.default),
    ...(onClick ? styles.clickable : {}),
    ...(isHovered && onClick ? styles.hover : {}),
  };

  const deleteButtonStyle = {
    ...styles.deleteButton,
    ...(isDeleteHovered ? styles.deleteButtonHover : {}),
  };

  return (
    <span 
      style={tagStyle}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {label}
      {onDelete && (
        <button
          type="button"
          style={deleteButtonStyle}
          onClick={handleDelete}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default TechTag;