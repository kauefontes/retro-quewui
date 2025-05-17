import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './Section.css';

interface SectionProps {
  /** Section title */
  title: string;
  /** Section content */
  children: React.ReactNode;
  /** Optional additional class name */
  className?: string;
  /** Optional action button/element to display in the header */
  action?: React.ReactNode;
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state if collapsible */
  defaultCollapsed?: boolean;
  /** Optional description text */
  description?: string;
}

/**
 * Standardized section component for content areas
 * Provides consistent styling with optional title, actions, and collapsible behavior
 */
export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  action,
  collapsible = false,
  defaultCollapsed = false,
  description,
}) => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed && collapsible);

  const toggleCollapse = () => {
    if (collapsible) {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className={`section theme-${theme} ${className}`}>
      <div className="section-header">
        <div className="section-title-area">
          <h2 
            className={`section-title ${collapsible ? 'collapsible' : ''}`}
            onClick={toggleCollapse}
          >
            {collapsible && (
              <span className={`collapse-indicator ${collapsed ? 'collapsed' : ''}`}>
                {collapsed ? '+' : '-'}
              </span>
            )}
            {title}
          </h2>
          {description && (
            <p className="section-description">{description}</p>
          )}
        </div>
        {action && (
          <div className="section-action">
            {action}
          </div>
        )}
      </div>
      
      {!collapsed && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Section;