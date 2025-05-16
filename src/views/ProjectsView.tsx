import { useState, useEffect } from 'react';
import type { Project } from '../types/index';
import { useAppStore } from '../store/appStore';
import { projects as mockProjects } from '../data/mockData';
import { getProjects, getProjectById } from '../data/api';

export const ProjectsView = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects data. Using fallback data.');
        // Importando dados mockados como fallback
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Extract unique technologies from all projects to create tech tags
  const allTechnologies = projects.length > 0 
    ? Array.from(
        new Set(projects.flatMap(proj => proj.technologies))
      ).sort()
    : [];

  // Filter projects based on selected technology
  const filteredProjects = selectedTech && projects.length > 0
    ? projects.filter(proj => proj.technologies.includes(selectedTech))
    : projects;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Projects
          {!loading && !error && (
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#00AA00', 
              color: 'white',
              padding: '0.1rem 0.3rem',
              borderRadius: '0.25rem',
              fontWeight: 'normal'
            }}>live</span>
          )}
        </h2>
      </div>
      
      {loading ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Loading projects...
        </div>
      ) : error ? (
        <div style={{ 
          padding: '1rem', 
          color: isDebianTheme ? '#FF6666' : '#FF6666',
          borderLeft: '3px solid #FF6666'
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* Tech filter tags */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            marginBottom: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            <button
              style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem', 
                fontSize: '0.875rem',
                opacity: selectedTech === null ? '1' : '0.7',
                border: '1px solid',
                borderColor: selectedTech === null 
                  ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                  : (isDebianTheme ? '#666666' : '#103149'),
                backgroundColor: selectedTech === null 
                  ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                  : 'transparent',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}
              onClick={() => setSelectedTech(null)}
            >
              All Technologies
            </button>
            
            {allTechnologies.map((tech) => (
              <button 
                key={tech}
                style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: isDebianTheme ? '0' : '0.25rem', 
                  fontSize: '0.875rem',
                  opacity: selectedTech === tech ? '1' : '0.7',
                  border: '1px solid',
                  borderColor: selectedTech === tech 
                    ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                    : (isDebianTheme ? '#666666' : '#103149'),
                  backgroundColor: selectedTech === tech 
                    ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                    : 'transparent',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
            {/* Projects List */}
            <div style={{ 
              width: selectedProject ? '35%' : '100%', 
              overflowY: 'auto', 
              paddingRight: '0.75rem'
            }}>
              {filteredProjects.length === 0 ? (
                <div style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  opacity: 0.7,
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
                }}>
                  No projects found with {selectedTech} technology
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id}
                      project={project}
                      isSelected={selectedProject?.id === project.id}
                      onClick={() => setSelectedProject(project)}
                      isDebianTheme={isDebianTheme}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Project Detail */}
            {selectedProject && (
              <div style={{ width: '65%', overflowY: 'auto', paddingLeft: '0.75rem' }}>
                <ProjectDetail 
                  project={selectedProject} 
                  onClose={() => setSelectedProject(null)}
                  isDebianTheme={isDebianTheme}
                  setSelectedTech={setSelectedTech}
                />
              </div>
            )}
          </div>
        </>
      )}
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
        borderColor: isDebianTheme
          ? (isSelected ? '#FFFFFF' : '#666666')
          : (isSelected ? 'var(--accent-color)' : '#103149'),
        cursor: 'pointer',
        backgroundColor: isDebianTheme 
          ? (isSelected ? '#0000D3' : '#0000B3')
          : (isSelected ? 'rgba(0, 255, 217, 0.1)' : 'transparent'),
        transition: 'border-color 0.2s',
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
        alignItems: 'center',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <h3 style={{ fontWeight: 'bold' }}>{project.title}</h3>
        <span style={{ fontSize: '0.875rem', opacity: '0.7' }}>{project.year}</span>
      </div>
      
      <p style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: '0.8',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {project.description}
      </p>
      
      <div style={{ 
        marginTop: '0.5rem', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.25rem' 
      }}>
        {project.technologies.slice(0, 5).map((tech, index) => (
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
        {project.technologies.length > 5 && (
          <span 
            style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.75rem', 
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
          >
            +{project.technologies.length - 5}
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
  setSelectedTech: (tech: string | null) => void;
}

const ProjectDetail = ({ project, onClose, isDebianTheme, setSelectedTech }: ProjectDetailProps) => {
  return (
    <div style={{ 
      padding: '1rem', 
      borderLeft: '1px solid',
      borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)', 
      height: '100%',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{project.title}</h3>
          <div style={{ fontSize: '0.875rem', opacity: '0.7' }}>Year: {project.year}</div>
        </div>
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
          aria-label="Close project"
        >
          [X]
        </button>
      </div>
      
      <div style={{ 
        marginBottom: '1.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
      }}>
        <p>{project.description}</p>
      </div>
      
      {/* Links */}
      {(project.githubUrl || project.liveUrl) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
            borderBottom: '1px solid',
            borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
            paddingBottom: '0.25rem'
          }}>
            Links
          </h4>
          <div style={{ 
            display: 'flex',
            gap: '1rem'
          }}>
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
              >
                <span style={{ fontFamily: 'monospace' }}>󰊤</span>
                <span>GitHub</span>
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
              >
                <span style={{ fontFamily: 'monospace' }}>󰖟</span>
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Technologies
        </h4>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem' 
        }}>
          {project.technologies.map((tech, index) => (
            <button 
              key={index} 
              style={{ 
                display: 'inline-block', 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.875rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem',
                backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Key Features
        </h4>
        <ul style={{ 
          listStyleType: 'none',
          paddingLeft: isDebianTheme ? '0.75rem' : '1rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          {project.highlights.map((highlight, index) => (
            <li key={index} style={{
              position: 'relative',
              paddingLeft: '1rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}>›</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};