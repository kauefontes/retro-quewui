import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { Button } from '../../common/Button';
import { useTerminalHeaderStyles } from '../../../styles/components/TerminalHeader.styles';

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
  const headerStyles = useTerminalHeaderStyles(theme);
  
  return (
    <div style={{...headerStyles.terminalHeader}} className={className}>
      <div style={headerStyles.terminalHeaderLeft}>
        <span style={headerStyles.terminalTitle}>
          TERMINAL
        </span>
        <span style={isCommandMode ? headerStyles.cmdModeIndicatorActive : headerStyles.cmdModeIndicator}>
          [CMD MODE: {isCommandMode ? 'ON' : 'OFF'}]
        </span>
      </div>
      <div style={headerStyles.terminalHeaderButtons}>
        <Button 
          variant="terminal"
          size="small"
          onClick={toggleCommandMode}
          style={headerStyles.cmdModeButton}
        >
          {isCommandMode ? 'Exit CMD' : 'CMD Mode'}
        </Button>
        <Button 
          variant="terminal"
          size="small"
          onClick={toggleTheme}
          style={headerStyles.themeToggleButton}
        >
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </Button>
      </div>
    </div>
  );
};

export default TerminalHeader;