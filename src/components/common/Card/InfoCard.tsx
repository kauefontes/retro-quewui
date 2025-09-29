import React from 'react';
import { Card } from '../Card/Card';

interface InfoCardProps {
  /** Card title/label */
  title?: string;
  /** Card content */
  children: React.ReactNode;
  /** Optional icon */
  icon?: string;
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
  /** Click handler for interactive cards */
  onClick?: () => void;
}

/**
 * Card component for displaying information with optional title and icon
 * Used for profile information, contact details, etc.
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  icon,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  return (
    <Card
      variant="secondary"
      padding="medium"
      className={`info-card ${className}`}
      onClick={onClick}
      clickable={!!onClick}
      style={style}
      {...props}
    >
      {(title || icon) && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: children ? '0.5rem' : '0'
        }}>
          {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
          {title && (
            <h4 style={{ 
              margin: 0,
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}>
              {title}
            </h4>
          )}
        </div>
      )}
      
      <div className="info-card-content">
        {children}
      </div>
    </Card>
  );
};

export default InfoCard;