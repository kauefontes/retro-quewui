import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { githubStats as mockGithubStats } from '../data/mockData';
import { getGithubStats, getGithubProfile } from '../data/api';
import type { GithubStats, GitHubProfile } from '../types/index';
import { EmptyState } from '../components/common/EmptyState';
import { LazyImage } from '../components/common/LazyImage';
import { formatRelativeTime, formatDate } from '../utils/dateUtils';

export const StatsView = () => {
  const [stats, setStats] = useState<GithubStats>(mockGithubStats);
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
        const githubStatsData = await getGithubStats();
        setStats(githubStatsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError('Failed to load GitHub stats. Using fallback data.');
        // Usando dados mockados como fallback
        setStats(mockGithubStats);
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
    <div style={{
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      height: '100%'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        paddingBottom: '0.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          GitHub Profile
          {((!loading && !error) || (!profileLoading && !profileError)) && (
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#00AA00', 
              color: 'white',
              padding: '0.1rem 0.3rem',
              borderRadius: '0.25rem',
              fontWeight: 'normal'
            }}>live</span>
          )}
        </h2>
        <span style={{
          fontSize: '0.875rem',
          opacity: 0.7,
          fontFamily: isDebianTheme ? 'monospace' : 'inherit'
        }}>
          @{githubProfile ? githubProfile.username : stats.username}
        </span>
      </div>

      {/* GitHub Profile Section */}
      {profileLoading && !githubProfile ? (
        <EmptyState 
          title="Carregando perfil do GitHub"
          message="Aguarde enquanto carregamos os dados de perfil do GitHub..."
          isLoading={true}
        />
      ) : profileError ? (
        <EmptyState 
          title="Erro ao carregar perfil"
          message={profileError || "Ocorreu um erro ao carregar os dados de perfil do GitHub."}
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
                
                {githubProfile.twitterUsername && (
                  <a 
                    href={`https://twitter.com/${githubProfile.twitterUsername}`}
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
                    <span>🐦</span>
                    <span>@{githubProfile.twitterUsername}</span>
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
      {loading ? (
        <EmptyState 
          title="Carregando estatísticas"
          message="Aguarde enquanto carregamos as estatísticas do GitHub..."
          isLoading={true}
        />
      ) : error ? (
        <EmptyState 
          title="Erro ao carregar"
          message={error || "Ocorreu um erro ao carregar as estatísticas do GitHub."}
          isError={true}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}>
          <StatCard 
            label="Repositories" 
            value={githubProfile ? githubProfile.publicRepos.toString() : stats.repoCount.toString()} 
            isDebianTheme={isDebianTheme}
          />
          <StatCard 
            label="Followers" 
            value={githubProfile ? githubProfile.followers.toString() : stats.followers.toString()} 
            isDebianTheme={isDebianTheme}
          />
          <StatCard 
            label="Following" 
            value={githubProfile ? githubProfile.following.toString() : stats.contributions.toString()} 
            isDebianTheme={isDebianTheme}
          />
        </div>
      )}

      {/* Top Languages */}
      {!loading && !error && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
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
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {(githubProfile && githubProfile.topLanguages ? githubProfile.topLanguages : stats.topLanguages).map(lang => (
              <div 
                key={lang.name}
                style={{
                  padding: '0.5rem 0.75rem',
                  backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(0, 255, 217, 0.1)',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                  borderRadius: isDebianTheme ? '0' : '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{lang.name}</span>
                <span style={{ opacity: 0.7 }}>{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {!loading && !error && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {(githubProfile && githubProfile.recentActivity ? githubProfile.recentActivity : stats.recentActivity).map((activity, index) => {
                // Determinar quais propriedades usar com base no tipo de objeto
                const isGitHubActivity = 'repoName' in activity;
                const repoName = isGitHubActivity ? activity.repoName : activity.repo;
                const repoShortName = repoName.includes('/') ? repoName.split('/')[1] : repoName;
                const displayDate = isGitHubActivity 
                  ? (activity.date || new Date(activity.createdAt).toISOString().split('T')[0]) 
                  : activity.date;
                const message = isGitHubActivity
                  ? (activity.message || (activity.details && 'message' in activity.details ? activity.details.message : null) || `${activity.eventType} em ${repoName}`)
                  : activity.message;
              
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
                    <p style={{ margin: 0 }}>{message}</p>
                  </div>
                );
              })}
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(0, 255, 217, 0.05)',
      border: '1px solid',
      borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
      borderRadius: isDebianTheme ? '0' : '0.25rem',
      gap: '0.5rem'
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
        opacity: 0.8
      }}>
        {label}
      </div>
    </div>
  );
};