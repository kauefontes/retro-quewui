import React from 'react';
import { EmptyState } from './EmptyState';
import { useAppStore } from '../../../store/appStore';

interface EmptyProjectStateProps {
  type: 'project' | 'blog' | 'experience' | 'message';
  isFiltered?: boolean;
  filterName?: string;
  onClearFilter?: () => void;
}

/**
 * A specialized version of EmptyState to display when there are no projects, blogs, etc.
 */
export const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({
  type,
  isFiltered = false,
  filterName = '',
  onClearFilter
}) => {
  const { theme } = useAppStore();
  
  // Configure data for each type
  const typeData = {
    project: {
      title: isFiltered ? 'No Projects Found' : 'No Projects',
      message: isFiltered 
        ? `We couldn't find any projects with ${filterName ? `"${filterName}"` : 'the selected filter'}.` 
        : 'There are no projects to display at the moment.',
      icon: '💼'
    },
    blog: {
      title: isFiltered ? 'No Posts Found' : 'No Blog Posts',
      message: isFiltered 
        ? `We couldn't find any posts with the tag ${filterName ? `"${filterName}"` : 'selected'}.` 
        : 'There are no blog posts to display at the moment.',
      icon: '📝'
    },
    experience: {
      title: isFiltered ? 'No Experience Found' : 'No Experience',
      message: isFiltered 
        ? `We couldn't find any experience with ${filterName ? `"${filterName}"` : 'the selected filter'}.` 
        : 'There is no professional experience to display at the moment.',
      icon: '💻'
    },
    message: {
      title: 'No Messages',
      message: 'There are no contact messages to display.',
      icon: '📬'
    }
  };
  
  const data = typeData[type];
  
  return (
    <EmptyState 
      title={data.title}
      message={data.message}
      icon={data.icon}
      action={isFiltered && onClearFilter ? {
        label: "Clear Filter",
        onClick: onClearFilter
      } : undefined}
    />
  );
};

export default EmptyProjectState;
