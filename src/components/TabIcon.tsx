import React from 'react';

// Import all tab icons
import aboutIcon from '../assets/icons/about.png';
import projectsIcon from '../assets/icons/projects.png';
import experiencesIcon from '../assets/icons/computer.png';
import blogIcon from '../assets/icons/blog.png';
import contactIcon from '../assets/icons/contact.png';
import statsIcon from '../assets/icons/stats.png';
import messagesIcon from '../assets/icons/messages.png';

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
}

export const TabIcon: React.FC<TabIconProps> = ({ iconName, isActive }) => {
  return (
    <img 
      src={tabIcons[iconName] || `${iconName}.png`}
      alt={`${iconName} icon`}
      style={{ 
        width: '20px',
        height: '20px',
        filter:  isActive 
            ? 'invert(1) brightness(1.5)'
            : 'invert(0.7)',
        opacity: isActive ? 1 : 0.8,
        marginRight: '0.35rem',
        verticalAlign: 'text-bottom'
      }}
    />
  );
};
