import { useState, useEffect, useCallback } from 'react';
import type { Experience } from '../types/index';
import { getExperiences } from '../data/api';
import { experiences as mockExperiences } from '../data/mockData';

/**
 * Custom hook for managing experiences data
 * Handles fetching, filtering, and selecting experiences
 */
export const useExperiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch experiences data
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const experiencesData = await getExperiences();
      setExperiences(experiencesData);
      setFilteredExperiences(experiencesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences data. Using fallback data.');
      // Fallback to mock data
      setExperiences(mockExperiences);
      setFilteredExperiences(mockExperiences);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Filter experiences when selected tech changes
  useEffect(() => {
    if (selectedTech && experiences.length > 0) {
      setFilteredExperiences(experiences.filter(exp => 
        exp.technologies.includes(selectedTech)
      ));
    } else {
      setFilteredExperiences(experiences);
    }
  }, [selectedTech, experiences]);

  // Get all unique technologies from experiences
  const allTechnologies = experiences.length > 0 
    ? Array.from(new Set(experiences.flatMap(exp => exp.technologies))).sort()
    : [];

  // Select an experience by ID
  const selectExperienceById = (id: string) => {
    const experience = experiences.find(e => e.id === id);
    if (experience) {
      setSelectedExperience(experience);
    }
  };

  return {
    experiences,
    filteredExperiences,
    selectedExperience,
    setSelectedExperience,
    selectExperienceById,
    selectedTech,
    setSelectedTech,
    allTechnologies,
    loading,
    error,
    refreshExperiences: fetchExperiences,
    setExperiences
  };
};

export default useExperiences;
