import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { createExperience, updateExperience } from '../../../data/api';
import type { Experience } from '../../../types/index';
import { TechTag } from '../../common/TechTag';
import { InputField, TextAreaField, InputGroup, Input } from '../../common/Input';
import { Button } from '../../common/Button';

interface ExperienceFormProps {
  experience?: Experience;
  onSave: (updatedExperience: Experience) => void;
  onCancel: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  onSave,
  onCancel
}) => {
  const isEditing = !!experience;
  
  const [formData, setFormData] = useState<Partial<Experience>>(
    experience || {
      company: '',
      position: '',
      startDate: '',
      endDate: null,
      description: '',
      technologies: [],
      highlights: []
    }
  );
  
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [isCurrentJob, setIsCurrentJob] = useState(experience?.endDate === null);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Experience>) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData((prev: Partial<Experience>) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }));
      setTechInput('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setFormData((prev: Partial<Experience>) => ({
      ...prev,
      technologies: (prev.technologies || []).filter((t: string) => t !== tech)
    }));
  };
  
  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev: Partial<Experience>) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };
  
  const handleRemoveHighlight = (highlight: string) => {
    setFormData((prev: Partial<Experience>) => ({
      ...prev,
      highlights: (prev.highlights || []).filter((h: string) => h !== highlight)
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Set end date to null if current job
    const dataToSubmit = {
      ...formData,
      endDate: isCurrentJob ? null : formData.endDate
    };
    
    try {
      if (isEditing && experience?.id) {
        const updated = await updateExperience(experience.id, dataToSubmit);
        onSave(updated);
      } else {
        const created = await createExperience(dataToSubmit as Omit<Experience, 'id'>);
        onSave(created);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
      <h3 style={{ marginBottom: '1rem' }}>
        {isEditing ? 'Edit Experience' : 'Add New Experience'}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <InputField
          label="Company"
          name="company"
          value={formData.company || ''}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          label="Position"
          name="position"
          value={formData.position || ''}
          onChange={handleInputChange}
          required
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InputField
            label="Start Date"
            name="startDate"
            value={formData.startDate || ''}
            onChange={handleInputChange}
            placeholder="eg. Jan 2020"
            required
          />
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              End Date
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Input
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                placeholder="eg. Dec 2022"
                disabled={isCurrentJob}
                style={{ flex: 1 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="current-job"
                  checked={isCurrentJob}
                  onChange={() => setIsCurrentJob(!isCurrentJob)}
                />
                <label htmlFor="current-job" style={{ fontSize: '0.8rem' }}>Current</label>
              </div>
            </div>
          </div>
        </div>
        
        <TextAreaField
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          required
          rows={4}
        />
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Technologies
          </label>
          <div style={{ marginBottom: '0.5rem' }}>
            <InputGroup>
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add a technology"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              />
              <Button
                type="button"
                onClick={handleAddTech}
                variant="primary"
                size="medium"
              >
                Add
              </Button>
            </InputGroup>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.technologies?.map((tech: string, index: number) => (
              <TechTag
                key={index}
                label={tech}
                size="small"
                onDelete={() => handleRemoveTech(tech)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Key Achievements
          </label>
          <div style={{ marginBottom: '0.5rem' }}>
            <InputGroup>
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add an achievement"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
              />
              <Button
                type="button"
                onClick={handleAddHighlight}
                variant="primary"
                size="medium"
              >
                Add
              </Button>
            </InputGroup>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {formData.highlights?.map((highlight: string, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px'
                }}
              >
                <div style={{ flex: 1 }}>{highlight}</div>
                <Button
                  type="button"
                  onClick={() => handleRemoveHighlight(highlight)}
                  variant="secondary"
                  size="small"
                  style={{ color: '#ff6666', minWidth: 'auto', padding: '0 0.5rem' }}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            size="medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};
