import React from 'react';
import { TechTag } from '../../../common/TechTag';
import { useTheme } from '../../../../hooks/useTheme';
import './ExperienceFilter.css';

interface ExperienceFilterProps {
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
 * Filter component for experiences by technology
 */
export const ExperienceFilter: React.FC<ExperienceFilterProps> = ({
  technologies,
  selectedTech,
  onSelectTech,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div className={`experience-filter theme-${theme} ${className}`}>
      <TechTag
        label="All Stacks"
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

export default ExperienceFilter;
