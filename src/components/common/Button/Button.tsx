import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './Button.css';

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
  ...props
}) => {
  const { theme } = useTheme();
  
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    `theme-${theme}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;