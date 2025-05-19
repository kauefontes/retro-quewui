import { useState } from 'react';
import type { Post } from '../types/index';
import { deletePost } from '../data/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogView.css';
import { useAppStore } from '../store/appStore';
import { PostForm } from '../components/features/blog/PostForm';
import { BlogFilter } from '../components/features/blog/BlogFilter';
import { FloatingActionButton } from '../components/common/FloatingActionButton';
import { DetailActionButtons } from '../components/common/DetailActionButtons';
import { ListDetailLayout } from '../components/common/ListDetailLayout';
import { TechTag } from '../components/common/TechTag';
import { EmptyState, EmptyProjectState } from '../components/common/EmptyState';
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
  
  const postsList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {loading ? (
        <EmptyState 
          title="Carregando posts"
          message="Aguarde enquanto carregamos os posts do blog..."
          isLoading={true}
        />
      ) : error ? (
        <EmptyState 
          title="Erro ao carregar"
          message={error || "Ocorreu um erro ao carregar os posts. Tente novamente mais tarde."}
          isError={true}
        />
      ) : filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <PostCard 
            key={post.id}
            post={post}
            isSelected={selectedPost?.id === post.id}
            onClick={() => setSelectedPost(post)}
          />
        ))
      ) : selectedTag ? (
        <EmptyProjectState
          type="blog"
          isFiltered={true}
          filterName={selectedTag}
          onClearFilter={() => setSelectedTag(null)}
        />
      ) : (
        <EmptyProjectState
          type="blog"
          isFiltered={false}
        />
      )}
    </div>
  );
  
  const postDetail = selectedPost && (
    <PostDetail 
      post={selectedPost} 
      onClose={() => setSelectedPost(null)} 
      onEdit={handleEditPost}
      onDelete={handleDeletePost}
    />
  );
  
  const titleAction = !loading && !error && (
    <span style={{ 
      fontSize: '0.75rem', 
      backgroundColor: '#00AA00', 
      color: 'white',
      padding: '0.1rem 0.3rem',
      borderRadius: '0.25rem',
      fontWeight: 'normal'
    }}>live</span>
  );
  
  const tagsFilter = filteredPosts.length > 0 && (
    <BlogFilter
      tags={allTags}
      selectedTag={selectedTag}
      onSelectTag={setSelectedTag}
    />
  );
  
  const actionButton = (
    <FloatingActionButton
      onClick={handleAddPost}
      ariaLabel="Add new blog post"
      label="[New]"
    />
  );
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {tagsFilter}
      
      <ListDetailLayout
        title="Blog"
        titleAction={titleAction}
        loading={loading}
        error={error}
        listContent={postsList}
        detailContent={postDetail}
        hasSelectedItem={!!selectedPost}
        loadingMessage="Loading blog posts..."
        emptyMessage="No posts found"
        actionButton={actionButton}
      />
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
          <TechTag
            key={index}
            label={`#${tag}`}
            size="medium"
          />
        ))}
      </div>
    </div>
  );
};

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PostDetail = ({ post, onClose, onEdit, onDelete }: PostDetailProps) => {
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
        <DetailActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={onClose}
        />
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
