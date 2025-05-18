import React, { useState } from 'react';
import type { Project } from '../../../../types/index';
import { TechTag } from '../../../common/TechTag';
import { Section } from '../../../common/Section';
import { DetailActionButtons } from '../../../common/DetailActionButtons';
import { ImageModal } from '../../../common/ImageModal';
import { useTheme } from '../../../../hooks/useTheme';
import './ProjectDetail.css';

interface ProjectDetailProps {
  /** Project data object */
  project: Project;
  /** Handler for when the detail view is closed */
  onClose: () => void;
  /** Handler for when a technology tag is clicked */
  onSelectTech: (tech: string | null) => void;
  /** Optional handler for edit action */
  onEdit?: () => void;
  /** Optional handler for delete action */
  onDelete?: () => void;
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
  onEdit,
  onDelete,
  className = ''
}) => {
  const { theme } = useTheme();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Prepare all image URLs in a single array
  const allImages = project.imageUrls 
    ? project.imageUrls 
    : (project.imageUrl ? [project.imageUrl] : []);
    
  // Handler for opening the image modal
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <div className={`project-detail theme-${theme} ${className}`}>
      <div className="project-detail-header">
        <div className="project-detail-title-area">
          <h3 className="project-detail-title">{project.title}</h3>
          <div className="project-detail-year">Year: {project.year}</div>
        </div>
        <DetailActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
        />
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
      
      {/* Project Images Section */}
      {(project.imageUrls && project.imageUrls.length > 0) && (
        <Section title="Project Screenshots">
          <div className="project-detail-images">
            {project.imageUrls.map((imageUrl: string, index: number) => (
              <div 
                key={index} 
                className="project-detail-image-container"
                onClick={() => handleImageClick(index)}
                role="button"
                aria-label={`View ${project.title} screenshot ${index + 1}`}
              >
                <img 
                  src={imageUrl} 
                  alt={`${project.title} screenshot ${index + 1}`} 
                  className="project-detail-image"
                />
                <div className="project-detail-image-overlay">
                  <span className="project-detail-image-zoom">🔍</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      
      {/* Single Image Fallback */}
      {(!project.imageUrls || project.imageUrls.length === 0) && project.imageUrl && (
        <Section title="Project Screenshot">
          <div className="project-detail-images">
            <div 
              className="project-detail-image-container"
              onClick={() => handleImageClick(0)}
              role="button"
              aria-label={`View ${project.title} screenshot`}
            >
              <img 
                src={project.imageUrl} 
                alt={`${project.title} screenshot`} 
                className="project-detail-image"
              />
              <div className="project-detail-image-overlay">
                <span className="project-detail-image-zoom">🔍</span>
              </div>
            </div>
          </div>
        </Section>
      )}
      
      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        images={allImages}
        initialIndex={selectedImageIndex}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};

export default ProjectDetail;
