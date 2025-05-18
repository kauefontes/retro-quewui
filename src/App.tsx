import { useAppStore } from './store/appStore';
import { useEffect, useState } from 'react';
import type { TabName } from './types';
import './App.css';
import { useAuth } from './contexts/AuthUtils';

// Import layout components
import { TerminalLayout } from './components/layout/TerminalLayout';
import { BootScreen } from './components/layout/BootScreen';
import { TerminalContent } from './components/Terminal';
import { AuthProvider } from './contexts/AuthContext';
import CommandModal from './components/CommandModal';
import HelpModal from './components/HelpModal';

// Import views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ExperiencesView } from './views/ExperiencesView';
import { ProjectsView } from './views/ProjectsView/ProjectsView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { StatsView } from './views/StatsView';
import { MessagesView } from './views/MessagesView';

// MainContent component with keyboard navigation
const MainContent = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    isCommandMode,
    toggleCommandMode,
    isHelpModalOpen,
    setHelpModalOpen
  } = useAppStore();
  
  const { isAuthenticated } = useAuth();
  
  // Add state for command modal
  const [isCommandModalOpen, setCommandModalOpen] = useState(false);

  // Global keyboard event handler for vim-like navigation and command modal
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const { currentLoginState } = useAppStore.getState();
      
      // Don't handle keyboard navigation during login process
      if (currentLoginState.state === 'username' || currentLoginState.state === 'password') {
        return;
      }
      
      // Handle ":" key to open command modal regardless of command mode
      if (e.key === ':' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setCommandModalOpen(true);
        return;
      }
      
      // Only handle navigation when in command mode
      if (isCommandMode) {
        // Handle single-letter tab navigation shortcuts
        const tabShortcuts: { [key: string]: TabName | null } = {
          'a': 'about' as TabName,
          'p': 'projects' as TabName,
          'e': 'experiences' as TabName,
          'b': 'blog' as TabName,
          'c': 'contact' as TabName,
          's': 'stats' as TabName,
          'm': isAuthenticated ? 'messages' as TabName : null,
          'h': null // For help - this will open help modal
        };
        
        if (Object.prototype.hasOwnProperty.call(tabShortcuts, e.key) && 
            document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          
          if (e.key === 'h') {
            // Toggle help modal
            setHelpModalOpen(!isHelpModalOpen);
            
            // Se o CommandModal estiver aberto, feche-o
            if (isCommandModalOpen) {
              setCommandModalOpen(false);
            }
            
            return;
          }
          
          const targetTab = tabShortcuts[e.key];
          if (targetTab) {
            setCurrentTab(targetTab);
            return;
          }
        }
        
        switch (e.key) {
            
          case 'Escape':
            toggleCommandMode();
            break;
            
          case 'h': {
            // Navigate left/previous tab
            const tabs: TabName[] = ['about', 'projects', 'experiences', 'blog', 'contact', 'stats'];
            
            // Only include messages tab if authenticated
            if (isAuthenticated) {
              tabs.push('messages');
            }
            
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
            break;
          }
            
          case 'l': {
            // Navigate right/next tab
            const tabs: TabName[] = ['about', 'projects', 'experiences', 'blog', 'contact', 'stats'];
            
            // Only include messages tab if authenticated
            if (isAuthenticated) {
              tabs.push('messages');
            }
            
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            }
            break;
          }
            
          case 'j':
            // Navigate down (within a content view)
            window.scrollBy(0, 100);
            break;
            
          case 'k':
            // Navigate up (within a content view)
            window.scrollBy(0, -100);
            break;
            
          default:
            break;
        }
      } else if (e.key === 'Escape') {
        toggleCommandMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandMode, toggleCommandMode, currentTab, setCurrentTab, isAuthenticated, isHelpModalOpen, setHelpModalOpen, isCommandModalOpen, setCommandModalOpen]);

  useEffect(() => {
    // Adicionar mensagem de feedback quando o HelpModal estiver aberto
    if (isHelpModalOpen && isCommandModalOpen) {
      // Se ambos modais estiverem abertos, fechamos o CommandModal
      setCommandModalOpen(false);
    }
  }, [isHelpModalOpen, isCommandModalOpen, setCommandModalOpen]);

  // Render the active tab content and modals
  return (
    <>
      {/* Command modal that appears in the center of the screen when ":" is pressed */}
      <CommandModal isOpen={isCommandModalOpen} onClose={() => setCommandModalOpen(false)} />
      
      {/* Help modal that appears when 'h' is pressed in command mode */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />
      
      {/* Active tab content */}
      {currentTab === 'about' && <AboutView />}
      {currentTab === 'projects' && <ProjectsView />}
      {currentTab === 'experiences' && <ExperiencesView />}
      {currentTab === 'blog' && <BlogView />}
      {currentTab === 'contact' && <ContactView />}
      {currentTab === 'stats' && <StatsView />}
      {currentTab === 'messages' && <MessagesView />}
      {!currentTab && <HomeView />}
    </>
  );
};

/**
 * Main Application Component
 * 
 * This is the root component that manages the terminal-like UI experience.
 * It handles keyboard navigation, view switching, and maintains a boot screen
 * for the initial application load.
 */
function App() {
  const { isInitialized } = useAppStore();
  
  // Render different content based on initialization state
  if (!isInitialized) {
    return <BootScreen />;
  }

  return (
    <AuthProvider>
      <TerminalLayout>
        <TerminalContent>
          <MainContent />
        </TerminalContent>
      </TerminalLayout>
    </AuthProvider>
  );
}

export default App;
