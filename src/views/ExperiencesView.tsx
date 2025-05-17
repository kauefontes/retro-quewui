import { useState } from 'react';
import type { Experience } from '../types/index';
import { useAppStore } from '../store/appStore';
import { deleteExperience } from '../data/api';
import { AdminControls } from '../components/common/AdminControls';
import { ExperienceForm } from '../components/features/experience/ExperienceForm';
import { AuthContent } from '../components/common/AuthContent/AuthContent';
import { useExperiences } from '../hooks/useExperiences';

export const ExperiencesView = () => {
  const {
    filteredExperiences,
    selectedExperience,
    setSelectedExperience,
    selectedTech,
    setSelectedTech,
    allTechnologies,
    loading,
    error,
    refreshExperiences
  } = useExperiences();
  
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Admin state
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Admin handlers
  const handleAddExperience = () => {
    setIsAdding(true);
    setSelectedExperience(null);
  };
  
  const handleEditExperience = () => {
    if (!selectedExperience) {
      alert('Please select an experience first');
      return;
    }
    
    setIsEditing(true);
    setEditingExperience(selectedExperience);
  };
  
  const handleDeleteExperience = async () => {
    if (!selectedExperience) {
      alert('Please select an experience first');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete "${selectedExperience.position} at ${selectedExperience.company}"?`)) {
      return;
    }
    
    try {
      await deleteExperience(selectedExperience.id);
      setSelectedExperience(null);
      refreshExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience. Please try again.');
    }
  };
  
  const handleSaveExperience = (savedExperience: Experience) => {
    refreshExperiences();
    
    if (isEditing) {
      setSelectedExperience(savedExperience);
    }
    
    setIsEditing(false);
    setIsAdding(false);
    setEditingExperience(null);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingExperience(null);
  };
  
  // Form editing mode
  if (isEditing || isAdding) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          {isEditing ? 'Edit Experience' : 'Add New Experience'}
        </h2>
        
        <ExperienceForm 
          experience={editingExperience || undefined}
          onSave={handleSaveExperience}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        paddingBottom: '0.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Professional Experience
          {!loading && !error && (
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#00AA00', 
              color: 'white',
              padding: '0.1rem 0.3rem',
              borderRadius: '0.25rem',
              fontWeight: 'normal'
            }}>live</span>
          )}
        </h2>
      </div>
      
      {/* Admin Controls */}
      <AuthContent>
        <AdminControls 
          entityName="Experience"
          onAdd={handleAddExperience}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
        />
      </AuthContent>
      
      {loading ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Loading professional experiences...
        </div>
      ) : error ? (
        <div style={{ 
          padding: '1rem', 
          color: isDebianTheme ? '#FF6666' : '#FF6666',
          borderLeft: '3px solid #FF6666'
        }}>
          {error}
        </div>
      ) : (
        <>
          {/* Tech filter tags */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.5rem', 
            marginBottom: '1rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            <button
              style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem', 
                fontSize: '0.875rem',
                opacity: selectedTech === null ? '1' : '0.7',
                border: '1px solid',
                borderColor: selectedTech === null 
                  ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                  : (isDebianTheme ? '#666666' : '#103149'),
                backgroundColor: selectedTech === null 
                  ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                  : 'transparent',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}
              onClick={() => setSelectedTech(null)}
            >
              All Stacks
            </button>
            
            {allTechnologies.map((tech) => (
              <button 
                key={tech}
                style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: isDebianTheme ? '0' : '0.25rem', 
                  fontSize: '0.875rem',
                  opacity: selectedTech === tech ? '1' : '0.7',
                  border: '1px solid',
                  borderColor: selectedTech === tech 
                    ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                    : (isDebianTheme ? '#666666' : '#103149'),
                  backgroundColor: selectedTech === tech 
                    ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                    : 'transparent',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
                onClick={() => setSelectedTech(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
            {/* Experiences List */}
            <div style={{ 
              width: selectedExperience ? '35%' : '100%', 
              overflowY: 'auto', 
              paddingRight: '0.75rem'
            }}>
              {filteredExperiences.length === 0 ? (
                <div style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  opacity: 0.7,
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
                }}>
                  No experiences found with {selectedTech} technology
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredExperiences.map((exp) => (
                    <ExperienceCard 
                      key={exp.id}
                      experience={exp}
                      isSelected={selectedExperience?.id === exp.id}
                      onClick={() => setSelectedExperience(exp)}
                      isDebianTheme={isDebianTheme}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Experience Detail */}
            {selectedExperience && (
              <div style={{ width: '65%', overflowY: 'auto', paddingLeft: '0.75rem' }}>
                <ExperienceDetail 
                  experience={selectedExperience} 
                  onClose={() => setSelectedExperience(null)}
                  isDebianTheme={isDebianTheme}
                  setSelectedTech={setSelectedTech}
                  onEdit={handleEditExperience}
                  onDelete={handleDeleteExperience}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface ExperienceCardProps {
  experience: Experience;
  isSelected: boolean;
  onClick: () => void;
  isDebianTheme: boolean;
}

const ExperienceCard = ({ experience, isSelected, onClick, isDebianTheme }: ExperienceCardProps) => {
  // Handle property name differences between backend and frontend
  const startDate = 'startDate' in experience ? experience.startDate : (experience as { start_date: string }).start_date;
  const endDate = 'endDate' in experience ? experience.endDate : (experience as { end_date: string | null }).end_date;
  const dateDisplay = `${startDate} - ${endDate || 'Present'}`;
  
  return (
    <div 
      style={{
        padding: '0.75rem',
        border: '1px solid',
        borderColor: isDebianTheme
          ? (isSelected ? '#FFFFFF' : '#666666')
          : (isSelected ? 'var(--accent-color)' : '#103149'),
        cursor: 'pointer',
        backgroundColor: isDebianTheme 
          ? (isSelected ? '#0000D3' : '#0000B3')
          : (isSelected ? 'rgba(0, 255, 217, 0.1)' : 'transparent'),
        transition: 'border-color 0.2s',
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <h3 style={{ fontWeight: 'bold' }}>{experience.position}</h3>
        <span style={{ fontSize: '0.875rem', opacity: '0.7' }}>{dateDisplay}</span>
      </div>
      
      <div style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        fontWeight: 'bold',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {experience.company}
      </div>
      
      <p style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: '0.8',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {experience.description}
      </p>
      
      <div style={{ 
        marginTop: '0.5rem', 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.25rem' 
      }}>
        {experience.technologies.slice(0, 5).map((tech, index) => (
          <span 
            key={index} 
            style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.75rem', 
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
          >
            {tech}
          </span>
        ))}
        {experience.technologies.length > 5 && (
          <span 
            style={{ 
              display: 'inline-block', 
              padding: '0.25rem 0.5rem', 
              fontSize: '0.75rem', 
              borderRadius: isDebianTheme ? '0' : '0.25rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
          >
            +{experience.technologies.length - 5}
          </span>
        )}
      </div>
    </div>
  );
};

interface ExperienceDetailProps {
  experience: Experience;
  onClose: () => void;
  isDebianTheme: boolean;
  setSelectedTech: (tech: string | null) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ExperienceDetail = ({ 
  experience, 
  onClose, 
  isDebianTheme, 
  setSelectedTech,
  onEdit,
  onDelete
}: ExperienceDetailProps) => {
  // Handle property name differences between backend and frontend
  const startDate = 'startDate' in experience ? experience.startDate : (experience as { start_date: string }).start_date;
  const endDate = 'endDate' in experience ? experience.endDate : (experience as { end_date: string | null }).end_date;
  const dateDisplay = `${startDate} - ${endDate || 'Present'}`;
  
  return (
    <div style={{ 
      padding: '1rem', 
      borderLeft: '1px solid',
      borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)', 
      height: '100%',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{experience.position}</h3>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{experience.company}</div>
          <div style={{ fontSize: '0.875rem', opacity: '0.7' }}>{dateDisplay}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <AuthContent>
            <button 
              onClick={onEdit}
              style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem', 
                fontSize: '0.875rem',
                border: '1px solid',
                borderColor: '#4CAF50',
                backgroundColor: 'transparent',
                color: '#4CAF50'
              }}
              aria-label="Edit experience"
            >
              Edit
            </button>
            <button 
              onClick={onDelete}
              style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem', 
                fontSize: '0.875rem',
                border: '1px solid',
                borderColor: '#F44336',
                backgroundColor: 'transparent',
                color: '#F44336'
              }}
              aria-label="Delete experience"
            >
              Delete
            </button>
          </AuthContent>
          <button 
            onClick={onClose}
            style={{ 
              padding: '0.25rem 0.5rem', 
              borderRadius: isDebianTheme ? '0' : '0.25rem', 
              fontSize: '0.875rem',
              border: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              backgroundColor: 'transparent',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
            aria-label="Close experience"
          >
            [X]
          </button>
        </div>
      </div>
      
      <div style={{ 
        marginBottom: '1.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
      }}>
        <p>{experience.description}</p>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Technology Stack
        </h4>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.5rem' 
        }}>
          {experience.technologies.map((tech: string, index: number) => (
            <button 
              key={index} 
              style={{ 
                display: 'inline-block', 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.875rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem',
                backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTech(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Key Achievements
        </h4>
        <ul style={{ 
          listStyleType: 'none',
          paddingLeft: isDebianTheme ? '0.75rem' : '1rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          {experience.highlights.map((highlight: string, index: number) => (
            <li key={index} style={{
              position: 'relative',
              paddingLeft: '1rem',
              marginBottom: '0.5rem'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}>›</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
