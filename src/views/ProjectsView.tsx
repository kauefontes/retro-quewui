import { useState } from 'react';
import type { Project } from '../data/mockData';
import { projects } from '../data/mockData';
import { useAppStore } from '../store/appStore';

export const ProjectsView = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '0.75rem',
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        paddingBottom: '0.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>Projects</h2>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Project list */}
        <div style={{ 
          width: selectedProject ? '40%' : '100%', 
          overflowY: 'auto',
          paddingRight: selectedProject ? '1rem' : '0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(project)}
                isDebianTheme={isDebianTheme}
              />
            ))}
          </div>
        </div>
        
        {/* Project details */}
        {selectedProject && (
          <div style={{ 
            width: '60%', 
            borderLeft: '1px solid',
            borderColor: isDebianTheme ? '#666666' : '#103149',
            padding: '0 0 0 1rem',
            overflowY: 'auto'
          }}>
            <ProjectDetail 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)}
              isDebianTheme={isDebianTheme}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  isDebianTheme: boolean;
}

const ProjectCard = ({ project, isSelected, onClick, isDebianTheme }: ProjectCardProps) => {
  return (
    <div 
      style={{
        padding: '0.75rem', 
        border: '1px solid', 
        borderColor: isSelected 
          ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
          : (isDebianTheme ? '#666666' : '#103149'),
        backgroundColor: isSelected 
          ? (isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 255, 217, 0.05)')
          : (isDebianTheme ? '#0000B3' : 'rgba(0, 0, 0, 0.3)'),
        cursor: 'pointer',
        borderRadius: isDebianTheme ? '0' : '0.25rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <h3 style={{ fontWeight: 'bold' }}>{project.title}</h3>
        <span style={{ 
          fontSize: '0.875rem', 
          opacity: 0.7
        }}>{project.year}</span>
      </div>
      <p style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: 0.8
      }}>{project.description}</p>
      <div style={{ 
        marginTop: '0.5rem', 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '0.25rem'
      }}>
        {project.technologies.slice(0, 3).map((tech, index) => (
          <span 
            key={index} 
            style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.75rem',
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 3 && (
          <span style={{ 
            display: 'inline-block', 
            padding: '0.25rem 0.5rem', 
            fontSize: '0.75rem',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
            color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
          }}>
            +{project.technologies.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  isDebianTheme: boolean;
}

const ProjectDetail = ({ project, onClose, isDebianTheme }: ProjectDetailProps) => {
  return (
    <div style={{
      padding: '1rem',
      borderLeft: '1px solid',
      borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)',
      height: '100%',
      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold' 
        }}>{project.title}</h3>
        <button 
          onClick={onClose}
          style={{ 
            padding: '0.25rem 0.5rem',
            borderRadius: isDebianTheme ? '0' : '0.25rem',
            fontSize: '0.875rem',
            border: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            backgroundColor: 'transparent',
            color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
          }}
          aria-label="Close project details"
        >
          [X]
        </button>
      </div>
      
      <p style={{ marginBottom: '1rem' }}>{project.description}</p>
      
      <h4 style={{ 
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>Key Features:</h4>
      <ul style={{ 
        listStyleType: 'disc',
        paddingLeft: '1.25rem',
        marginBottom: '1rem'
      }}>
        {project.highlights.map((highlight, index) => (
          <li key={index} style={{ marginBottom: '0.25rem' }}>{highlight}</li>
        ))}
      </ul>
      
      <h4 style={{ 
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>Technologies:</h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem', 
        marginBottom: '1rem'
      }}>
        {project.technologies.map((tech, index) => (
          <span 
            key={index} 
            style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.75rem',
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginTop: '1rem'
      }}>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              fontSize: '0.875rem',
              border: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              backgroundColor: 'transparent',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            View Source
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              padding: '0.25rem 0.75rem',
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              fontSize: '0.875rem',
              border: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              backgroundColor: 'transparent',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};
