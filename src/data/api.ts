import type { Project, Experience, Skill, Post, GithubStats, ContactFormData, Profile } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Adapter for converting snake_case to camelCase for objects
const convertToCamelCase = <T>(data: any): T => {
  if (Array.isArray(data)) {
    return data.map(item => convertToCamelCase<any>(item)) as unknown as T;
  }

  if (data !== null && typeof data === 'object') {
    const camelCaseData: Record<string, any> = {};

    Object.keys(data).forEach(key => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseData[camelKey] = convertToCamelCase(data[key]);
    });

    return camelCaseData as T;
  }

  return data as T;
};

// Generic fetch function with error handling
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    // Convert snake_case from backend to camelCase for frontend
    return convertToCamelCase<T>(data);
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

// Profile
export const getProfile = async (): Promise<Profile> => {
  return fetchFromApi<Profile>('/profile');
};

// Contact Form
export const submitContactForm = async (data: ContactFormData): Promise<{ message: string }> => {
  // Convert camelCase to snake_case for the backend
  const convertToSnakeCase = (obj: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = typeof obj[key] === 'object' && obj[key] !== null
        ? convertToSnakeCase(obj[key])
        : obj[key];
    });
    return result;
  };

  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToSnakeCase(data)),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to submit contact form: ${response.statusText}`);
  }
  const responseData = await response.json();
  return convertToCamelCase<{ message: string }>(responseData);
};
