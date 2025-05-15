import { useState } from 'react';
import { posts } from '../data/mockData';
import type { Post } from '../data/mockData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogView.css';
import { useAppStore } from '../store/appStore';

export const BlogView = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  // Extract unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  // Filter posts based on selected tag
  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;
  
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
        }}>Blog</h2>
        
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
              #{tag}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
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
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>{post.title}</h3>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{post.date}</div>
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
          aria-label="Close post"
        >
          [X]
        </button>
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
