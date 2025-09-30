import React, { useEffect } from 'react';
import { useAppStore } from '../../../store/appStore';
import { useTheme } from '../../../hooks/useTheme';
import { useBootScreenStyles } from '../../../styles/components/BootScreen.styles';

interface BootMessageProps {
  message: string;
  delay: number;
}

const BootMessage: React.FC<BootMessageProps> = ({ message, delay }) => {
  const [visible, setVisible] = React.useState(false);
  const { theme } = useTheme();
  const styles = useBootScreenStyles(theme);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  return (
    <div style={styles.bootMessage}>
      <span style={styles.bootPrompt}>&gt;</span>
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
  const styles = useBootScreenStyles(theme);
  
  useEffect(() => {
    // Simulate boot sequence
    const bootTimer = setTimeout(() => {
      setInitialized(true);
    }, 3000);
    
    return () => clearTimeout(bootTimer);
  }, [setInitialized]);

  return (
    <div style={styles.bootScreen}>
      <div style={styles.bootHeader}>
        <pre style={styles.asciiArt}>
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
        <h1 style={styles.bootTitle}>Quewui TUI v0.8</h1>
        <div style={styles.bootSubtitle}>Loading system components...</div>
      </div>
      
      <div style={styles.bootMessages}>
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