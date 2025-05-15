import { useState } from 'react';
import { experiences } from '../data/mockData';
import type { Experience } from '../data/mockData';
import { useAppStore } from '../store/appStore';

export const ExperiencesView = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Extract unique technologies from all experiences to create tech tags
  const allTechnologies = Array.from(
    new Set(experiences.flatMap(exp => exp.technologies))
  ).sort();

  // Filter experiences based on selected technology
  const filteredExperiences = selectedTech 
    ? experiences.filter(exp => exp.technologies.includes(selectedTech))
    : experiences;
  
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
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
        }}>
          Professional Experience
        </h2>
      </div>
      
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
        
        {allTechnologies.map(tech => (
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
              {filteredExperiences.map(exp => (
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
            />
          </div>
        )}
      </div>
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
  const dateDisplay = `${experience.startDate} - ${experience.endDate || 'Present'}`;
  
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
}

const ExperienceDetail = ({ experience, onClose, isDebianTheme, setSelectedTech }: ExperienceDetailProps) => {
  const dateDisplay = `${experience.startDate} - ${experience.endDate || 'Present'}`;
  
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
          {experience.technologies.map((tech, index) => (
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
          {experience.highlights.map((highlight, index) => (
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