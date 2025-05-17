import type { Project, Experience, Skill, Post, GithubStats, ContactFormData, Profile, User } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
const convertToSnakeCase = (obj: JsonObject): JsonObject => {
  const result: JsonObject = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = typeof obj[key] === 'object' && obj[key] !== null
      ? convertToSnakeCase(obj[key] as JsonObject)
      : obj[key];
  });
  return result;
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

// Authentication
export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

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

// Projects
export const getProjects = async (): Promise<Project[]> => {
  return fetchFromApi<Project[]>('/projects');
};

export const getProjectById = async (id: string): Promise<Project> => {
  return fetchFromApi<Project>(`/projects/${id}`);
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  return authenticatedRequest<Project>('/projects', 'POST', project as unknown as JsonObject);
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  return authenticatedRequest<Project>(`/projects/${id}`, 'PUT', project as unknown as JsonObject);
};

export const deleteProject = async (id: string): Promise<void> => {
  return authenticatedRequest<void>(`/projects/${id}`, 'DELETE');
};

// Experiences
export const getExperiences = async (): Promise<Experience[]> => {
  return fetchFromApi<Experience[]>('/experiences');
};

export const getExperienceById = async (id: string): Promise<Experience> => {
  return fetchFromApi<Experience>(`/experiences/${id}`);
};

export const createExperience = async (experience: Omit<Experience, 'id'>): Promise<Experience> => {
  return authenticatedRequest<Experience>('/experiences', 'POST', experience as unknown as JsonObject);
};

export const updateExperience = async (id: string, experience: Partial<Experience>): Promise<Experience> => {
  return authenticatedRequest<Experience>(`/experiences/${id}`, 'PUT', experience as unknown as JsonObject);
};

export const deleteExperience = async (id: string): Promise<void> => {
  return authenticatedRequest<void>(`/experiences/${id}`, 'DELETE');
};

// Skills
export const getSkills = async (): Promise<Skill[]> => {
  return fetchFromApi<Skill[]>('/skills');
};

export const updateSkill = async (category: string, skill: Partial<Skill>): Promise<Skill> => {
  return authenticatedRequest<Skill>(`/skills/${category}`, 'PUT', skill as unknown as JsonObject);
};

// Blog Posts
export const getPosts = async (): Promise<Post[]> => {
  return fetchFromApi<Post[]>('/posts');
};

export const getPostById = async (id: string): Promise<Post> => {
  return fetchFromApi<Post>(`/posts/${id}`);
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  return authenticatedRequest<Post>('/posts', 'POST', post as unknown as JsonObject);
};

export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
  return authenticatedRequest<Post>(`/posts/${id}`, 'PUT', post as unknown as JsonObject);
};

export const deletePost = async (id: string): Promise<void> => {
  return authenticatedRequest<void>(`/posts/${id}`, 'DELETE');
};

// GitHub Stats
export const getGithubStats = async (): Promise<GithubStats> => {
  return fetchFromApi<GithubStats>('/github-stats');
};

// Profile
export const getProfile = async (): Promise<Profile> => {
  return fetchFromApi<Profile>('/profile');
};

export const updateProfile = async (profile: Partial<Profile>): Promise<Profile> => {
  return authenticatedRequest<Profile>('/profile', 'PUT', profile as unknown as JsonObject);
};

// Contact Form
export const submitContactForm = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/contact`, {
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
