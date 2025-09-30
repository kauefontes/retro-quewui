import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthUtils';
import { useTheme } from '../hooks/useTheme';
import { useHelpModalStyles } from '../styles/components/HelpModal.styles';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { theme: currentTheme } = useTheme();
  const styles = useHelpModalStyles(currentTheme);
  
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
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>HELP</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Available Commands</h3>
            <div style={styles.commandsGrid}>
              {commands.map((cmd, index) => (
                <div key={index} style={styles.commandItem}>
                  <span style={styles.commandKey}>{cmd.key}</span>
                  <span style={styles.commandDesc}>{cmd.description}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Keyboard Shortcuts</h3>
            <div style={styles.commandsGrid}>
              {shortcuts.map((shortcut, index) => (
                <div key={index} style={styles.commandItem}>
                  <span style={styles.commandKey}>{shortcut.key}</span>
                  <span style={styles.commandDesc}>{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isAuthenticated && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Admin Commands</h3>
            <div style={styles.commandsGrid}>
              {adminCommands.map((cmd, index) => (
                <div key={index} style={styles.commandItem}>
                  <span style={styles.commandKey}>:{cmd.key}</span>
                  <span style={styles.commandDesc}>{cmd.description}</span>
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
