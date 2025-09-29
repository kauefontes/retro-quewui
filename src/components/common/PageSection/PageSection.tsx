import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { LiveBadge } from '../LiveBadge';

interface PageSectionProps {
  /** Section title */
  title: string;
  /** Section content */
  children: React.ReactNode;
  /** Whether to show live badge */
  showLiveBadge?: boolean;
  /** Condition for showing live badge */
  liveCondition?: boolean;
  /** Optional additional class name */
  className?: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Section header size */
  size?: 'small' | 'medium' | 'large';
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Optional action element (buttons, etc) */
  action?: React.ReactNode;
}

/**
 * Standardized page section with consistent header styling
 * Replaces manual section headers across views
 */
export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  showLiveBadge = false,
  liveCondition = true,
  className = '',
  subtitle,
  size = 'medium',
  style = {},
  action,
}) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: '1.125rem',
          marginBottom: '1rem',
          paddingBottom: '0.25rem',
          borderBottomWidth: '1px',
        };
      case 'large':
        return {
          fontSize: '1.75rem',
          marginBottom: '2rem',
          paddingBottom: '0.75rem',
          borderBottomWidth: '3px',
        };
      default: // medium
        return {
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          borderBottomWidth: '2px',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <section className={`page-section ${className}`} style={style}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        marginBottom: sizeStyles.marginBottom 
      }}>
        <div>
          <h2 style={{ 
            ...sizeStyles,
            fontWeight: 'bold', 
            borderBottom: 'solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            margin: 0,
          }}>
            {title}
            {showLiveBadge && liveCondition && <LiveBadge />}
          </h2>
          {subtitle && (
            <p style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.9rem',
              opacity: 0.7,
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div style={{ marginLeft: '1rem' }}>
            {action}
          </div>
        )}
      </div>
      
      <div className="page-section-content">
        {children}
      </div>
    </section>
  );
};

export default PageSection;