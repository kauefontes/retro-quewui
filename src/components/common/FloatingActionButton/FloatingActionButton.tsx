import React from 'react';
import { AuthContent } from '../AuthContent/AuthContent';
import { useTheme } from '../../../hooks/useTheme';
import './FloatingActionButton.css';

interface FloatingActionButtonProps {
  onClick: () => void;
  ariaLabel: string;
  label?: string;
  requiresAuth?: boolean;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  ariaLabel,
  label = '[New]',
  requiresAuth = true,
  className = ''
}) => {
  const { theme } = useTheme();
  
  const Button = (
    <button
      className={`floating-action-button theme-${theme} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
  
  if (requiresAuth) {
    return (
      <AuthContent fallback={null}>
        {Button}
      </AuthContent>
    );
  }
  
  return Button;
};
