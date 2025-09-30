import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';
import { useAuth } from '../contexts/AuthUtils';
import { useTheme } from '../hooks/useTheme';
import { useCommandModalStyles } from '../styles/components/CommandModal.styles';

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandModal: React.FC<CommandModalProps> = ({ isOpen, onClose }) => {
  const { 
    commandHistory, 
    addCommand, 
    historyIndex, 
    setHistoryIndex, 
    setCurrentTab, 
    toggleTheme,
    currentLoginState,
    setLoginState,
    theme,
    isHelpModalOpen
  } = useAppStore();
  const { login, isAuthenticated, logout } = useAuth();
  const { theme: currentTheme } = useTheme();
  const styles = useCommandModalStyles(currentTheme);
  const [input, setInput] = useState('');
  const [commandError, setCommandError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDebianTheme = theme === 'light';

  // Handle command execution
  const executeCommand = async (command: string) => {
    // Reset error state
    setCommandError(null);

    // Check if help modal is open
    if (isHelpModalOpen) {
      setCommandError('Close the help modal before executing commands');
      setTimeout(() => setCommandError(null), 2000);
      return;
    }
    
    if (!command.trim()) {
      onClose();
      return;
    }
    
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
        const username = currentLoginState.username || '';
        await login(username, command);
        setLoginState({ state: 'none' });
        console.log('Login successful');
        onClose();
      } catch (error) {
        setCommandError('Login failed. Invalid credentials.');
        console.error('Login failed:', error);
        // Volta para o estado de nome de usuário após um erro
        setTimeout(() => {
          setLoginState({ state: 'username' });
          setCommandError(null);
          setInput('');
        }, 2000);
        return; // Interrompe para não fechar o modal
      }
      return;
    }
    
    // Regular command processor
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
        
      case '?': // Additional aliases for help
      case 'h':
        // Show help information via modal
        console.log("Opening help modal via alias");
        useAppStore.getState().setHelpModalOpen(true);
        onClose();
        break;
      
      case 'theme':
        toggleTheme();
        break;
        
      case 'clear':
        // Add clear functionality if needed
        break;
        
      case 'login':
        if (isAuthenticated) {
          setCommandError('Already logged in');
          setTimeout(() => setCommandError(null), 2000);
        } else {
          // Start login process
          console.log('Starting login process, please enter username...');
          console.log('Press ESC at any time to cancel the login process');
          setLoginState({ state: 'username' });
          // Importante: não fechamos o modal, deixamos ele aberto para o usuário digitar o nome
          return; // Sai da função sem fechar o modal
        }
        break;
        
      case 'logout':
        if (isAuthenticated) {
          logout();
          console.log('Logged out successfully');
        } else {
          setCommandError('Not logged in');
          setTimeout(() => setCommandError(null), 2000);
        }
        break;
        
      case 'messages':
        if (isAuthenticated) {
          setCurrentTab('messages' as TabName);
          console.log('Accessing messages view...');
        } else {
          setCommandError('You need to be logged in to access messages. Use :login first.');
          setTimeout(() => setCommandError(null), 2000);
        }
        break;
        
      case 'help':
        // Show help information via modal
        console.log("Opening help modal");
        // Set help modal open in app store
        useAppStore.getState().setHelpModalOpen(true);
        // Close command modal as we're opening help modal
        onClose();
        break;
        
      default:
        // Unknown command
        setCommandError(`Unknown command: ${command}`);
        setTimeout(() => setCommandError(null), 2000);
    }
    
    // Don't close the modal if there's an error
    if (!commandError) {
      setInput('');
      // Don't close the modal if we're in the login process
      if (currentLoginState.state === 'none') {
        onClose();
      }
    }
  };

  // Handle key navigation in command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Escape key to exit command modal
    if (e.key === 'Escape') {
      e.preventDefault();
      
      if (currentLoginState.state === 'username' || currentLoginState.state === 'password') {
        // During login, confirm before canceling
        if (confirm('Do you want to cancel the login process?')) {
          console.log('Canceling login process');
          setLoginState({ state: 'none' });
          setInput('');
          onClose();
        }
        return;
      }
      
      setInput('');
      onClose();
      return;
    }
    
    if (e.key === 'Enter') {
      // Check if help modal is open before executing commands
      if (isHelpModalOpen) {
        setCommandError('Close the help modal before executing commands');
        setTimeout(() => setCommandError(null), 2000);
        return;
      }
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

  // Focus input when modal is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Reset error state on open
    if (isOpen) {
      setCommandError(null);
    }
  }, [isOpen]);

  // Update cursor position based on input length
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.setProperty('--cursor-position', input.length.toString());
    }
  }, [input]);
  
  // Reset input when login state changes
  useEffect(() => {
    setInput('');
  }, [currentLoginState.state]);

  // Determine prompt based on login state
  let promptText = isDebianTheme ? '>' : ':';
  
  if (currentLoginState.state === 'username') {
    promptText = 'Username:';
  } else if (currentLoginState.state === 'password') {
    promptText = 'Password:';
  } else if (isAuthenticated) {
    promptText = isDebianTheme ? 'admin>' : 'admin:';
  }

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.modal} 
        onClick={e => e.stopPropagation()}
      >
        <div style={styles.inputContainer}>
          <span style={styles.prompt}>{promptText}</span>
          <div style={styles.inputWrapper}>
            <input
              ref={inputRef}
              type={currentLoginState.state === 'password' ? 'password' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Command input"
              placeholder={
                currentLoginState.state === 'username' 
                  ? "Enter your username" 
                  : currentLoginState.state === 'password'
                    ? "Enter your password" 
                    : commandError || ""
              }
              style={{
                ...styles.input,
                ...(commandError ? styles.inputError : {})
              }}
              autoFocus
            />
            <span 
              style={{
                ...styles.cursor,
                left: `calc(${input.length} * 0.6rem)`
              }}
            ></span>
          </div>
        </div>
        
        {commandError && <div style={styles.commandError}>{commandError}</div>}
        {isHelpModalOpen && <div style={styles.helpModalActive}>Help modal is open. Press 'h' or click outside to close it first.</div>}
        
        <div style={styles.shortcutHelp}>
          {isHelpModalOpen ? (
            <div style={styles.helpMessage}>
              Help modal is open. Close it first to use commands.
            </div>
          ) : currentLoginState.state !== 'none' ? (
            <div style={styles.loginMessage}>
              {currentLoginState.state === 'username' 
                ? "Enter username and press Enter" 
                : "Enter password and press Enter"}
            </div>
          ) : (
            <>
              <div>↑/↓: history</div>
              <div>Enter: execute</div>
              <div>Esc: cancel</div>
              <div>h: help</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Add default export
export default CommandModal;