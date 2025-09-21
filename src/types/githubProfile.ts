// Interface TypeScript para GitHub Profile baseada na resposta real da API
export interface GitHubProfile {
  id: number;
  login: string;           // GitHub username
  name: string;            // Display name
  avatarUrl: string;
  bio?: string;
  location?: string;
  blog?: string;
  company?: string;
  email?: string;
  htmlUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  updatedAt: string;
  
  // These fields will be added later when backend implements them
  organizations?: GitHubOrganization[];
  topRepositories?: GitHubRepository[];
  recentActivity?: GitHubActivityItem[];
  topLanguages?: { name: string; percentage: number }[];
}

export interface GitHubOrganization {
  login: string;
  id: number;
  avatarUrl: string;
  description?: string;
  htmlUrl: string;
}

export interface GitHubRepository {
  name: string;
  fullName: string;
  htmlUrl: string;
  description?: string;
  language?: string;
  stargazersCount: number;
  forksCount: number;
  topics: string[];
  updatedAt: string;
}

export interface GitHubActivityItem {
  eventType: string;
  repoName: string;
  repoUrl: string;
  createdAt: string;
  date?: string;
  message?: string;
  details: Record<string, unknown>;
}
