import React from 'react';
import type { Project } from '../../../../types/index';
import { TechTag } from '../../../common/TechTag';
import { Button } from '../../../common/Button';
import { Section } from '../../../common/Section';
import { AuthContent } from '../../../common/AuthContent';
import { useTheme } from '../../../../hooks/useTheme';
import './ProjectDetail.css';

interface ProjectDetailProps {
  /** Project data object */
  project: Project;
  /** Handler for when the detail view is closed */
  onClose: () => void;
  /** Handler for when a technology tag is clicked */
  onSelectTech: (tech: string | null) => void;
  /** Optional additional class name */
  className?: string;
}

/**
 * Detailed view of a project with complete information
 */
export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onClose,
  onSelectTech,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div className={`project-detail theme-${theme} ${className}`}>
      <div className="project-detail-header">
        <div className="project-detail-title-area">
          <h3 className="project-detail-title">{project.title}</h3>
          <div className="project-detail-year">Year: {project.year}</div>
        </div>
        <Button 
          onClick={onClose}
          variant="terminal"
          size="small"
          aria-label="Close project"
        >
          [X]
        </Button>
      </div>
      
      <div className="project-detail-description">
        <p>{project.description}</p>
      </div>
      
      {/* Links Section */}
      {(project.githubUrl || project.liveUrl) && (
        <Section title="Links">
          <div className="project-detail-links">
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="project-detail-link"
              >
                <span className="project-detail-link-icon">󰊤</span>
                <span>GitHub</span>
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="project-detail-link"
              >
                <span className="project-detail-link-icon">󰖟</span>
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </Section>
      )}
      
      {/* Technologies Section */}
      <Section title="Technologies">
        <div className="project-detail-technologies">
          {project.technologies.map((tech: string, index: number) => (
            <TechTag 
              key={index} 
              label={tech}
              onClick={() => onSelectTech(tech)}
              size="medium"
            />
          ))}
        </div>
      </Section>
      
      {/* Key Features Section */}
      <Section title="Key Features">
        <ul className="project-detail-features">
          {project.highlights.map((highlight: string, index: number) => (
            <li key={index} className="project-detail-feature-item">
              <span className="project-detail-feature-bullet">›</span>
              {highlight}
            </li>
          ))}
        </ul>
      </Section>
      
      {/* Admin Section - Only visible when logged in */}
      <AuthContent fallback={null}>
        <Section title="Admin Actions" collapsible defaultCollapsed>
          <div className="project-detail-admin-actions">
            <Button variant="primary" size="medium">
              Edit Project
            </Button>
            <Button variant="secondary" size="medium">
              Delete Project
            </Button>
          </div>
        </Section>
      </AuthContent>
    </div>
  );
};

export default ProjectDetail;