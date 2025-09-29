import React from 'react';

interface LiveBadgeProps {
  /** Text to display in badge */
  text?: string;
  /** Badge color variant */
  variant?: 'success' | 'warning' | 'info' | 'error';
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Small badge component to indicate live/active status
 * Used for showing real-time data indicators
 */
export const LiveBadge: React.FC<LiveBadgeProps> = ({
  text = 'live',
  variant = 'success',
  style = {},
}) => {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#00AA00';
      case 'warning':
        return '#FFA500';
      case 'info':
        return '#0088FF';
      case 'error':
        return '#FF4444';
      default:
        return '#00AA00';
    }
  };

  return (
    <span
      style={{
        fontSize: '0.75rem',
        backgroundColor: getVariantColor(),
        color: 'white',
        padding: '0.15rem 0.4rem',
        borderRadius: '0.25rem',
        fontWeight: 'normal',
        textTransform: 'lowercase',
        ...style,
      }}
    >
      {text}
    </span>
  );
};

export default LiveBadge;