import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { type Project, updateProject, createProject, validateProject } from './utils';
import { useAppStore } from '../../../store/appStore';

interface ProjectFormProps {
  project?: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSave,
  onCancel
}) => {
  const isEditing = !!project;
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  const [formData, setFormData] = useState<Partial<Project>>(
    project || {
      title: '',
      description: '',
      technologies: [],
      year: new Date().getFullYear(),
      highlights: [],
      githubUrl: '',
      liveUrl: '',
      imageUrl: ''
    }
  );
  
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }));
      setTechInput('');
      
      // Clear technology error if it exists
      if (errors.technologies) {
        setErrors(prev => ({ ...prev, technologies: '' }));
      }
    }
  };
  
  const handleRemoveTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };
  
  const handleRemoveHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateProject(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      let savedProject: Project;
      
      if (isEditing && project) {
        // Update existing project
        savedProject = await updateProject(project.id, formData);
      } else {
        // Create new project
        savedProject = await createProject(formData as Omit<Project, 'id'>);
      }
      
      onSave(savedProject);
    } catch (error) {
      console.error('Failed to save project:', error);
      setErrors({ submit: 'Failed to save project. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="project-form" style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(10, 25, 41, 0.8)',
      padding: '1.5rem',
      border: '1px solid',
      borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
    }}>
      <h2 style={{ 
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {isEditing ? 'Edit Project' : 'New Project'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="title" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.title 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.title && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.title}
            </div>
          )}
        </div>
        
        {/* Year */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="year" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Year *
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={2000}
            max={new Date().getFullYear()}
            value={formData.year || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.year 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.year && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.year}
            </div>
          )}
        </div>
        
        {/* Description */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="description" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.description 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.description && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.description}
            </div>
          )}
        </div>
        
        {/* GitHub URL */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="githubUrl" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            GitHub URL
          </label>
          <input
            id="githubUrl"
            name="githubUrl"
            type="url"
            value={formData.githubUrl || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.githubUrl 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.githubUrl && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.githubUrl}
            </div>
          )}
        </div>
        
        {/* Live URL */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="liveUrl" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Live URL
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            type="url"
            value={formData.liveUrl || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.liveUrl 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.liveUrl && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.liveUrl}
            </div>
          )}
        </div>
        
        {/* Image URL */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            htmlFor="imageUrl" 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: errors.imageUrl 
                ? '#FF6666' 
                : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
            }}
          />
          {errors.imageUrl && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.imageUrl}
            </div>
          )}
        </div>
        
        {/* Technologies */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Technologies *
          </label>
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add a technology..."
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                border: '1px solid',
                borderColor: errors.technologies 
                  ? '#FF6666' 
                  : (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)')
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
            />
            <button
              type="button"
              onClick={handleAddTechnology}
              style={{
                padding: '0.5rem 1rem',
                marginLeft: '0.5rem',
                backgroundColor: isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                border: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          
          {errors.technologies && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {errors.technologies}
            </div>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.technologies?.map((tech, index) => (
              <div 
                key={index}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                  borderRadius: isDebianTheme ? '0' : '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                    cursor: 'pointer',
                    padding: '0 0.25rem',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Highlights */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Highlights
          </label>
          <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              placeholder="Add a highlight..."
              style={{
                flex: 1,
                padding: '0.5rem',
                backgroundColor: isDebianTheme ? '#000080' : 'rgba(0, 0, 0, 0.3)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                border: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              style={{
                padding: '0.5rem 1rem',
                marginLeft: '0.5rem',
                backgroundColor: isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                border: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                cursor: 'pointer'
              }}
            >
              Add
            </button>
          </div>
          
          <ul style={{ 
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            {formData.highlights?.map((highlight, index) => (
              <li 
                key={index}
                style={{
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  borderLeft: '2px solid',
                  borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{highlight}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Error message */}
        {errors.submit && (
          <div style={{ 
            color: '#FF6666', 
            padding: '0.75rem', 
            marginBottom: '1rem',
            backgroundColor: 'rgba(255, 102, 102, 0.1)',
            border: '1px solid #FF6666'
          }}>
            {errors.submit}
          </div>
        )}
        
        {/* Form actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              border: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              border: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1
            }}
          >
            {isSaving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
          </button>
        </div>
      </form>
    </div>
  );
};
