import React from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './ListDetailLayout.css';

interface ListDetailLayoutProps {
  /** Title of the view */
  title: string;
  /** Optional action element to display next to the title */
  titleAction?: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** List of items */
  listContent: ReactNode;
  /** Detail content to show when an item is selected */
  detailContent?: ReactNode;
  /** Whether an item is selected */
  hasSelectedItem: boolean;
  /** Action button (typically a FloatingActionButton) */
  actionButton?: ReactNode;
  /** Loading message */
  loadingMessage?: string;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * A reusable layout component for views with a list and detail panel
 */
export const ListDetailLayout: React.FC<ListDetailLayoutProps> = ({
  title,
  titleAction,
  loading = false,
  error = null,
  listContent,
  detailContent,
  hasSelectedItem,
  actionButton,
  loadingMessage = 'Loading...',
  emptyMessage = 'No items found'
}) => {
  const { theme } = useTheme();

  return (
    <div className={`list-detail-layout theme-${theme}`}>
      <div className="list-detail-header">
        <h2 className="list-detail-title">
          {title}
          {titleAction}
        </h2>
      </div>
      
      {loading ? (
        <div className="list-detail-loading">
          {loadingMessage}
        </div>
      ) : error ? (
        <div className="list-detail-error">
          {error}
        </div>
      ) : (
        <div className="list-detail-content">
          <div className={`list-detail-list ${hasSelectedItem ? 'with-details' : ''}`}>
            {React.Children.count(listContent) === 0 ? (
              <div className="list-detail-empty">
                {emptyMessage}
              </div>
            ) : (
              listContent
            )}
          </div>
          
          {hasSelectedItem && detailContent && (
            <div className="list-detail-detail">
              {detailContent}
            </div>
          )}
        </div>
      )}
      
      {actionButton && (
        <div className="list-detail-action">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default ListDetailLayout;
