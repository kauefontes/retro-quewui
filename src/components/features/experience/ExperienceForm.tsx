import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { type Experience, updateExperience, createExperience } from './utils';

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
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position || ''}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Start Date
            </label>
            <input
              type="text"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleInputChange}
              placeholder="eg. Jan 2020"
              required
              style={{ width: '100%', padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              End Date
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="text"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleInputChange}
                placeholder="eg. Dec 2022"
                disabled={isCurrentJob}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  background: isCurrentJob ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)', 
                  color: 'inherit', 
                  border: '1px solid var(--accent-color)',
                  opacity: isCurrentJob ? 0.5 : 1
                }}
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
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            required
            rows={4}
            style={{ width: '100%', padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Technologies
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Add a technology"
              style={{ flex: 1, padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
            />
            <button
              type="button"
              onClick={handleAddTech}
              style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', color: '#000', border: 'none', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {formData.technologies?.map((tech: string, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '4px'
                }}
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  style={{ background: 'none', border: 'none', color: '#ff6666', cursor: 'pointer', padding: '0 0.25rem' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Key Achievements
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              placeholder="Add an achievement"
              style={{ flex: 1, padding: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', color: 'inherit', border: '1px solid var(--accent-color)' }}
            />
            <button
              type="button"
              onClick={handleAddHighlight}
              style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', color: '#000', border: 'none', cursor: 'pointer' }}
            >
              Add
            </button>
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
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(highlight)}
                  style={{ background: 'none', border: 'none', color: '#ff6666', cursor: 'pointer', padding: '0 0.25rem' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ff6666', color: '#ff6666', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ padding: '0.5rem 1rem', background: 'var(--accent-color)', color: '#000', border: 'none', cursor: 'pointer' }}
          >
            {isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
};
