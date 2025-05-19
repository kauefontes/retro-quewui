import React, { useState } from 'react';
import { ProjectCard } from '../../components/features/projects/ProjectCard';
import { ProjectDetail } from '../../components/features/projects/ProjectDetail/ProjectDetail';
import { ProjectFilter } from '../../components/features/projects/ProjectFilter';
import { ProjectForm } from '../../components/features/projects/ProjectForm';
import { useProjects } from '../../hooks/useProjects';
import { useTheme } from '../../hooks/useTheme';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';
import { ListDetailLayout } from '../../components/common/ListDetailLayout';
import { EmptyState, EmptyProjectState } from '../../components/common/EmptyState';
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

  const projectsList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', height: '100%' }}>
      {loading ? (
        <EmptyState 
          title="Loading Projects"
          message="Please wait while we load the projects..."
          isLoading={true}
        />
      ) : error ? (
        <EmptyState 
          title="Error Loading"
          message={error || "An error occurred while loading projects. Please try again later."}
          isError={true}
        />
      ) : filteredProjects.length > 0 ? (
        filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id}
            onClick={() => setSelectedProject(project)}
          />
        ))
      ) : selectedTech ? (
        <EmptyProjectState
          type="project"
          isFiltered={true}
          filterName={selectedTech}
          onClearFilter={() => setSelectedTech(null)}
        />
      ) : (
        <EmptyProjectState
          type="project"
          isFiltered={false}
        />
      )}
    </div>
  );
  
  const projectDetail = selectedProject && (
    <ProjectDetail
      project={selectedProject}
      onClose={() => setSelectedProject(null)}
      onSelectTech={setSelectedTech}
      onEdit={handleEditProject}
      onDelete={handleDeleteProject}
    />
  );
  
  const titleAction = !loading && !error && (
    <span className="live-badge">live</span>
  );
  
  const techFilter = (
    <ProjectFilter 
      technologies={allTechnologies}
      selectedTech={selectedTech}
      onSelectTech={setSelectedTech}
    />
  );
  
  const actionButton = (
    <FloatingActionButton
      onClick={handleAddProject}
      ariaLabel="Add new project"
      label="[New]"
    />
  );
  
  return (
    <div className={`projects-view theme-${theme}`}>
      {techFilter}
      
      <ListDetailLayout
        title="Projects"
        titleAction={titleAction}
        loading={loading}
        error={error}
        listContent={projectsList}
        detailContent={projectDetail}
        hasSelectedItem={!!selectedProject}
        loadingMessage="Loading projects..."
        emptyMessage={selectedTech ? `No projects found with ${selectedTech} technology` : "No projects found"}
        actionButton={actionButton}
      />
    </div>
  );
};

export default ProjectsView;
