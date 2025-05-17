import { useState, useEffect } from 'react';
import type { Project } from '../types/index';
import { getProjects } from '../data/api';
import { projects as mockProjects } from '../data/mockData';

/**
 * Custom hook for managing projects data
 * Handles fetching, filtering, and selecting projects
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects data. Using fallback data.');
        // Fallback to mock data
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects when selected tech changes
  useEffect(() => {
    if (selectedTech && projects.length > 0) {
      setFilteredProjects(projects.filter(proj => 
        proj.technologies.includes(selectedTech)
      ));
    } else {
      setFilteredProjects(projects);
    }
  }, [selectedTech, projects]);

  // Get all unique technologies from projects
  const allTechnologies = projects.length > 0 
    ? Array.from(new Set(projects.flatMap(proj => proj.technologies))).sort()
    : [];

  // Select a project by ID
  const selectProjectById = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
    }
  };

  return {
    projects,
    filteredProjects,
    selectedProject,
    setSelectedProject,
    selectProjectById,
    selectedTech,
    setSelectedTech,
    allTechnologies,
    loading,
    error
  };
};

export default useProjects;