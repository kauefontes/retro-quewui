import React, { useEffect } from 'react';
import { useAppStore } from '../../../store/appStore';
import { NavTabs } from '../../NavTabs';
import { StatusBar } from '../../StatusBar';
import { TerminalHeader } from '../TerminalHeader';
import CommandBar from '../../CommandBar';
import './TerminalLayout.css';

interface TerminalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout component that wraps the entire application
 * Provides the terminal window styling and structure
 */
export const TerminalLayout: React.FC<TerminalLayoutProps> = ({ 
  children,
  className = ''
}) => {
  const { theme } = useAppStore();
  
  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className={`terminal-container theme-${theme} ${className}`}>
      <div className="terminal-window">
        <TerminalHeader />
        <NavTabs />
        <div className="terminal-content-wrapper">
          {children}
        </div>
        <CommandBar />
        <StatusBar />
      </div>
    </div>
  );
};

export default TerminalLayout;