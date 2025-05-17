import React from 'react';
import { AuthContent } from './AuthContent/AuthContent';

interface AdminControlsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  entityName: string;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  onAdd,
  onEdit,
  onDelete,
  isEditing = false,
  onSave,
  onCancel,
  entityName,
}) => {
  return (
    <AuthContent fallback={null}>
      <div 
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        }}
      >
        {!isEditing ? (
          <>
            {onAdd && (
              <button
                onClick={onAdd}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Add {entityName}
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={onEdit}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Edit {entityName}
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={onDelete}
                style={{
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Delete {entityName}
              </button>
            )}
          </>
        ) : (
          <>
            {onSave && (
              <button
                onClick={onSave}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Save
              </button>
            )}
            
            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </AuthContent>
  );
};
