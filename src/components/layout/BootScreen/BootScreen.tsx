import React, { useEffect } from 'react';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import './BootScreen.css';

interface BootMessageProps {
  message: string;
  delay: number;
}

const BootMessage: React.FC<BootMessageProps> = ({ message, delay }) => {
  const [visible, setVisible] = React.useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <div className="boot-message">
      <span className="boot-prompt">&gt;</span>
      <span>{message}</span>
    </div>
  );
};

/**
 * Boot Screen component that shows when the app first loads
 * Simulates a terminal boot sequence
 */
export const BootScreen: React.FC = () => {
  const { setInitialized } = useAppStore();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Simulate boot sequence
    const bootTimer = setTimeout(() => {
      setInitialized(true);
    }, 3000);
    
    return () => clearTimeout(bootTimer);
  }, [setInitialized]);

  return (
    <div className={`boot-screen theme-${theme}`}>
      <div className="boot-header">
        <pre className="ascii-art">
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
        <h1 className="boot-title">Quewui TUI v0.8</h1>
        <div className="boot-subtitle">Loading system components...</div>
      </div>
      
      <div className="boot-messages">
        <BootMessage message="Initializing system..." delay={300} />
        <BootMessage message="Loading profile data..." delay={800} />
        <BootMessage message="Setting up terminal interface..." delay={1300} />
        <BootMessage message="Establishing connection to GitHub API..." delay={1800} />
        <BootMessage message="System ready!" delay={2500} />
      </div>
    </div>
  );
};

export default BootScreen;