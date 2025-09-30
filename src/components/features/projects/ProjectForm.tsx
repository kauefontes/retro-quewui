import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { type Project, updateProject, createProject, validateProject } from './utils';
import { useAppStore } from '../../../store/appStore';
import { TechTag } from '../../common/TechTag';
import { InputField, TextAreaField, InputGroup, Input } from '../../common/Input';
import { Button } from '../../common/Button';

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
      imageUrl: '',
      imageUrls: []
    }
  );
  
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [imageInput, setImageInput] = useState('');
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

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), imageInput.trim()]
      }));
      setImageInput('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index) || []
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
        <InputField
          label="Title *"
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          error={!!errors.title}
          errorMessage={errors.title}
        />
        
        {/* Year */}
        <InputField
          label="Year *"
          id="year"
          name="year"
          type="number"
          min={2000}
          max={new Date().getFullYear()}
          value={formData.year || ''}
          onChange={handleInputChange}
          error={!!errors.year}
          errorMessage={errors.year}
        />
        
        {/* Description */}
        <TextAreaField
          label="Description *"
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={4}
          error={!!errors.description}
          errorMessage={errors.description}
        />
        
        {/* GitHub URL */}
        <InputField
          label="GitHub URL"
          id="githubUrl"
          name="githubUrl"
          type="url"
          value={formData.githubUrl || ''}
          onChange={handleInputChange}
          error={!!errors.githubUrl}
          errorMessage={errors.githubUrl}
        />
        
        {/* Live URL */}
        <InputField
          label="Live URL"
          id="liveUrl"
          name="liveUrl"
          type="url"
          value={formData.liveUrl || ''}
          onChange={handleInputChange}
          error={!!errors.liveUrl}
          errorMessage={errors.liveUrl}
        />
        
        {/* Image URL */}
        <InputField
          label="Main Image URL"
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl || ''}
          onChange={handleInputChange}
          error={!!errors.imageUrl}
          errorMessage={errors.imageUrl}
        />
        
        {/* Additional Images */}
        <div style={{ marginBottom: '1rem' }}>
          <label 
            style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}
          >
            Additional Images
          </label>
          <InputGroup>
            <Input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Add image URL..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
            />
            <Button
              type="button"
              onClick={handleAddImage}
              variant="secondary"
            >
              Add
            </Button>
          </InputGroup>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {formData.imageUrls?.map((url, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  borderLeft: '2px solid',
                  borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
              >
                <div style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}>
                  {url}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
          <InputGroup>
            <Input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add a technology..."
              error={!!errors.technologies}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
            />
            <Button
              type="button"
              onClick={handleAddTechnology}
              variant="secondary"
            >
              Add
            </Button>
          </InputGroup>
          
          {errors.technologies && (
            <div style={{ color: '#FF6666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {errors.technologies}
            </div>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.technologies?.map((tech, index) => (
              <TechTag
                key={index}
                label={tech}
                size="small"
                onDelete={() => handleRemoveTechnology(index)}
              />
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
          <InputGroup>
            <Input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              placeholder="Add a highlight..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
            />
            <Button
              type="button"
              onClick={handleAddHighlight}
              variant="secondary"
            >
              Add
            </Button>
          </InputGroup>
          
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
          <Button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            variant="primary"
          >
            {isSaving ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
          </Button>
        </div>
      </form>
    </div>
  );
};
