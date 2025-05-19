import { useState, useEffect, useCallback, useRef } from 'react';
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
  const fetchProjects = useCallback(async () => {
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
  }, []);

  // Initial fetch with useRef to prevent duplicate fetches
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchProjects();
      hasFetchedRef.current = true;
    }
  }, [fetchProjects]);

  // Filter projects when selected tech changes
  useEffect(() => {
    if (selectedTech && projects.length > 0) {
      const filtered = projects.filter(proj => proj.technologies.includes(selectedTech));
      setFilteredProjects(filtered);

      // If we have filtered projects and no project is selected, select the first one
      if (filtered.length > 0 && !selectedProject) {
        setSelectedProject(filtered[0]);
      }
    } else {
      setFilteredProjects(projects);

      // If we have projects and no project is selected, select the first one
      if (projects.length > 0 && !selectedProject) {
        setSelectedProject(projects[0]);
      }
    }
  }, [selectedTech, projects, selectedProject]);

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
    error,
    refreshProjects: fetchProjects
  };
};

export default useProjects;
