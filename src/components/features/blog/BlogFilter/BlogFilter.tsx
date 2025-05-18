import React from 'react';
import { TechTag } from '../../../common/TechTag';
import { useTheme } from '../../../../hooks/useTheme';
import './BlogFilter.css';

interface BlogFilterProps {
  /** Array of available tags to filter by */
  tags: string[];
  /** Currently selected tag */
  selectedTag: string | null;
  /** Handler for when a tag is selected */
  onSelectTag: (tag: string | null) => void;
  /** Optional additional class name */
  className?: string;
}

/**
 * Filter component for blog posts by tag
 */
export const BlogFilter: React.FC<BlogFilterProps> = ({
  tags,
  selectedTag,
  onSelectTag,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div className={`blog-filter theme-${theme} ${className}`}>
      <TechTag
        label="All"
        size="medium"
        onClick={() => onSelectTag(null)}
        isSelected={selectedTag === null}
      />
      
      {tags.map((tag) => (
        <TechTag 
          key={tag}
          label={tag}
          size="medium"
          onClick={() => onSelectTag(tag)}
          isSelected={selectedTag === tag}
        />
      ))}
    </div>
  );
};

export default BlogFilter;
