import React from 'react';
import { Button } from '../../../common/Button';
import { useTheme } from '../../../../hooks/useTheme';
import './ProjectFilter.css';

interface ProjectFilterProps {
  /** Array of available technologies to filter by */
  technologies: string[];
  /** Currently selected technology */
  selectedTech: string | null;
  /** Handler for when a technology is selected */
  onSelectTech: (tech: string | null) => void;
  /** Optional additional class name */
  className?: string;
}

/**
 * Filter component for projects by technology
 */
export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  technologies,
  selectedTech,
  onSelectTech,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div className={`project-filter theme-${theme} ${className}`}>
      <Button
        variant="terminal"
        size="small"
        className={`filter-button ${selectedTech === null ? 'selected' : ''}`}
        onClick={() => onSelectTech(null)}
      >
        All Technologies
      </Button>
      
      {technologies.map((tech) => (
        <Button 
          key={tech}
          variant="terminal"
          size="small"
          className={`filter-button ${selectedTech === tech ? 'selected' : ''}`}
          onClick={() => onSelectTech(tech)}
        >
          {tech}
        </Button>
      ))}
    </div>
  );
};

export default ProjectFilter;