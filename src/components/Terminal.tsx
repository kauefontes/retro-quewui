import React from 'react';
import { useAppStore } from '../store/appStore';

// Terminal content display component
interface TerminalContentProps {
  children: React.ReactNode;
}

export const TerminalContent: React.FC<TerminalContentProps> = ({ children }) => {
  const { theme } = useAppStore();
  
  return (
    <div className={`terminal-content theme-${theme}`}>
      {children}
    </div>
  );
};
