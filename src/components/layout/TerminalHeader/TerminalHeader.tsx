import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { Button } from '../../common/Button';
import './TerminalHeader.css';

interface TerminalHeaderProps {
  className?: string;
}

/**
 * Header component for the terminal window
 * Controls theme and command mode toggles
 */
export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
  className = '' 
}) => {
  const { theme, toggleTheme, isCommandMode, toggleCommandMode } = useAppStore();
  
  return (
    <div className={`terminal-header theme-${theme} ${className}`}>
      <div className="terminal-header-left">
        <span className="terminal-title">
          TERMINAL
        </span>
        <span className={`cmd-mode-indicator ${isCommandMode ? 'active' : ''}`}>
          [CMD MODE: {isCommandMode ? 'ON' : 'OFF'}]
        </span>
      </div>
      <div className="terminal-header-buttons">
        <Button 
          variant="terminal"
          size="small"
          onClick={toggleCommandMode}
          className="cmd-mode-button"
        >
          {isCommandMode ? 'Exit CMD' : 'CMD Mode'}
        </Button>
        <Button 
          variant="terminal"
          size="small"
          onClick={toggleTheme}
          className="theme-toggle-button"
        >
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </Button>
      </div>
    </div>
  );
};

export default TerminalHeader;