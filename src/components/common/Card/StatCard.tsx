import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  /** The main statistic value to display */
  value: string | number;
  /** Label/description for the statistic */
  label: string;
  /** Optional icon to display */
  icon?: string;
  /** Optional additional class name */
  className?: string;
  /** Click handler for interactive stats */
  onClick?: () => void;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Specialized card component for displaying statistics
 * Used for metrics, counts, and numerical data
 */
export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  className = '',
  onClick,
  style = {},
  ...props
}) => {
  return (
    <Card
      variant="default"
      padding="medium"
      className={`stat-card ${className}`}
      onClick={onClick}
      clickable={!!onClick}
      style={{
        textAlign: 'center',
        flex: 1,
        ...style,
      }}
      {...props}
    >
      {icon && (
        <div style={{ 
          fontSize: '1.5rem', 
          marginBottom: '0.5rem' 
        }}>
          {icon}
        </div>
      )}
      
      <div style={{ 
        fontSize: '1.75rem', 
        fontWeight: 'bold',
        color: 'var(--accent-color)',
        marginBottom: '0.25rem'
      }}>
        {value}
      </div>
      
      <div style={{ 
        fontSize: '0.875rem', 
        opacity: 0.7
      }}>
        {label}
      </div>
    </Card>
  );
};

export default StatCard;