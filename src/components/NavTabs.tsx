import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';
import { useAuth } from '../contexts/AuthUtils';
import { TabIcon } from './TabIcon';

export const NavTabs = () => {
  const { currentTab, setCurrentTab, isCommandMode } = useAppStore();
  const { isAuthenticated } = useAuth();
  
  // Define all tabs
  const tabs: { id: TabName; label: string; adminOnly?: boolean }[] = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'stats', label: 'Stats' },
    { id: 'messages', label: 'Messages', adminOnly: true }
  ];
  
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Filter tabs based on authentication status
  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAuthenticated);
  
  return (
    <div className="nav-tabs" style={{
      padding: isDebianTheme ? '0' : undefined,
      display: 'flex',
      borderBottom: isDebianTheme ? '1px solid #FFFFFF' : undefined,
    }}>
      {visibleTabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentTab(tab.id)}
          style={{
            padding: isDebianTheme ? '0.35rem 0.75rem' : undefined,
            textTransform: isDebianTheme ? 'none' : undefined,
            fontWeight: isDebianTheme && currentTab === tab.id ? 'bold' : undefined,
            backgroundColor: isDebianTheme && currentTab === tab.id ? '#000080' : undefined,
            borderBottom: currentTab === tab.id 
              ? isDebianTheme 
                ? '2px solid #FFFFFF'
                : '2px solid var(--accent-color, #00FFD9)'
              : undefined
          }}
        >
          <span style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            {isDebianTheme && <span style={{ 
              visibility: currentTab === tab.id ? 'visible' : 'hidden',
              marginRight: '0.25rem'
            }}>›</span>}
            <span className="tab-icon" style={{ 
              marginRight: '0.35rem', 
              display: 'inline-block',
              width: '20px',
              height: '20px'
            }}>
              <TabIcon 
                iconName={tab.id}
                isActive={currentTab === tab.id}
                isDebianTheme={isDebianTheme}
              />
            </span>
            <span>{tab.label}</span>
            {currentTab === tab.id && isCommandMode && (
              <span className="nav-tab-indicator"></span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};
