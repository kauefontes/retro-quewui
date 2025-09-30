import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../contexts/AuthUtils';
import { useTheme } from '../hooks/useTheme';
import { useCommandBarStyles } from '../styles/components/CommandBar.styles';

export const CommandBar: React.FC = () => {
  const { isCommandMode } = useAppStore();
  const { isAuthenticated } = useAuth();
  const { theme: currentTheme } = useTheme();
  const styles = useCommandBarStyles(currentTheme);
  const [visible, setVisible] = useState(true);
  
  // Controls the visibility of the command bar
  useEffect(() => {
    // Check login state every 500ms
    const interval = setInterval(() => {
      // Hide the bar when login is in progress
      const { currentLoginState } = useAppStore.getState();
      if (currentLoginState.state === 'username' || currentLoginState.state === 'password') {
        setVisible(false);
      } else {
        setVisible(true);
      }
    }, 500);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key toggles visibility only when not in login process
      const { currentLoginState } = useAppStore.getState();
      if (e.key === 'Escape' && currentLoginState.state === 'none') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);
  
  // Define only the essential commands
  const commands = [
    { key: ':', description: 'Command', onClick: null },
    { key: 'h', description: 'Help', onClick: null }
  ];

  const handleCommandClick = (cmd: { key: string, onClick: (() => void) | null }) => {
    if (cmd.onClick) {
      cmd.onClick();
    } else if (cmd.key === ':' || cmd.key === 'h') {
      // Toggle command modal for : and h
      const event = new KeyboardEvent('keydown', { key: ':' });
      document.dispatchEvent(event);
    }
  };

  return (
    <div 
      style={{
        ...styles.commandBar,
        display: visible && isCommandMode ? 'block' : 'none'
      }}
    >
      <div style={styles.content}>
        <div style={styles.modeIndicator}>
          COMMAND MODE: ON
          {isAuthenticated && <span style={styles.adminIndicator}> • ADMIN</span>}
        </div>
        <div style={styles.itemsContainer}>
          {commands.map((cmd, index) => (
            <div 
              key={index} 
              style={styles.item}
              onClick={() => handleCommandClick(cmd)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCommandClick(cmd)}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.itemHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.item)}
              onFocus={(e) => Object.assign(e.currentTarget.style, styles.itemFocus)}
              onBlur={(e) => Object.assign(e.currentTarget.style, styles.item)}
            >
              <span style={styles.key}>{cmd.key}</span>
              <span style={styles.description}>{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
