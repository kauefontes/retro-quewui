import type { Project, Experience, Skill, Post, GithubStats, ContactFormData, Profile, User, GitHubProfile } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Define generic type for object records
type JsonObject = Record<string, unknown>;

// Adapter for converting snake_case to camelCase for objects
const convertToCamelCase = <T>(data: unknown): T => {
  if (Array.isArray(data)) {
    return data.map(item => convertToCamelCase<unknown>(item)) as unknown as T;
  }

  if (data !== null && typeof data === 'object') {
    const camelCaseData: JsonObject = {};

    Object.keys(data as JsonObject).forEach(key => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseData[camelKey] = convertToCamelCase((data as JsonObject)[key]);
    });

    return camelCaseData as unknown as T;
  }

  return data as T;
};

// Convert camelCase to snake_case for the backend
const convertToSnakeCase = (obj: JsonObject | unknown): JsonObject | unknown => {
  // Handle arrays separately to preserve them
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        return convertToSnakeCase(item);
      }
      return item;
    });
  }

  // Handle objects
  if (typeof obj === 'object' && obj !== null) {
    const result: JsonObject = {};
    Object.keys(obj as JsonObject).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = convertToSnakeCase((obj as JsonObject)[key]);
    });
    return result;
  }

  // Return primitives as is
  return obj;
};

// Generic fetch function with error handling
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`);

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

// Authentication
export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to login: ${response.statusText}`);
  }

  const responseData = await response.json();
  return convertToCamelCase<{ token: string; user: User }>(responseData);
};

// Helper for authenticated requests
const authenticatedRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: JsonObject
): Promise<T> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Authentication required');
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(convertToSnakeCase(data));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, options);

  if (!response.ok) {
    if (response.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }

    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // For DELETE requests that don't return content
  if (method === 'DELETE' && response.status === 204) {
    return {} as T;
  }

  const responseData = await response.json();
  return convertToCamelCase<T>(responseData);
};

// Import our cache utility
import { apiCache } from '../utils/apiCache';

// Set cache TTL for different types of data
// These are reasonable values that balance freshness and performance
apiCache.setTTL(300000); // 5 minutes default TTL

// Projects
export const getProjects = async (): Promise<Project[]> => {
  return apiCache.getOrFetch<Project[]>('/projects', () =>
    fetchFromApi<Project[]>('/projects')
  );
};

export const getProjectById = async (id: string): Promise<Project> => {
  return apiCache.getOrFetch<Project>(`/projects/${id}`, () =>
    fetchFromApi<Project>(`/projects/${id}`)
  );
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const result = await authenticatedRequest<Project>('/projects', 'POST', project as unknown as JsonObject);
  // Invalidate cache after create
  apiCache.clear('/projects');
  return result;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  const result = await authenticatedRequest<Project>(`/projects/${id}`, 'PUT', project as unknown as JsonObject);
  // Invalidate cache after update
  apiCache.clear('/projects');
  apiCache.clear(`/projects/${id}`);
  return result;
};

export const deleteProject = async (id: string): Promise<void> => {
  const result = await authenticatedRequest<void>(`/projects/${id}`, 'DELETE');
  // Invalidate cache after delete
  apiCache.clear('/projects');
  apiCache.clear(`/projects/${id}`);
  return result;
};

// Experiences
export const getExperiences = async (): Promise<Experience[]> => {
  return apiCache.getOrFetch<Experience[]>('/experiences', () =>
    fetchFromApi<Experience[]>('/experiences')
  );
};

export const getExperienceById = async (id: string): Promise<Experience> => {
  return apiCache.getOrFetch<Experience>(`/experiences/${id}`, () =>
    fetchFromApi<Experience>(`/experiences/${id}`)
  );
};

export const createExperience = async (experience: Omit<Experience, 'id'>): Promise<Experience> => {
  const result = await authenticatedRequest<Experience>('/experiences', 'POST', experience as unknown as JsonObject);
  // Invalidate cache after create
  apiCache.clear('/experiences');
  return result;
};

export const updateExperience = async (id: string, experience: Partial<Experience>): Promise<Experience> => {
  const result = await authenticatedRequest<Experience>(`/experiences/${id}`, 'PUT', experience as unknown as JsonObject);
  // Invalidate cache after update
  apiCache.clear('/experiences');
  apiCache.clear(`/experiences/${id}`);
  return result;
};

export const deleteExperience = async (id: string): Promise<void> => {
  const result = await authenticatedRequest<void>(`/experiences/${id}`, 'DELETE');
  // Invalidate cache after delete
  apiCache.clear('/experiences');
  apiCache.clear(`/experiences/${id}`);
  return result;
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiCache.getOrFetch<{skills: any[], count: number}>('/skills', () =>
    fetchFromApi<{skills: any[], count: number}>('/skills')
  );
  
  // Transform API response to frontend format
  const skillsByCategory: Record<string, string[]> = {};
  
  response.skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });
  
  // Convert to expected format
  return Object.entries(skillsByCategory).map(([category, items]) => ({
    category,
    items
  }));
};

export const updateSkill = async (category: string, skill: Partial<Skill>): Promise<Skill> => {
  return authenticatedRequest<Skill>(`/skills/${category}`, 'PUT', skill as unknown as JsonObject);
};

// Blog Posts
export const getPosts = async (): Promise<Post[]> => {
  return apiCache.getOrFetch<Post[]>('/posts', () =>
    fetchFromApi<Post[]>('/posts')
  );
};

export const getPostById = async (id: string): Promise<Post> => {
  return apiCache.getOrFetch<Post>(`/posts/${id}`, () =>
    fetchFromApi<Post>(`/posts/${id}`)
  );
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const result = await authenticatedRequest<Post>('/posts', 'POST', post as unknown as JsonObject);
  // Invalidate cache after create
  apiCache.clear('/posts');
  return result;
};

export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
  const result = await authenticatedRequest<Post>(`/posts/${id}`, 'PUT', post as unknown as JsonObject);
  // Invalidate cache after update
  apiCache.clear('/posts');
  apiCache.clear(`/posts/${id}`);
  return result;
};

export const deletePost = async (id: string): Promise<void> => {
  const result = await authenticatedRequest<void>(`/posts/${id}`, 'DELETE');
  // Invalidate cache after delete
  apiCache.clear('/posts');
  apiCache.clear(`/posts/${id}`);
  return result;
};

// GitHub Stats
export const getGithubStats = async (): Promise<GithubStats> => {
  return apiCache.getOrFetch<GithubStats>('/github/stats', async () => {
    const rawData = await fetchFromApi<any>('/github/stats');
    
    // Parse top_languages if it's a JSON string
    if (rawData.topLanguages && typeof rawData.topLanguages === 'string') {
      try {
        const parsedLanguages = JSON.parse(rawData.topLanguages);
        // Extract the top_languages array from the parsed JSON
        rawData.topLanguages = parsedLanguages.top_languages || [];
      } catch (error) {
        console.error('Error parsing top_languages JSON:', error);
        rawData.topLanguages = [];
      }
    }
    
    // Parse recent_activity if it's a JSON string
    if (rawData.recentActivity && typeof rawData.recentActivity === 'string') {
      try {
        const parsedActivity = JSON.parse(rawData.recentActivity);
        // Transform the activity data to match expected format
        rawData.recentActivity = parsedActivity.map((activity: any) => ({
          date: new Date(activity.created_at).toISOString().split('T')[0],
          message: `${activity.action} ${activity.repo}`,
          repo: activity.repo
        }));
      } catch (error) {
        console.error('Error parsing recent_activity JSON:', error);
        rawData.recentActivity = [];
      }
    }
    
    return rawData as GithubStats;
  });
};

// GitHub Profile - fetches data from the backend
export const getGithubProfile = async (): Promise<GitHubProfile> => {
  const username = import.meta.env.VITE_GITHUB_USERNAME || 'quewui';
  return apiCache.getOrFetch<GitHubProfile>(`/github/profile/${username}`, () =>
    fetchFromApi<GitHubProfile>(`/github/profile/${username}`)
  );
};

// Profile
export const getProfile = async (): Promise<Profile> => {
  return apiCache.getOrFetch<Profile>('/profile', () =>
    fetchFromApi<Profile>('/profile')
  );
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  return authenticatedRequest<Profile>('/profile', 'PUT', profile as unknown as JsonObject);
};

// Contact Form
export const submitContactForm = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(convertToSnakeCase(data as unknown as JsonObject)),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to submit contact form: ${response.statusText}`);
  }
  const responseData = await response.json();
  return convertToCamelCase<{ message: string }>(responseData);
};

// Contact Messages (Admin only)
export const getContactMessages = async (): Promise<ContactFormData[]> => {
  return authenticatedRequest<ContactFormData[]>('/admin/messages', 'GET');
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  return authenticatedRequest<void>(`/admin/messages/${id}`, 'DELETE');
};
