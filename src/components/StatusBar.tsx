import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const StatusBar = () => {
  const { theme, isCommandMode } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Social media links - would ideally come from an API
  const githubUrl = 'https://github.com/kauefontes'; 
  const linkedinUrl = 'https://linkedin.com/in/kauefontes';
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Format date and time
  const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  
  const isDebianTheme = theme === 'light';

  return (
    <div className="terminal-statusbar" style={{
      padding: isDebianTheme ? '0.25rem 0.5rem' : undefined,
      backgroundColor: isDebianTheme ? '#C0C0C0' : undefined,
      color: isDebianTheme ? '#000000' : undefined,
      fontWeight: isDebianTheme ? 'normal' : undefined,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ 
          fontWeight: isDebianTheme ? 'bold' : undefined
        }}>
          Theme: {theme === 'dark' ? 'NEON' : 'DEBIAN'}
        </span>
        <span className="mx-3">|</span>
        <span style={{ 
          fontWeight: isCommandMode ? 'bold' : undefined,
          color: isCommandMode 
            ? isDebianTheme ? '#000066' : 'var(--accent-color)' 
            : undefined
        }}>
          Mode: {isCommandMode ? 'COMMAND' : 'NORMAL'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a 
          href={githubUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000066' : 'inherit',
            fontWeight: isDebianTheme ? 'bold' : 'normal'
          }}
          className="hover:underline"
        >
          GitHub
        </a>
        <span>|</span>
        <a 
          href={linkedinUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000066' : 'inherit',
            fontWeight: isDebianTheme ? 'bold' : 'normal'
          }}
          className="hover:underline"
        >
          LinkedIn
        </a>
        <span className="mx-2">|</span>
        <span>{date}</span>
        <span className="mx-2">|</span>
        <span>{time}</span>
      </div>
    </div>
  );
};