import React from 'react';

// Import all tab icons
import aboutIcon from '../assets/icons/about.png';
import projectsIcon from '../assets/icons/projects.png';
import experiencesIcon from '../assets/icons/computer.png'; // Using computer.png for experiences
import blogIcon from '../assets/icons/blog.png';
import contactIcon from '../assets/icons/contact.png';
import statsIcon from '../assets/icons/stats.png';
import messagesIcon from '../assets/icons/messages.png';

// Map tab IDs to their respective icons
const tabIcons: Record<string, string> = {
  'about': aboutIcon,
  'projects': projectsIcon,
  'experiences': experiencesIcon,
  'blog': blogIcon,
  'contact': contactIcon,
  'stats': statsIcon,
  'messages': messagesIcon
};

interface TabIconProps {
  iconName: string;
  isActive: boolean;
  isDebianTheme: boolean;
}

export const TabIcon: React.FC<TabIconProps> = ({ iconName, isActive, isDebianTheme }) => {
  return (
    <img 
      src={tabIcons[iconName] || `${iconName}.png`}
      alt={`${iconName} icon`}
      style={{ 
        width: '20px',
        height: '20px',
        filter: isDebianTheme 
          ? 'invert(0)' // For light theme (Debian)
          : isActive 
            ? 'invert(1) brightness(1.5)' // Active tab in dark theme
            : 'invert(0.7)', // Inactive tab in dark theme
        opacity: isActive ? 1 : 0.8,
        marginRight: '0.35rem',
        verticalAlign: 'text-bottom'
      }}
    />
  );
};
