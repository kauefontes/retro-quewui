import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { LiveBadge } from '../LiveBadge';
import { usePageSectionStyles } from '../../../styles/components/PageSection.styles';

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
  const styles = usePageSectionStyles(theme);

  // Combine styles based on size
  const titleStyle = {
    ...styles.titleBase,
    ...styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
  };

  const headerStyle = {
    ...styles.header,
    ...styles[`headerMargin${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
  };

  return (
    <section 
      className={className} 
      style={{
        ...styles.section,
        ...style,
      }}
    >
      <div style={headerStyle}>
        <div style={styles.titleArea}>
          <h2 style={titleStyle}>
            {title}
            {showLiveBadge && liveCondition && <LiveBadge />}
          </h2>
          {subtitle && (
            <p style={styles.subtitle}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div style={styles.action}>
            {action}
          </div>
        )}
      </div>
      
      <div style={styles.content}>
        {children}
      </div>
    </section>
  );
};

export default PageSection;