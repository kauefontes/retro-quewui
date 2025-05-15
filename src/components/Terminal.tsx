import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';

// Terminal command input component
export const CommandInput = () => {
  const { 
    commandHistory, 
    addCommand, 
    historyIndex, 
    setHistoryIndex, 
    setCurrentTab, 
    toggleTheme 
  } = useAppStore();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle command execution
  const executeCommand = (command: string) => {
    if (!command.trim()) return;
    
    addCommand(command);
    
    const normalizedCommand = command.trim().toLowerCase();
    
    // Command processor
    if (normalizedCommand.startsWith(':')) {
      // Tab navigation commands
      const tabCommand = normalizedCommand.substring(1);
      
      switch (tabCommand) {
        case 'about':
        case 'projects':
        case 'blog':
        case 'contact':
        case 'stats':
          setCurrentTab(tabCommand as TabName);
          break;
        
        case 'theme':
          toggleTheme();
          break;
          
        case 'clear':
          // Add clear functionality if needed
          break;
          
        case 'help':
          // Show help information
          console.log("Available commands: :about, :projects, :blog, :contact, :stats, :theme, :help");
          // In a real implementation, you would show this information to the user in a modal or output area
          break;
          
        default:
          // Unknown command
          console.log(`Unknown command: ${command}`);
      }
    }
    
    setInput('');
  };

  // Handle key navigation in command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
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
        {isDebianTheme ? '>' : '$'}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Command input"
        placeholder={isDebianTheme ? "Type a command (e.g. :about, :projects)" : "Type a command (e.g. :about, :projects, :blog)"}
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
