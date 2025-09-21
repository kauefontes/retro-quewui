import type {
  GitHubProfile,
  GitHubOrganization,
  GitHubRepository,
  GitHubActivityItem
} from './githubProfile';

export type {
  GitHubProfile,
  GitHubOrganization,
  GitHubRepository,
  GitHubActivityItem
};

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  imageUrls?: string[]; // Array of image URLs for project screenshots
  year: number;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null; // null means present
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string; // This might be Markdown or HTML
}

export interface GithubStats {
  username: string;
  repoCount: number;
  followers: number;
  contributions: number; // e.g., contributions in the last year
  topLanguages: { name: string; percentage: number }[]; // Top languages by repo or commit
  recentActivity: { date: string; message: string; repo: string }[]; // Recent commits or PRs
}

export interface ContactFormData {
  id?: string;
  name: string;
  email: string;
  message: string;
  date?: string;
}

// Simplified Profile interface aligned with Go backend
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;                    // Single string instead of array
  email: string;
  phone?: string;
  location: string;
  avatarUrl?: string;             // Renamed from avatar_url
  resumeUrl?: string;             // Renamed from resume_url  
  linkedinUrl?: string;           // Individual URL fields
  githubUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  availableForHire: boolean;      // Professional status
  createdAt: string;
  updatedAt: string;
}

// Legacy interfaces - to be removed gradually
export interface SocialLink {
  title: string;
  url: string;
  icon: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
}

// Additional types for admin/edit mode
export interface EditMode {
  isEditing: boolean;
  editingId: string | null;
}
