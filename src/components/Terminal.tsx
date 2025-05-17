import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';
import { useAuth } from '../contexts/AuthUtils';

// Terminal command input component
export const CommandInput = () => {
  const { 
    commandHistory, 
    addCommand, 
    historyIndex, 
    setHistoryIndex, 
    setCurrentTab, 
    toggleTheme,
    currentLoginState,
    setLoginState
  } = useAppStore();
  const { login, isAuthenticated, logout } = useAuth();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle command execution
  const executeCommand = async (command: string) => {
    if (!command.trim()) return;
    
    addCommand(command);
    console.log('Executing command:', command);
    
    const normalizedCommand = command.trim().toLowerCase();
    
    // Login process state machine
    if (currentLoginState.state === 'username') {
      // Capture username
      setLoginState({ state: 'password', username: command });
      setInput('');
      return;
    } else if (currentLoginState.state === 'password') {
      // Capture password and attempt login
      try {
        const username = currentLoginState.username || ''; // Get username from state
        await login(username, command);
        setLoginState({ state: 'none' });
        console.log('Login successful');
      } catch (error) {
        console.error('Login failed:', error);
      }
      setInput('');
      return;
    }
    
    // Regular command processor
    // If command starts with ':', remove it (for backward compatibility)
    const tabCommand = normalizedCommand.startsWith(':') 
      ? normalizedCommand.substring(1) 
      : normalizedCommand;
    
    switch (tabCommand) {
      case 'about':
      case 'projects':
      case 'blog':
      case 'contact':
      case 'stats':
      case 'experiences':
        setCurrentTab(tabCommand as TabName);
        break;
      
      case 'theme':
        toggleTheme();
        break;
        
      case 'clear':
        // Add clear functionality if needed
        break;
        
      case 'login':
        if (isAuthenticated) {
          console.log('Already logged in');
        } else {
          // Start login process
          console.log('Starting login process, please enter username...');
          console.log('Press ESC at any time to cancel the login process');
          setLoginState({ state: 'username' });
        }
        break;
        
      case 'logout':
        if (isAuthenticated) {
          logout();
          console.log('Logged out successfully');
        } else {
          console.log('Not logged in');
        }
        break;
        
      case 'messages':
        if (isAuthenticated) {
          setCurrentTab('messages' as TabName);
          console.log('Accessing messages view...');
        } else {
          console.log('You need to be logged in to access messages. Use :login first.');
        }
        break;
        
      case 'help':
        // Show help information
        console.log("Available commands: about, projects, blog, contact, stats, theme, help");
        console.log("Admin commands: login, logout, messages (when logged in)");
        console.log("Tip: Use ':' to focus on the command bar, then type a command without the colon");
        console.log("Login state:", currentLoginState.state);
        break;
        
      default:
        // Unknown command
        console.log(`Unknown command: ${command}`);
    }
    
    setInput('');
  };

  // Handle key navigation in command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key to exit login mode
    if (e.key === 'Escape' && (currentLoginState.state === 'username' || currentLoginState.state === 'password')) {
      e.preventDefault();
      console.log('Canceling login process');
      setLoginState({ state: 'none' });
      setInput('');
      return;
    }
    
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
      } else {
        setHistoryIndex(commandHistory.length);
        setInput('');
      }
    }
  };

  // Focus input and handle keypress events
  useEffect(() => {
    inputRef.current?.focus();
    
    // Log the current login state for debugging
    console.log('Login state currently:', currentLoginState.state);
  }, [currentLoginState]);
  
  // Add global keyboard listener for ":" key to focus the command input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only handle ":" key when not already focused on an input or textarea
      if (e.key === ':' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setInput('');
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Determine prompt based on login state
  let promptText = isDebianTheme ? '>' : '$';
  let placeholderText = isDebianTheme 
    ? "Type a command (e.g. about, projects) or press ':' to focus" 
    : "Type a command (e.g. about, projects, blog) or press ':' to focus";
  
  if (currentLoginState.state === 'username') {
    promptText = 'Username:';
    placeholderText = "Enter your username (press ESC to cancel)";
  } else if (currentLoginState.state === 'password') {
    promptText = 'Password:';
    placeholderText = "Enter your password (press ESC to cancel)";
  } else if (isAuthenticated) {
    promptText = isDebianTheme ? 'admin>' : 'admin$';
  }
  
  return (
    <div className="command-input" style={{
      backgroundColor: isDebianTheme ? '#000080' : undefined,
      padding: '0.5rem',
      borderTop: isDebianTheme ? '1px solid #FFFFFF' : undefined,
      display: 'flex',
      alignItems: 'center'
    }}>
      <span className="prompt" style={{
        color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        marginRight: '0.5rem'
      }}>
        {promptText}
      </span>
      <input
        ref={inputRef}
        type={currentLoginState.state === 'password' ? 'password' : 'text'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Command input"
        placeholder={placeholderText}
        style={{ 
          flex: 1, 
          color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          fontFamily: 'inherit',
          fontSize: '1rem',
          background: 'transparent',
          border: 'none',
          outline: 'none'
        }}
      />
      <span className="command-cursor" style={{
        backgroundColor: isDebianTheme ? '#FFFFFF' : undefined
      }}></span>
    </div>
  );
};

// Terminal content display component
interface TerminalContentProps {
  children: React.ReactNode;
}

export const TerminalContent = ({ children }: TerminalContentProps) => {
  return (
    <div className="terminal-content">
      {children}
    </div>
  );
};
