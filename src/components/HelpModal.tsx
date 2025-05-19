import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../contexts/AuthUtils';
import './HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useAppStore();
  const { isAuthenticated } = useAuth();
  
  // Define commands and their descriptions
  const commands = [
    { key: ':', description: 'Open command prompt' },
    { key: 'about', description: 'View about page' },
    { key: 'projects', description: 'View projects page' },
    { key: 'experiences', description: 'View experiences page' },
    { key: 'blog', description: 'View blog page' },
    { key: 'contact', description: 'View contact page' },
    { key: 'stats', description: 'View stats page' },
    { key: 'theme', description: 'Toggle light/dark theme' },
    { key: 'help', description: 'Show this help' }
  ];
  
  // Define admin commands
  const adminCommands = [
    { key: 'login', description: 'Login to admin area' },
    { key: 'logout', description: 'Logout from admin area' },
    { key: 'messages', description: 'View messages (admin only)' }
  ];
  
  // Define keyboard shortcuts
  const shortcuts = [
    { key: ':', description: 'Open command prompt' },
    { key: 'h', description: 'Show this help' },
    { key: 'a', description: 'Go to About page' },
    { key: 'p', description: 'Go to Projects page' },
    { key: 'e', description: 'Go to Experiences page' },
    { key: 'b', description: 'Go to Blog page' },
    { key: 'c', description: 'Go to Contact page' },
    { key: 's', description: 'Go to Stats page' },
    { key: 'j', description: 'Scroll down' },
    { key: 'k', description: 'Scroll up' },
    { key: 'Esc', description: 'Toggle command mode / Close modal' }
  ];
  
  // Add admin shortcut if authenticated
  if (isAuthenticated) {
    shortcuts.push({ key: 'm', description: 'Go to Messages page (admin only)' });
  }

  // Adicionar um event listener para fechar o modal com a tecla 'h'
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' && document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div 
        className={`help-modal ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-modal-header">
          <h2 className="help-modal-title">HELP</h2>
          <button className="help-modal-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="help-modal-content">
          <div className="help-section">
            <h3 className="help-section-title">Available Commands</h3>
            <div className="help-commands-grid">
              {commands.map((cmd, index) => (
                <div key={index} className="help-command-item">
                  <span className="help-command-key">{cmd.key}</span>
                  <span className="help-command-desc">{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="help-section">
            <h3 className="help-section-title">Keyboard Shortcuts</h3>
            <div className="help-commands-grid">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="help-command-item">
                  <span className="help-command-key">{shortcut.key}</span>
                  <span className="help-command-desc">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="help-section">
            <h3 className="help-section-title">Admin Commands</h3>
            <div className="help-commands-grid">
              {adminCommands.map((cmd, index) => (
                <div key={index} className="help-command-item">
                  <span className="help-command-key">:{cmd.key}</span>
                  <span className="help-command-desc">{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;
