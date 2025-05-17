import React from 'react';
import { Section } from '../../components/common/Section';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { ProjectDetail } from '../../components/features/projects/ProjectDetail';
import { ProjectFilter } from '../../components/features/projects/ProjectFilter';
import { useProjects } from '../../hooks/useProjects';
import { useTheme } from '../../hooks/useTheme';
import './ProjectsView.css';

/**
 * Projects view component that displays a list of projects with filtering and details
 */
export const ProjectsView: React.FC = () => {
  const { 
    filteredProjects, 
    selectedProject, 
    setSelectedProject,
    selectedTech,
    setSelectedTech,
    allTechnologies,
    loading,
    error
  } = useProjects();
  
  const { theme } = useTheme();

  return (
    <div className={`projects-view theme-${theme}`}>
      <Section 
        title="Projects"
        action={!loading && !error && (
          <span className="live-badge">live</span>
        )}
      >
        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <>
            <ProjectFilter 
              technologies={allTechnologies}
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
            />
            
            <div className="projects-content">
              <div className={`projects-list ${selectedProject ? 'with-details' : ''}`}>
                {filteredProjects.length === 0 ? (
                  <div className="empty-state">
                    No projects found with {selectedTech} technology
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id}
                      project={project}
                      isSelected={selectedProject?.id === project.id}
                      onClick={() => setSelectedProject(project)}
                    />
                  ))
                )}
              </div>
              
              {selectedProject && (
                <div className="project-details-panel">
                  <ProjectDetail 
                    project={selectedProject} 
                    onClose={() => setSelectedProject(null)}
                    onSelectTech={setSelectedTech}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Section>
    </div>
  );
};

export default ProjectsView;