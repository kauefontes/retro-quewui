import React, { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';
import { useAuth } from '../contexts/AuthUtils';
import { useTheme } from '../hooks/useTheme';
import { useMainContentStyles } from '../styles/components/MainContent.styles';

// Import views
import { HomeView } from '../views/HomeView';
import { AboutView } from '../views/AboutView';
import { ExperiencesView } from '../views/ExperiencesView';
import { ProjectsView } from '../views/ProjectsView/ProjectsView';
import { BlogView } from '../views/BlogView';
import { ContactView } from '../views/ContactView';
import { StatsView } from '../views/StatsView';
import { MessagesView } from '../views/MessagesView';

export const MainContent: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    isCommandMode,
    toggleCommandMode
  } = useAppStore();
  
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const styles = useMainContentStyles(theme);
  
  // Global keyboard event handler for vim-like navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const { currentLoginState } = useAppStore.getState();
      
      // Don't handle keyboard navigation during login process
      if (currentLoginState.state === 'username' || currentLoginState.state === 'password') {
        return;
      }
      
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
  }, [isCommandMode, toggleCommandMode, currentTab, setCurrentTab, isAuthenticated]);

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
      case 'messages':
        return <MessagesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div style={styles.mainContentContainer}>
      {renderContent()}
    </div>
  );
};

export default MainContent;
