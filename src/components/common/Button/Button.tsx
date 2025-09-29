import React, { useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useButtonStyles } from '../../../styles/components/Button.styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant/style */
  variant?: 'primary' | 'secondary' | 'terminal';
  /** Optional class name for additional styling */
  className?: string;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
  /** Children elements */
  children: React.ReactNode;
}

/**
 * Reusable Button component with theme-aware styling
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'terminal',
  size = 'medium',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = useButtonStyles(theme);
  const [isHovered, setIsHovered] = useState(false);

  // Combine styles based on variant, size, and state
  const buttonStyle = {
    ...styles.base,
    ...styles[size],
    ...styles[variant],
    ...(isHovered && !disabled ? styles[`${variant}Hover` as keyof typeof styles] : {}),
    ...(disabled ? styles.disabled : {}),
  };

  return (
    <button 
      style={buttonStyle}
      className={className}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;