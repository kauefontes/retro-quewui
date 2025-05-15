import type { Project, Experience, Skill, Post, GithubStats, ContactFormData } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Generic fetch function with error handling
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  return fetchFromApi<Project[]>('/projects');
};

export const getProjectById = async (id: string): Promise<Project> => {
  return fetchFromApi<Project>(`/projects/${id}`);
};

// Experiences
export const getExperiences = async (): Promise<Experience[]> => {
  return fetchFromApi<Experience[]>('/experiences');
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  return fetchFromApi<Skill[]>('/skills');
};

// Blog Posts
export const getPosts = async (): Promise<Post[]> => {
  return fetchFromApi<Post[]>('/posts');
};

export const getPostById = async (id: string): Promise<Post> => {
  return fetchFromApi<Post>(`/posts/${id}`);
};

// GitHub Stats
export const getGithubStats = async (): Promise<GithubStats> => {
  return fetchFromApi<GithubStats>('/github-stats');
};

// Contact Form
export const submitContactForm = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to submit contact form: ${response.statusText}`);
  }
  return response.json() as Promise<{ message: string }>;
};
