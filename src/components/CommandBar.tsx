import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../contexts/AuthUtils';
import './CommandBar.css';

export const CommandBar: React.FC = () => {
  const { theme, isCommandMode } = useAppStore();
  const { isAuthenticated } = useAuth();
  const isDebianTheme = theme === 'light';
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

  // Display panel only if command mode is active and not in login process
  if (!visible || !isCommandMode) return null;

  return (
    <div className={`command-bar ${isDebianTheme ? 'theme-light' : 'theme-dark'}`}>
      <div className="command-bar-content">
        <div className="command-mode-indicator">
          COMMAND MODE: ON
          {isAuthenticated && <span className="admin-indicator"> • ADMIN</span>}
        </div>
        <div className="command-items-container">
          {commands.map((cmd, index) => (
            <div 
              key={index} 
              className="command-item" 
              onClick={() => handleCommandClick(cmd)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCommandClick(cmd)}
            >
              <span className="command-key">{cmd.key}</span>
              <span className="command-desc">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
