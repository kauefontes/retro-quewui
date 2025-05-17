import React from 'react';
import { AuthContent } from '../AuthContent/AuthContent';
import './DetailActionButtons.css';

interface DetailActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
  className?: string;
}

/**
 * Common action buttons for detailed views with consistent styling
 */
export const DetailActionButtons: React.FC<DetailActionButtonsProps> = ({
  onEdit,
  onDelete,
  onClose,
  className = ''
}) => {
  return (
    <div className={`detail-action-buttons ${className}`}>
      <AuthContent fallback={null}>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="action-button edit-button"
            aria-label="Edit item"
          >
            [Edit]
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete}
            className="action-button delete-button"
            aria-label="Delete item"
          >
            [Delete]
          </button>
        )}
      </AuthContent>
      <button 
        onClick={onClose}
        className="action-button close-button"
        aria-label="Close"
      >
        [X]
      </button>
    </div>
  );
};
