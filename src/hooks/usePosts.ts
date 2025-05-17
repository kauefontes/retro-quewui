import { useState, useEffect, useCallback } from 'react';
import type { Post } from '../types/index';
import { getPosts } from '../data/api';
import { posts as mockPosts } from '../data/mockData';

/**
 * Custom hook for managing posts data
 * Handles fetching, filtering, and selecting posts
 */
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts data
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
      setFilteredPosts(postsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Using fallback data.');
      // Fallback to mock data
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts when selected tag changes
  useEffect(() => {
    if (selectedTag && posts.length > 0) {
      const filtered = posts.filter(post => post.tags.includes(selectedTag));
      setFilteredPosts(filtered);

      // If we have filtered posts and no post is selected, select the first one
      if (filtered.length > 0 && !selectedPost) {
        setSelectedPost(filtered[0]);
      }
    } else {
      setFilteredPosts(posts);

      // If we have posts and no post is selected, select the first one
      if (posts.length > 0 && !selectedPost) {
        setSelectedPost(posts[0]);
      }
    }
  }, [selectedTag, posts, selectedPost]);

  // Get all unique tags from posts
  const allTags = posts.length > 0
    ? Array.from(new Set(posts.flatMap(post => post.tags))).sort()
    : [];

  // Select a post by ID
  const selectPostById = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setSelectedPost(post);
    }
  };

  return {
    posts,
    filteredPosts,
    selectedPost,
    setSelectedPost,
    selectPostById,
    selectedTag,
    setSelectedTag,
    allTags,
    loading,
    error,
    refreshPosts: fetchPosts,
    setPosts
  };
};

export default usePosts;
