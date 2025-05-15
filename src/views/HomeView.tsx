import React from 'react';
import { useAppStore } from '../store/appStore';

export const HomeView = () => {
  const { setCurrentTab, theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
    }}>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Developer Portfolio
        </h1>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '1.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Senior Software Developer
        </p>
        <pre style={{
          display: 'block',
          marginBottom: '1.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          fontSize: '0.75rem',
          lineHeight: '1.2'
        }}>
{`  ██████   ██    ██ ███████ ██     ██ ██    ██ ██ 
 ██    ██  ██    ██ ██      ██     ██ ██    ██ ██ 
 ██    ██  ██    ██ █████   ██  █  ██ ██    ██ ██ 
 ██ ▄▄ ██  ██    ██ ██      ██ ███ ██ ██    ██ ██ 
  ██████    ██████  ███████  ███ ███   ██████  ██ 
     ▀▀                                           `}
        </pre>
      </section>
      
      <section style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '48rem' }}>
        <p style={{
          textAlign: 'center',
          marginBottom: '1rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Welcome to my terminal-style portfolio. Use the command line below or navigate with the following commands:
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          margin: '0 auto'
        }}>
          <CommandOption 
            command=":about" 
            description="Learn about me" 
            onClick={() => setCurrentTab('about')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":experiences" 
            description="View my experiences" 
            onClick={() => setCurrentTab('experiences')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":blog" 
            description="Read my blog posts" 
            onClick={() => setCurrentTab('blog')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":contact" 
            description="Get in touch" 
            onClick={() => setCurrentTab('contact')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":stats" 
            description=" " 
            onClick={() => setCurrentTab('stats')} 
            isDebianTheme={isDebianTheme}
          />
          <CommandOption 
            command=":theme" 
            description="Toggle theme" 
            onClick={() => useAppStore.getState().toggleTheme()} 
            isDebianTheme={isDebianTheme}
          />
        </div>
      </section>
      
      <section style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '0.5rem', color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' }}>
          <kbd style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            margin: '0 0.25rem'
          }}>h</kbd> 
          <kbd style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            margin: '0 0.25rem'
          }}>j</kbd> 
          <kbd style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            margin: '0 0.25rem'
          }}>k</kbd> 
          <kbd style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            margin: '0 0.25rem'
          }}>l</kbd> 
          - Navigate like vim
        </p>
        <p style={{ color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' }}>
          <kbd style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            margin: '0 0.25rem'
          }}>Tab</kbd> 
          - Navigate between elements
        </p>
      </section>
    </div>
  );
};

interface CommandOptionProps {
  command: string;
  description: string;
  onClick: () => void;
  isDebianTheme: boolean;
}

const CommandOption = ({ command, description, onClick, isDebianTheme }: CommandOptionProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '0.75rem',
        backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
        border: '1px solid',
        borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)',
        borderRadius: isDebianTheme ? '0' : '0.25rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        width: '100%'
      }}
    >
      <div style={{ 
        fontWeight: 'bold',
        color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
      }}>{command}</div>
      <div style={{ 
        fontSize: '0.875rem',
        opacity: 0.8,
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>{description}</div>
    </button>
  );
};
