import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { githubStats as mockGithubStats } from '../data/mockData';
import { getGithubStats } from '../data/api';
import type { GithubStats } from '../types/index';

export const StatsView = () => {
  const [stats, setStats] = useState<GithubStats>(mockGithubStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    fetchGithubStats();
  }, []);

  return (
    <div style={{
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      height: '100%',
      overflow: 'auto'
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
          GitHub Stats
          {!loading && !error && (
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
          @{stats.username}
        </span>
      </div>

      {/* Key Stats */}
      {loading ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          Loading GitHub stats...
        </div>
      ) : error ? (
        <div style={{ 
          padding: '1rem', 
          color: isDebianTheme ? '#FF6666' : '#FF6666',
          borderLeft: '3px solid #FF6666'
        }}>
          {error}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}>
          <StatCard 
            label="Repositories" 
            value={stats.repoCount.toString()} 
            isDebianTheme={isDebianTheme}
          />
          <StatCard 
            label="Followers" 
            value={stats.followers.toString()} 
            isDebianTheme={isDebianTheme}
          />
          <StatCard 
            label="Contributions" 
            value={stats.contributions.toString()} 
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
            {stats.topLanguages.map(lang => (
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
            gap: '0.75rem',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {stats.recentActivity.map((activity, index) => (
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
                  <span style={{ fontWeight: 'bold' }}>{activity.repo}</span>
                  <span style={{ opacity: 0.7 }}>{activity.date}</span>
                </div>
                <p style={{ margin: 0 }}>{activity.message}</p>
              </div>
            ))}
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