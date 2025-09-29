import React from 'react';
import { useAppStore } from '../../../store/appStore';

interface ProfileLinkProps {
  /** Link label */
  label: string;
  /** Link URL */
  url: string;
  /** Optional icon */
  icon?: string;
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Component for displaying profile contact links
 * Extracted from AboutView inline component
 */
export const ProfileLink: React.FC<ProfileLinkProps> = ({
  label,
  url,
  icon,
  className = '',
  style = {},
}) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  return (
    <div 
      className={`profile-link ${className}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,0,0.1)',
        ...style
      }}
    >
      {icon && (
        <span style={{ fontSize: '1.1rem' }}>
          {icon}
        </span>
      )}
      <span style={{ 
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        fontWeight: 'bold',
        minWidth: '80px'
      }}>
        {label}:
      </span>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          color: isDebianTheme ? '#00FF00' : 'var(--accent-color)',
          textDecoration: 'none',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'}
        onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}
      >
        {url.replace(/^https?:\/\//, '').replace(/^mailto:/, '').replace(/^tel:/, '')}
      </a>
    </div>
  );
};

export default ProfileLink;