import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getGithubProfile } from '../src/data/api';
import { apiCache } from '../src/utils/apiCache';

// Mock fetch
global.fetch = vi.fn();

describe('GitHub Profile API', () => {
  const mockProfile = {
    username: 'testuser',
    displayName: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
    htmlUrl: 'https://github.com/testuser',
    followers: 100,
    following: 50,
    publicRepos: 20,
    organizations: [],
    topRepositories: [],
    recentActivity: []
  };

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    
    // Clear cache
    apiCache.clearAll();
    
    // Setup fetch mock to return successful response
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        username: 'testuser',
        display_name: 'Test User',
        avatar_url: 'https://example.com/avatar.png',
        html_url: 'https://github.com/testuser',
        followers: 100,
        following: 50,
        public_repos: 20,
        organizations: [],
        top_repositories: [],
        recent_activity: []
      })
    });
  });

  afterEach(() => {
    // Restore the original implementation
    vi.restoreAllMocks();
  });

  it('fetches GitHub profile data successfully', async () => {
    const profile = await getGithubProfile();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8081/github/profile');
    
    // Verify response is processed correctly
    expect(profile.username).toBe(mockProfile.username);
    expect(profile.displayName).toBe(mockProfile.displayName);
    expect(profile.avatarUrl).toBe(mockProfile.avatarUrl);
    expect(profile.htmlUrl).toBe(mockProfile.htmlUrl);
  });

  it('uses cache for subsequent calls', async () => {
    // First call should hit the API
    await getGithubProfile();
    expect(fetch).toHaveBeenCalledTimes(1);
    
    // Second call should use cache
    await getGithubProfile();
    expect(fetch).toHaveBeenCalledTimes(1); // Still 1, not 2
  });

  it('handles API errors gracefully', async () => {
    // Setup fetch to return an error
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    await expect(getGithubProfile()).rejects.toThrow('API error: 500');
  });
});
