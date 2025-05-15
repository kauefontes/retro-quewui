import React from 'react';
import { useAppStore } from '../store/appStore';
import type { TabName } from '../types';

export const NavTabs = () => {
  const { currentTab, setCurrentTab, isCommandMode } = useAppStore();
  
  // Define all tabs
  const tabs: { id: TabName; label: string }[] = [
    { id: 'about', label: 'About' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'stats', label: 'Stats' }
  ];
  
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  return (
    <div className="nav-tabs" style={{
      padding: isDebianTheme ? '0' : undefined,
      display: 'flex',
      borderBottom: isDebianTheme ? '1px solid #FFFFFF' : undefined,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentTab(tab.id)}
          style={{
            padding: isDebianTheme ? '0.35rem 0.75rem' : undefined,
            textTransform: isDebianTheme ? 'none' : undefined,
            fontWeight: isDebianTheme && currentTab === tab.id ? 'bold' : undefined,
            backgroundColor: isDebianTheme && currentTab === tab.id ? '#000080' : undefined
          }}
        >
          {isDebianTheme && <span style={{ marginRight: '0.5rem', visibility: currentTab === tab.id ? 'visible' : 'hidden' }}>›</span>}
          {tab.label}
          {currentTab === tab.id && isCommandMode && (
            <span className="nav-tab-indicator"></span>
          )}
        </button>
      ))}
    </div>
  );
};
