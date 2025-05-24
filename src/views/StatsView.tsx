import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getGithubStats, getGithubProfile } from '../data/api';
import type { GithubStats, GitHubProfile } from '../types/index';
import { EmptyState } from '../components/common/EmptyState/EmptyState';
import { LazyImage } from '../components/common/LazyImage';
import { formatRelativeTime, formatDate } from '../utils/dateUtils';

export const StatsView = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  useEffect(() => {
    const fetchGithubStats = async () => {
      try {
        setLoading(true);
        const statsData = await getGithubStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError('Failed to load GitHub stats. Please try again later.');
        // We don't use mock data, keep it as null
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchGithubProfile = async (retryCount = 0, maxRetries = 3) => {
        try {
          setProfileLoading(true);
          const profileData = await getGithubProfile();
          setGithubProfile(profileData);
          setProfileError(null);
          setProfileLoading(false);

          // Log successful fetch
          console.log(`GitHub profile data loaded successfully at ${new Date().toLocaleTimeString()}`);
        } catch (err) {
          console.error('Error fetching GitHub profile:', err);

          // Log more detailed error information for debugging
          if (err instanceof Error) {
            console.error(`GitHub profile error details: ${err.message}`);
          }

          // Retry logic with exponential backoff
          if (retryCount < maxRetries) {
            const backoffDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, ...
            console.log(`Retrying GitHub profile fetch in ${backoffDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);

            setTimeout(() => {
              fetchGithubProfile(retryCount + 1, maxRetries);
            }, backoffDelay);

            // Don't set error message during retry attempts
            return;
          }

          // Only set error message after all retries have failed
          setProfileError('Failed to load GitHub profile data. Please check your connection or try again later.');
          setProfileLoading(false);
        }
      };

    fetchGithubStats();
    fetchGithubProfile();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem' 
        }}>
          GitHub Profile
          {((!loading && !error && stats) || (!profileLoading && !profileError && githubProfile)) && (
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#00AA00', 
              color: 'white',
              padding: '0.1rem 0.3rem',
              borderRadius: '0.25rem',
              fontWeight: 'normal'
            }}>live</span>
          )}
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          opacity: 0.7,
          fontFamily: isDebianTheme ? 'monospace' : 'inherit'
        }}>
          @{githubProfile ? githubProfile.username : stats?.username || 'loading...'}
        </span>
      </div>

      {/* GitHub Profile Section */}
      {profileLoading && !githubProfile ? (
        <EmptyState 
          title="Loading GitHub Profile"
          message="Please wait while we load your GitHub profile data..."
          isLoading={true}
        />
      ) : profileError ? (
        <EmptyState 
          title="Error Loading Profile"
          message={profileError || "An error occurred while loading GitHub profile data."}
          isError={true}
        />
      ) : githubProfile && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(0, 0, 0, 0.2)',
          border: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          borderRadius: isDebianTheme ? '0' : '0.25rem',
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <LazyImage
              src={githubProfile.avatarUrl}
              alt={`${githubProfile.displayName} avatar`}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
              }}
              placeholderColor={isDebianTheme ? '#00008B' : '#1e3a5e'}
            />
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>{githubProfile.displayName}</h3>
              <div style={{
                fontSize: '0.875rem',
                color: isDebianTheme ? '#FFFFFF99' : 'var(--text-color-secondary)',
                marginBottom: '0.5rem'
              }}>@{githubProfile.username}</div>
              {githubProfile.bio && (
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  margin: '0.5rem 0',
                  color: isDebianTheme ? '#FFFFFFDD' : 'var(--text-color-secondary)'
                }}>{githubProfile.bio}</p>
              )}

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.8rem',
                marginTop: '0.5rem'
              }}>
                {githubProfile.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>📍</span>
                    <span>{githubProfile.location}</span>
                  </div>
                )}

                {githubProfile.blog && (
                  <a
                    href={githubProfile.blog.startsWith('http') ? githubProfile.blog : `https://${githubProfile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>🔗</span>
                    <span>{githubProfile.blog.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.8 }}>
                  <span>🕒</span>
                  <span title={`Joined GitHub on ${formatDate(githubProfile.createdAt)}`}>
                    Joined {formatRelativeTime(githubProfile.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats */}
      {loading || !stats ? (
        <EmptyState 
          title="Loading statistics"
          message="Please wait while we load GitHub statistics..."
          isLoading={true}
        />
      ) : error ? (
        <EmptyState 
          title="Error loading"
          message={error || "An error occurred while loading GitHub statistics."}
          isError={true}
        />
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between'
          }}>
            <StatCard 
              label="Repositories" 
              value={githubProfile ? githubProfile.publicRepos.toString() : stats?.repoCount?.toString() || '0'}
              isDebianTheme={isDebianTheme}
            />
            <StatCard 
              label="Followers" 
              value={githubProfile ? githubProfile.followers.toString() : stats?.followers?.toString() || '0'}
              isDebianTheme={isDebianTheme}
            />
            <StatCard 
              label="Following" 
              value={githubProfile ? githubProfile.following.toString() : stats?.contributions?.toString() || '0'}
              isDebianTheme={isDebianTheme}
            />
          </div>
          
          {/* Languages Section */}
          <div style={{
            marginTop: '1rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              opacity: 0.9,
              borderBottom: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : '#103149',
              paddingBottom: '0.25rem'
            }}>
              Top Languages
            </h3>
            
            {(githubProfile?.topLanguages?.length || stats?.topLanguages?.length) ? (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {(githubProfile && githubProfile.topLanguages ? githubProfile.topLanguages : stats?.topLanguages || []).map(lang => (
                  <div 
                    key={lang.name}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(16, 49, 73, 0.5)',
                      border: '1px solid',
                      borderColor: isDebianTheme ? '#666666' : '#103149',
                      borderRadius: isDebianTheme ? '0' : '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ 
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                    }}>
                      {lang.name}
                    </span>
                    <div style={{
                      backgroundColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                      borderRadius: '0.25rem',
                      padding: '0.1rem 0.3rem',
                      fontSize: '0.75rem',
                      color: isDebianTheme ? '#0000B3' : '#000000',
                      fontWeight: 'bold'
                    }}>
                      {lang.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No language data"
                message="No language usage statistics available yet."
                icon="💻"
              />
            )}
          </div>
          
          {/* Recent Activity Section */}
          <div style={{
            marginTop: '2rem'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              opacity: 0.9,
              borderBottom: '1px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : '#103149',
              paddingBottom: '0.25rem'
            }}>
              Recent Activity
            </h3>
            
            {(githubProfile?.recentActivity?.length || stats?.recentActivity?.length) ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {(githubProfile && githubProfile.recentActivity ? githubProfile.recentActivity : stats?.recentActivity || []).map((activity, index) => {
                  // Determine which properties to use based on the object type
                  const isGitHubActivity = 'repoName' in activity;
                  const repoName = isGitHubActivity ? activity.repoName : activity.repo;
                  const repoShortName = repoName.includes('/') ? repoName.split('/')[1] : repoName;
                  const displayDate = isGitHubActivity
                    ? (activity.date || new Date(activity.createdAt).toISOString().split('T')[0])
                    : activity.date;
                  
                  // Ensure message is always a string
                  let messageText = '';
                  if (isGitHubActivity) {
                    if (activity.message) {
                      messageText = activity.message;
                    } else if (activity.details && typeof activity.details === 'object' && 'message' in activity.details) {
                      messageText = String(activity.details.message || '');
                    } else {
                      messageText = `${activity.eventType} in ${repoName}`;
                    }
                  } else {
                    messageText = activity.message || '';
                  }

                  return (
                    <div
                      key={index}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(16, 49, 73, 0.5)',
                        border: '1px solid',
                        borderColor: isDebianTheme ? '#666666' : '#103149',
                        borderLeft: '3px solid',
                        borderLeftColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem'
                      }}>
                        <span style={{ fontWeight: 'bold' }}>{repoShortName}</span>
                        <span style={{ opacity: 0.7 }}>{displayDate}</span>
                      </div>
                      <p style={{ margin: 0 }}>{messageText}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No activity data"
                message="No recent GitHub activity available yet."
                icon="📅"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  isDebianTheme: boolean;
}

const StatCard = ({ label, value, isDebianTheme }: StatCardProps) => {
  return (
    <div style={{
      backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(16, 49, 73, 0.5)',
      padding: '0.75rem',
      borderRadius: isDebianTheme ? '0' : '0.25rem',
      border: '1px solid',
      borderColor: isDebianTheme ? '#666666' : '#103149',
      textAlign: 'center',
      flex: 1
    }}>
      <div style={{ 
        fontSize: '1.75rem', 
        fontWeight: 'bold',
        color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: '0.875rem', 
        opacity: 0.7,
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {label}
      </div>
    </div>
  );
};