// Re-export types and API methods

// Re-export types
export type { Project } from '../../../types/index';

// Re-export API methods
export { createProject, updateProject, deleteProject } from '../../../data/api';

// Validation function for project fields
export function validateProject(project: Partial<Project>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!project.title || project.title.trim() === '') {
    errors.title = 'Title is required';
  }

  if (!project.description || project.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (!project.year) {
    errors.year = 'Year is required';
  } else if (isNaN(Number(project.year)) || Number(project.year) < 2000 || Number(project.year) > new Date().getFullYear()) {
    errors.year = 'Please enter a valid year';
  }

  if (!project.technologies || project.technologies.length === 0) {
    errors.technologies = 'At least one technology is required';
  }

  return errors;
}
