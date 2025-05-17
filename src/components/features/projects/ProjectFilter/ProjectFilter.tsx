import React from 'react';
import { TechTag } from '../../../common/TechTag';
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
      <TechTag
        label="All Technologies"
        size="medium"
        onClick={() => onSelectTech(null)}
        isSelected={selectedTech === null}
      />
      
      {technologies.map((tech) => (
        <TechTag 
          key={tech}
          label={tech}
          size="medium"
          onClick={() => onSelectTech(tech)}
          isSelected={selectedTech === tech}
        />
      ))}
    </div>
  );
};

export default ProjectFilter;