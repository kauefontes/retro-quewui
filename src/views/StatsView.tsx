import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getGithubStats } from '../data/api';
import type { GithubStats } from '../types/index';
import { EmptyState } from '../components/common/EmptyState/EmptyState';
import { StatCard } from '../components/common/Card';
import { PageSection } from '../components/common/PageSection';
import { PageContainer } from '../components/layout/PageContainer';
import { ContentGrid } from '../components/layout/ContentGrid';

export const StatsView = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    fetchGithubStats();
  }, []);

  return (
    <PageContainer padding="medium">
      <PageSection
        title="GitHub Stats"
        showLiveBadge={true}
        liveCondition={!loading && !error && !!stats}
        action={
          <span style={{ 
            fontSize: '0.8rem', 
            opacity: 0.7,
            fontFamily: isDebianTheme ? 'monospace' : 'inherit'
          }}>
            @{stats?.username || 'loading...'}
          </span>
        }
      >
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
          <ContentGrid columns={3} gap="medium">
            <StatCard 
              label="Repositories" 
              value={stats?.repoCount?.toString() || '0'}
            />
            <StatCard 
              label="Followers" 
              value={stats?.followers?.toString() || '0'}
            />
            <StatCard 
              label="Stars" 
              value={stats?.totalStars?.toString() || '0'}
            />
          </ContentGrid>
          
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
            
            {stats?.topLanguages?.length ? (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                padding: '0rem 1rem',
              }}>
                {stats.topLanguages.map(lang => (
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
                      {Math.round(lang.percentage)}%
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
            
            {stats?.recentActivity?.length ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '0rem 1rem',
              }}>
                {stats.recentActivity.map((activity, index) => {
                  const repoShortName = activity.repo.includes('/') ? activity.repo.split('/')[1] : activity.repo;

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
                        <span style={{ opacity: 0.7 }}>{activity.date}</span>
                      </div>
                      <p style={{ margin: 0 }}>{activity.message}</p>
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
      </PageSection>
    </PageContainer>
  );
};

