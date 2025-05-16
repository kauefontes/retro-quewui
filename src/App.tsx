import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import type { TabName } from './types';
import './App.css';

// Import layout components
import { TerminalLayout, BootScreen } from './components/Layout';
import { CommandInput, TerminalContent } from './components/Terminal';

// Import views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ExperiencesView } from './views/ExperiencesView';
import { ProjectsView } from './views/ProjectsView';
import { BlogView } from './views/BlogView';
import { ContactView } from './views/ContactView';
import { StatsView } from './views/StatsView';

/**
 * Main Application Component
 * 
 * This is the root component that manages the terminal-like UI experience.
 * It handles keyboard navigation, view switching, and maintains a boot screen
 * for the initial application load.
 */
function App() {
  const { 
    currentTab, 
    setCurrentTab, 
    isInitialized, 
    isCommandMode,
    toggleCommandMode
  } = useAppStore();
  
  // Global keyboard event handler for vim-like navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Only handle navigation when in command mode
      if (isCommandMode) {
        switch (e.key) {
          case ':':
            // Enter command input mode
            // Focus command input if we implement it separately
            break;
            
          case 'Escape':
            toggleCommandMode();
            break;
            
          case 'h': {
            // Navigate left/previous tab
            const tabs: TabName[] = ['about', 'projects', 'experiences', 'blog', 'contact', 'stats'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
            break;
          }
            
          case 'l': {
            // Navigate right/next tab
            const tabs: TabName[] = ['about', 'projects', 'experiences', 'blog', 'contact', 'stats'];
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
  }, [isCommandMode, toggleCommandMode, currentTab, setCurrentTab]);
  
  // Render different content based on initialization state
  if (!isInitialized) {
    return <BootScreen />;
  }

  // Render the active tab content
  const renderContent = () => {
    switch (currentTab) {
      case 'about':
        return <AboutView />;
      case 'projects':
        return <ProjectsView />;
      case 'experiences':
        return <ExperiencesView />;
      case 'blog':
        return <BlogView />;
      case 'contact':
        return <ContactView />;
      case 'stats':
        return <StatsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <TerminalLayout>
      <TerminalContent>
        {renderContent()}
      </TerminalContent>
      <CommandInput />
    </TerminalLayout>
  );
}

export default App;
