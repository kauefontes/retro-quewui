import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';
import { useAuth } from '../contexts/AuthUtils';
import './CommandModal.css';

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
  const [input, setInput] = useState('');
  const [commandError, setCommandError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDebianTheme = theme === 'light';

  // Handle command execution
  const executeCommand = async (command: string) => {
    // Reset error state
    setCommandError(null);

    // Verificar se o modal de ajuda está aberto
    if (isHelpModalOpen) {
      setCommandError('Feche o modal de ajuda antes de executar comandos');
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
        // Show help information
        console.log("Available commands: about, projects, blog, contact, stats, theme, help");
        console.log("Admin commands: login, logout, messages (when logged in)");
        console.log("Tip: Use ':' to focus on the command bar, then type a command without the colon");
        console.log("Login state:", currentLoginState.state);
        break;
        
      default:
        // Unknown command
        setCommandError(`Unknown command: ${command}`);
        setTimeout(() => setCommandError(null), 2000);
    }
    
    // Não fecha o modal se houver erro
    if (!commandError) {
      setInput('');
      // Não fechamos o modal se estivermos no processo de login
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
        // Durante o login, confirmar antes de cancelar
        if (confirm('Deseja cancelar o processo de login?')) {
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
      // Verificar se o modal de ajuda está aberto antes de executar comando
      if (isHelpModalOpen) {
        setCommandError('Feche o modal de ajuda antes de executar comandos');
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
    <div className="command-modal-overlay" onClick={onClose}>
      <div 
        className={`command-modal ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="command-modal-input-container">
          <span className="command-modal-prompt">{promptText}</span>
          <div className="command-modal-input-wrapper">
            <input
              ref={inputRef}
              type={currentLoginState.state === 'password' ? 'password' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Command input"
              placeholder={
                currentLoginState.state === 'username' 
                  ? "Digite seu nome de usuário" 
                  : currentLoginState.state === 'password'
                    ? "Digite sua senha" 
                    : commandError || ""
              }
              className={`command-modal-input ${commandError ? 'error' : ''}`}
              autoFocus
            />
            <span className="command-modal-cursor"></span>
          </div>
        </div>
        
        {commandError && <div className="command-error">{commandError}</div>}
        {isHelpModalOpen && <div className="help-modal-active">Help modal is open. Press 'h' or click outside to close it first.</div>}
        
        <div className="command-shortcut-help">
          {isHelpModalOpen ? (
            <div className="help-message">
              Help modal is open. Close it first to use commands.
            </div>
          ) : currentLoginState.state !== 'none' ? (
            <div className="login-message">
              {currentLoginState.state === 'username' 
                ? "Digite o nome de usuário e pressione Enter" 
                : "Digite a senha e pressione Enter"}
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