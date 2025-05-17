import { useAppStore } from '../store/appStore';

export const StatusBar = () => {
  const { theme, isCommandMode } = useAppStore();
  
  // Get current date and time
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  
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
        <span>Theme: {theme === 'dark' ? 'NEON' : 'DEBIAN'}</span>
        <span className="mx-3">|</span>
        <span>Mode: {isCommandMode ? 'COMMAND' : 'NORMAL'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a 
          href="https://github.com/username" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000000' : 'inherit'
          }}
          className="hover:underline"
        >
          GitHub
        </a>
        <span>|</span>
        <a 
          href="https://www.linkedin.com/in/username/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000000' : 'inherit'
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