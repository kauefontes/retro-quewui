import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isLoading?: boolean;
  isError?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '📂',
  action,
  isLoading = false,
  isError = false
}) => {
  const emoji = isLoading ? '⏳' : isError ? '❌' : icon;

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{emoji}</div>
      <h3 className="empty-state-title">
        {isLoading ? 'Loading...' : isError ? 'Error' : title}
      </h3>
      <p className="empty-state-message">
        {isLoading ? 'Please wait while content is loading...' : 
          isError ? 'An error occurred while loading content.' : message}
      </p>
      
      {action && !isLoading && !isError && (
        <button className="empty-state-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      
      {isLoading && <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>}
    </div>
  );
};

export default EmptyState;
