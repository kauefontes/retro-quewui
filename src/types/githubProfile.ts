// Interface TypeScript para GitHub Profile baseada na implementação do backend
export interface GitHubProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  blog?: string;
  twitterUsername?: string;
  company?: string;
  followers: number;
  following: number;
  publicRepos: number;
  publicGists: number;
  htmlUrl: string;
  createdAt: string;
  organizations: GitHubOrganization[];
  topRepositories: GitHubRepository[];
  recentActivity: GitHubActivityItem[];
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
