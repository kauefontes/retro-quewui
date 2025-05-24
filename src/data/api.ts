import type { Project, Experience, Skill, Post, GithubStats, ContactFormData, Profile, User, GitHubProfile } from '../types/index';

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
  return apiCache.getOrFetch<Skill[]>('/skills', () =>
    fetchFromApi<Skill[]>('/skills')
  );
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
  return apiCache.getOrFetch<GithubStats>('/github-stats', () =>
    fetchFromApi<GithubStats>('/github-stats')
  );
};

// GitHub Profile - construído a partir dos dados reais do GitHub
export const getGithubProfile = async (): Promise<GitHubProfile> => {
  // Buscar dados diretamente da API pública do GitHub
  try {
    const username = import.meta.env.VITE_GITHUB_USERNAME || 'username'; // Usar variável de ambiente
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const userData = await response.json();
    
    // Buscar repositórios para construir estatísticas de linguagem
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const repos = await reposResponse.json();
    
    // Calcular estatísticas de linguagens dos repositórios
    const languageCounts: {[key: string]: number} = {};
    let totalReposWithLanguage = 0;
    
    // Contar repositórios por linguagem
    repos.forEach((repo: any) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        totalReposWithLanguage++;
      }
    });
    
    // Converter contagens em percentuais
    const topLanguages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalReposWithLanguage) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5); // Pegar as 5 linguagens principais
    
    // Buscar atividades recentes
    const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=10`);
    const events = await eventsResponse.json();
    
    // Formatar atividades recentes para exibição
    const formattedActivities = events
      .filter((event: any) => {
        // Filtrar apenas tipos de eventos relevantes
        return ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type);
      })
      .slice(0, 5)
      .map((event: any) => {
        // Formatar mensagem com base no tipo de evento
        let message = '';
        if (event.type === 'PushEvent' && event.payload.commits && event.payload.commits.length > 0) {
          message = event.payload.commits[0].message;
        } else if (event.type === 'CreateEvent') {
          message = `Created ${event.payload.ref_type}${event.payload.ref ? ` "${event.payload.ref}"` : ''}`;
        } else if (event.type === 'PullRequestEvent') {
          message = `${event.payload.action} pull request #${event.payload.number}${event.payload.pull_request?.title ? `: ${event.payload.pull_request.title}` : ''}`;
        }
        
        // Formatar data para exibição amigável
        const date = new Date(event.created_at);
        const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        return {
          eventType: event.type,
          repoName: event.repo.name,
          repoUrl: `https://github.com/${event.repo.name}`,
          createdAt: event.created_at,
          date: formattedDate,
          details: event.payload || {},
          message: message || `${event.type} em ${event.repo.name.split('/')[1]}`
        };
      });
    
    // Criar um objeto GitHubProfile a partir dos dados reais do GitHub
    const profile: GitHubProfile = {
      username: userData.login,
      displayName: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      location: userData.location,
      blog: userData.blog,
      twitterUsername: userData.twitter_username,
      company: userData.company,
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      publicGists: userData.public_gists,
      htmlUrl: userData.html_url,
      createdAt: userData.created_at,
      organizations: [],
      topRepositories: repos.slice(0, 10).map((repo: any) => ({
        name: repo.name,
        fullName: repo.full_name,
        htmlUrl: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        topics: repo.topics || [],
        updatedAt: repo.updated_at
      })),
      recentActivity: formattedActivities,
      topLanguages: topLanguages // Adicionar as principais linguagens ao perfil
    };
    
    return profile;
  } catch (error) {
    console.warn('Failed to fetch from GitHub API, using stats as fallback', error);
    
    // Fallback para o método anterior usando stats
    const stats = await getGithubStats();
    
    const profile: GitHubProfile = {
      username: stats.username,
      displayName: stats.username,
      avatarUrl: 'https://github.com/' + stats.username + '.png',
      followers: stats.followers,
      following: 0,
      publicRepos: stats.repoCount,
      publicGists: 0,
      htmlUrl: 'https://github.com/' + stats.username,
      createdAt: new Date().toISOString(),
      organizations: [],
      topRepositories: [],
      recentActivity: stats.recentActivity.map(activity => ({
        eventType: 'PushEvent',
        repoName: activity.repo,
        repoUrl: 'https://github.com/' + activity.repo,
        createdAt: activity.date,
        date: activity.date,
        details: { message: activity.message },
        message: activity.message
      })),
      topLanguages: stats.topLanguages
    };
    
    return profile;
  }
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
