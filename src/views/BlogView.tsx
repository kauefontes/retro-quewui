import { useState } from 'react';
import type { Post } from '../types/index';
import { deletePost } from '../data/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogView.css';
import { useAppStore } from '../store/appStore';
import { PostForm } from '../components/features/blog/PostForm';
import { AdminControls } from '../components/common/AdminControls';
import { AuthContent } from '../components/common/AuthContent/AuthContent';
import { usePosts } from '../hooks/usePosts';

export const BlogView = () => {
  const { 
    filteredPosts, 
    selectedPost, 
    setSelectedPost,
    selectedTag,
    setSelectedTag,
    allTags,
    loading,
    error,
    refreshPosts 
  } = usePosts();
  
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Admin state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
    
  // Admin functions
  const handleAddPost = () => {
    setIsEditing(true);
    setEditingPost(null);
    setSelectedPost(null);
  };
  
  const handleEditPost = () => {
    if (selectedPost) {
      setIsEditing(true);
      setEditingPost(selectedPost);
    }
  };
  
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    if (window.confirm(`Are you sure you want to delete the post "${selectedPost.title}"?`)) {
      try {
        await deletePost(selectedPost.id);
        setSelectedPost(null);
        refreshPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(`Failed to delete post: ${(error as Error).message}`);
      }
    }
  };
  
  const handleSavePost = (savedPost: Post) => {
    refreshPosts();
    setIsEditing(false);
    setSelectedPost(savedPost);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
  };
  
  // If editing, render the post form
  if (isEditing) {
    return (
      <div style={{ padding: '1rem' }}>
        <PostForm 
          post={editingPost || undefined}
          onSave={handleSavePost}
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
          Blog
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
        
        {/* Admin Controls */}
        <AuthContent>
          <AdminControls
            entityName="Blog Post"
            onAdd={handleAddPost}
            onEdit={selectedPost ? handleEditPost : undefined}
            onDelete={selectedPost ? handleDeletePost : undefined}
          />
        </AuthContent>
        
        {filteredPosts.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: isDebianTheme ? '0' : '0.25rem', 
                fontSize: '0.875rem',
                opacity: selectedTag === null ? '1' : '0.7',
                border: '1px solid',
                borderColor: selectedTag === null 
                  ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                  : (isDebianTheme ? '#666666' : '#103149'),
                backgroundColor: selectedTag === null 
                  ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                  : 'transparent',
                color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            
            {allTags.map(tag => (
              <button 
                key={tag}
                style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: isDebianTheme ? '0' : '0.25rem', 
                  fontSize: '0.875rem',
                  opacity: selectedTag === tag ? '1' : '0.7',
                  border: '1px solid',
                  borderColor: selectedTag === tag 
                    ? (isDebianTheme ? '#FFFFFF' : 'var(--accent-color)') 
                    : (isDebianTheme ? '#666666' : '#103149'),
                  backgroundColor: selectedTag === tag 
                    ? (isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)')
                    : 'transparent',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                }}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            width: '100%',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            Loading blog posts...
          </div>
        ) : error ? (
          <div style={{ 
            padding: '1rem', 
            color: isDebianTheme ? '#FF6666' : '#FF6666',
            borderLeft: '3px solid #FF6666',
            width: '100%'
          }}>
            {error}
          </div>
        ) : (
          <>
            {/* Blog Post List */}
            <div style={{ 
              width: selectedPost ? '33%' : '100%', 
              overflowY: 'auto', 
              paddingRight: '0.75rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredPosts.map(post => (
                  <PostCard 
                    key={post.id}
                    post={post}
                    isSelected={selectedPost?.id === post.id}
                    onClick={() => setSelectedPost(post)}
                  />
                ))}
                  
                {filteredPosts.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.7 }}>
                    No posts found for tag #{selectedTag}
                  </div>
                )}
              </div>
            </div>
            
            {/* Post Detail */}
            {selectedPost && (
              <div style={{ width: '67%', overflowY: 'auto', paddingLeft: '0.75rem' }}>
                <PostDetail 
                  post={selectedPost} 
                  onClose={() => setSelectedPost(null)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  isSelected: boolean;
  onClick: () => void;
}

const PostCard = ({ post, isSelected, onClick }: PostCardProps) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
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
      <h3 style={{ 
        fontWeight: 'bold',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>{post.title}</h3>
      <div style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: 0.7,
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>{post.date}</div>
      <p style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: 0.8,
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>{post.excerpt}</p>
      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {post.tags.map((tag, index) => (
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
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

interface PostDetailProps {
  post: Post;
  onClose: () => void;
}

const PostDetail = ({ post, onClose }: PostDetailProps) => {
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  return (
    <div style={{ 
      padding: '1rem', 
      borderLeft: '1px solid',
      borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)', 
      height: '100%',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent' 
    }}>        <div style={{ 
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
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>{post.title}</h3>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{post.date}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            aria-label="Close post"
          >
            [X]
          </button>
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
          Post Content
        </h4>
        <div className={`prose ${isDebianTheme ? 'prose-debian' : 'prose-tron'}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
