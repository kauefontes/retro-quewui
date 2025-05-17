import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { type Post, updatePost, createPost } from './utils';

interface PostFormProps {
  post?: Post;
  onSave: (updatedPost: Post) => void;
  onCancel: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  post,
  onSave,
  onCancel
}) => {
  const isEditing = !!post;
  
  const [formData, setFormData] = useState<Partial<Post>>(
    post || {
      title: '',
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      tags: [],
      excerpt: '',
      content: ''
    }
  );
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Post>) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev: Partial<Post>) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData((prev: Partial<Post>) => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.excerpt?.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      let savedPost: Post;
      
      if (isEditing && post?.id) {
        savedPost = await updatePost(post.id, formData);
      } else {
        savedPost = await createPost(formData as Omit<Post, 'id'>);
      }
      
      onSave(savedPost);
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Failed to save post: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h3>{isEditing ? 'Edit Post' : 'Create New Post'}</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          placeholder="Post title"
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: errors.title ? '1px solid red' : '1px solid #ccc',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        />
        {errors.title && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.title}</span>}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="date">Publication Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date || ''}
          onChange={handleInputChange}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            width: 'fit-content'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>Tags</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a tag..."
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              flex: 1
            }}
          />
          <button 
            type="button" 
            onClick={handleAddTag}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {(formData.tags || []).map((tag, index) => (
            <div 
              key={index} 
              style={{
                backgroundColor: 'rgba(0, 255, 217, 0.1)',
                color: 'var(--accent-color)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent-color)',
                  fontSize: '1rem',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt || ''}
          onChange={handleInputChange}
          placeholder="Short excerpt or summary (will be displayed in the list)"
          rows={3}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: errors.excerpt ? '1px solid red' : '1px solid #ccc',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            fontFamily: 'inherit'
          }}
        />
        {errors.excerpt && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.excerpt}</span>}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="content">Content (Markdown supported)</label>
        <textarea
          id="content"
          name="content"
          value={formData.content || ''}
          onChange={handleInputChange}
          placeholder="Write your post content here... Markdown is supported."
          rows={15}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: errors.content ? '1px solid red' : '1px solid #ccc',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            fontFamily: 'monospace'
          }}
        />
        {errors.content && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.content}</span>}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: 'var(--text-color)',
            border: '1px solid var(--accent-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--accent-color)',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: isSaving ? 'wait' : 'pointer',
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
