import React from 'react';
import type { Project } from '../../../../types/index';
import { TechTag } from '../../../common/TechTag';
import { useTheme } from '../../../../hooks/useTheme';
import './ProjectCard.css';

interface ProjectCardProps {
  /** Project data object */
  project: Project;
  /** Whether this card is currently selected */
  isSelected: boolean;
  /** Click handler for when the card is selected */
  onClick: () => void;
  /** Optional additional class name */
  className?: string;
}

/**
 * Card component for displaying project information in a list
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  onClick,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`project-card ${theme === 'dark' ? 'theme-dark' : 'theme-light'} ${isSelected ? 'selected' : ''} ${className}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="project-card-header">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-year">{project.year}</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-tech-tags">
        {project.technologies.slice(0, 5).map((tech: string, index: number) => (
          <TechTag key={index} label={tech} />
        ))}
        {project.technologies.length > 5 && (
          <TechTag label={`+${project.technologies.length - 5}`} />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;