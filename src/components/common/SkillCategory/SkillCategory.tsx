import React from 'react';
import { useAppStore } from '../../../store/appStore';
import { TechTag } from '../TechTag';

interface SkillCategoryProps {
  /** Category title */
  title: string;
  /** Array of skill/technology names */
  skills: string[];
  /** Optional additional class name */
  className?: string;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * Component for displaying a category of skills/technologies with tags
 * Extracted from AboutView inline component
 */
export const SkillCategory: React.FC<SkillCategoryProps> = ({
  title,
  skills,
  className = '',
  style = {},
}) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  return (
    <div className={`skill-category ${className}`} style={{ marginBottom: '1.5rem', ...style }}>
      <h4 style={{ 
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {title}
      </h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem'
      }}>
        {skills.map((skill, index) => (
          <TechTag 
            key={index} 
            label={skill} 
          />
        ))}
      </div>
    </div>
  );
};

export default SkillCategory;