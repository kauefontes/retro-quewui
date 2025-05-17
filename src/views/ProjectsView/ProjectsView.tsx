import React, { useState } from 'react';
import { Section } from '../../components/common/Section';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { ProjectDetail } from '../../components/features/projects/ProjectDetail/ProjectDetail';
import { ProjectFilter } from '../../components/features/projects/ProjectFilter';
import { ProjectForm } from '../../components/features/projects/ProjectForm';
import { useProjects } from '../../hooks/useProjects';
import { useTheme } from '../../hooks/useTheme';
import { AdminControls } from '../../components/common/AdminControls';
import { AuthContent } from '../../components/common/AuthContent/AuthContent';
import type { Project } from '../../types/index';
import { deleteProject } from '../../data/api';
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
    error,
    refreshProjects
  } = useProjects();
  
  const { theme } = useTheme();
  
  // Admin state
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Admin functions
  const handleAddProject = () => {
    setIsEditing(true);
    setEditingProject(null);
    setSelectedProject(null);
  };
  
  const handleEditProject = () => {
    if (selectedProject) {
      setIsEditing(true);
      setEditingProject(selectedProject);
    }
  };
  
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    if (window.confirm(`Are you sure you want to delete the project "${selectedProject.title}"?`)) {
      try {
        await deleteProject(selectedProject.id);
        setSelectedProject(null);
        refreshProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert(`Failed to delete project: ${(error as Error).message}`);
      }
    }
  };
  
  const handleSaveProject = (savedProject: Project) => {
    refreshProjects();
    setIsEditing(false);
    setSelectedProject(savedProject);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProject(null);
  };
  
  // If editing, render the project form
  if (isEditing) {
    return (
      <div style={{ padding: '1rem' }}>
        <ProjectForm 
          project={editingProject || undefined}
          onSave={handleSaveProject}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className={`projects-view theme-${theme}`}>
      <Section 
        title="Projects"
        action={
          <>
            {!loading && !error && (
              <span className="live-badge">live</span>
            )}
            <AuthContent>
              <AdminControls
                entityName="Project"
                onAdd={handleAddProject}
                onEdit={selectedProject ? handleEditProject : undefined}
                onDelete={selectedProject ? handleDeleteProject : undefined}
              />
            </AuthContent>
          </>
        }
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
                  filteredProjects.map(project => (
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
                <div className="project-details">
                  <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onSelectTech={setSelectedTech}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
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