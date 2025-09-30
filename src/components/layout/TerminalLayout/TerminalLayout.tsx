import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { NavTabs } from '../../NavTabs';
import { StatusBar } from '../../StatusBar';
import { TerminalHeader } from '../TerminalHeader';
import CommandBar from '../../CommandBar';
import { useTerminalLayoutStyles } from '../../../styles/components/TerminalLayout.styles';

interface TerminalLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout component that wraps the entire application
 * Provides the terminal window styling and structure
 */
export const TerminalLayout: React.FC<TerminalLayoutProps> = ({ 
  children,
  className = ''
}) => {
  const { theme } = useAppStore();
  const terminalStyles = useTerminalLayoutStyles(theme);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Apply theme class to body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <div style={{...terminalStyles.terminalContainer}} className={className}>
      <div style={isMobile ? terminalStyles.terminalWindowMobile : terminalStyles.terminalWindow}>
        <TerminalHeader />
        <NavTabs />
        <div style={terminalStyles.terminalContentWrapper}>
          {children}
        </div>
        <CommandBar />
        <StatusBar />
      </div>
    </div>
  );
};

export default TerminalLayout;