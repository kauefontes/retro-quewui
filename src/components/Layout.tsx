import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { Theme } from '../types';
import { NavTabs } from './NavTabs';
import { StatusBar } from './StatusBar';

// Main layout component that wraps the entire application
interface TerminalLayoutProps {
  children: React.ReactNode;
}

export const TerminalLayout = ({ children }: TerminalLayoutProps) => {
  const { theme } = useAppStore();
  
  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div className={`theme-${theme}`} style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div className="terminal-window" style={{ 
        height: 'calc(100vh - 2rem)', 
        margin: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        <TerminalHeader />
        <NavTabs />
        <div className="terminal-content-wrapper" style={{ 
          flex: '1 1 auto', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </div>
        <StatusBar />
      </div>
    </div>
  );
};

// Header component for the terminal window
export const TerminalHeader = () => {
  const { theme, toggleTheme, isCommandMode, toggleCommandMode } = useAppStore();
  
  return (
    <div className="terminal-header" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '0.5rem 1rem' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ 
          fontWeight: 'bold', 
          marginRight: '1rem',
          color: theme === 'light' ? '#000000' : 'var(--text-color)'
        }}>
          TERMINAL
        </span>
        <span style={{ 
          color: isCommandMode ? 'var(--accent-color)' : (theme === 'light' ? '#000000' : 'var(--text-color)'),
          opacity: isCommandMode ? 1 : 0.7
        }}>
          [CMD MODE: {isCommandMode ? 'ON' : 'OFF'}]
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          className="terminal-button"
          onClick={toggleCommandMode}
          style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: theme === 'light' ? '0' : '0.25rem', 
            fontSize: '0.875rem',
            width: '80px',
            textAlign: 'center'
          }}
        >
          {isCommandMode ? 'Exit CMD' : 'CMD Mode'}
        </button>
        <button 
          className="terminal-button"
          onClick={toggleTheme}
          style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: theme === 'light' ? '0' : '0.25rem', 
            fontSize: '0.875rem',
            width: '80px',
            textAlign: 'center'
          }}
        >
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
      </div>
    </div>
  );
};

// Boot Screen component that shows when the app first loads
export const BootScreen = () => {
  const { setInitialized } = useAppStore();
  
  useEffect(() => {
    // Simulate boot sequence
    setTimeout(() => {
      setInitialized(true);
    }, 3000);
  }, [setInitialized]);

  return (
    <div className="boot-screen" style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'center', 
      alignItems: 'center', padding: '1.5rem', height: '100vh',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <pre className="ascii-art" style={{ display: 'none' }}>
{` ░▒▓██████▓▒░  ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓████████▓▒░ ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓██████▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▒░ 
 ░▒▓██████▓▒░   ░▒▓██████▓▒░  ░▒▓████████▓▒░  ░▒▓█████████████▓▒░   ░▒▓██████▓▒░  ░▒▓█▓▒░ 
   ░▒▓█▓▒░                                                                                
    ░▒▓██▓▒░                                                                              
`}
        </pre>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Portfolio Terminal v1.0</h1>
        <div style={{ marginBottom: '1rem' }}>Loading system components...</div>
      </div>
      
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <BootMessage message="Initializing system..." delay={300} />
        <BootMessage message="Loading profile data..." delay={800} />
        <BootMessage message="Setting up terminal interface..." delay={1300} />
        <BootMessage message="Establishing connection to GitHub API..." delay={1800} />
        <BootMessage message="System ready!" delay={2500} />
      </div>
    </div>
  );
};

// Helper component for boot messages with delayed appearance
interface BootMessageProps {
  message: string;
  delay: number;
}

const BootMessage = ({ message, delay }: BootMessageProps) => {
  const [visible, setVisible] = React.useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
      <span style={{ color: 'var(--accent-color)', marginRight: '0.5rem' }}>&gt;</span>
      <span>{message}</span>
    </div>
  );
};
