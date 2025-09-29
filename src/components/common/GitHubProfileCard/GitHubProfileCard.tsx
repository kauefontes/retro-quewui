import React from 'react';
import type { GitHubProfile } from '../../../types/index';
import { LazyImage } from '../LazyImage';
import { formatRelativeTime, formatDate } from '../../../utils/dateUtils';
import { EmptyState } from '../EmptyState/EmptyState';

interface GitHubProfileCardProps {
  githubProfile: GitHubProfile | null;
  loading: boolean;
  error: string | null;
  isDebianTheme: boolean;
  variant?: 'compact' | 'full';
  showTitle?: boolean;
  showStats?: boolean;
}

export const GitHubProfileCard: React.FC<GitHubProfileCardProps> = ({
  githubProfile,
  loading,
  error,
  isDebianTheme,
  variant = 'compact',
  showTitle = true,
  showStats = true
}) => {
  if (loading && !githubProfile) {
    return (
      <EmptyState 
        title="Loading GitHub Profile"
        message="Please wait while we load your GitHub profile data..."
        isLoading={true}
      />
    );
  }

  if (error) {
    return (
      <EmptyState 
        title="Error Loading Profile"
        message={error || "An error occurred while loading GitHub profile data."}
        isError={true}
      />
    );
  }

  if (!githubProfile) {
    return null;
  }

  const avatarSize = variant === 'compact' ? '100px' : '80px';
  const titleFontSize = variant === 'compact' ? '1.5rem' : '1.25rem';
  const padding = variant === 'compact' ? '1rem' : '1rem';

  return (
    <div>
      {/* Header with title */}
      {showTitle && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: variant === 'compact' ? '1.5rem' : '1rem',
            fontWeight: 'bold'
          }}>
            GitHub Profile
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: '#00AA00', 
              color: 'white',
              padding: '0.1rem 0.3rem',
              borderRadius: '0.25rem',
              fontWeight: 'normal'
            }}>live</span>
          </div>
          <span style={{ 
            fontSize: '0.8rem', 
            opacity: 0.7,
            fontFamily: isDebianTheme ? 'monospace' : 'inherit'
          }}>
            @{githubProfile.login}
          </span>
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding,
        backgroundColor: isDebianTheme ? '#0000B3' : 'rgba(0, 0, 0, 0.2)',
        border: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        borderRadius: isDebianTheme ? '0' : '0.25rem',
      }}>
        <div style={{
          display: 'flex',
          gap: variant === 'compact' ? '1rem' : '1rem',
          alignItems: 'flex-start'
        }}>
          <LazyImage
            src={githubProfile.avatarUrl}
            alt={`${githubProfile.name} avatar`}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}
            placeholderColor={isDebianTheme ? '#00008B' : '#1e3a5e'}
          />
          <div style={{ flex: 1, marginTop: '-0.1rem' }}>
            <h3 style={{
              fontSize: titleFontSize,
              fontWeight: 'bold',
              marginBottom: '0.25rem',
              marginTop: '0',
              lineHeight: '1.2',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}>{githubProfile.name}</h3>
            
            <div style={{
              fontSize: variant === 'compact' ? '1rem' : '0.875rem',
              color: isDebianTheme ? '#FFFFFF99' : 'var(--text-color-secondary)',
              marginBottom: '0.75rem'
            }}>@{githubProfile.login}</div>
            
            {githubProfile.bio && (
              <p style={{
                fontSize: variant === 'compact' ? '1rem' : '0.9rem',
                lineHeight: '1.5',
                margin: '0.75rem 0',
                color: isDebianTheme ? '#FFFFFFDD' : 'var(--text-color-secondary)'
              }}>{githubProfile.bio}</p>
            )}

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: variant === 'compact' ? '1rem' : '0.75rem',
              fontSize: variant === 'compact' ? '0.9rem' : '0.8rem',
              marginTop: '0.75rem'
            }}>
              {githubProfile.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    gap: '0.5rem',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                    textDecoration: 'none'
                  }}
                >
                  <span>🔗</span>
                  <span>{githubProfile.blog.replace(/^https?:\/\//, '')}</span>
                </a>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                <span>🕒</span>
                <span title={`Joined GitHub on ${formatDate(githubProfile.createdAt)}`}>
                  Joined {formatRelativeTime(githubProfile.createdAt)}
                </span>
              </div>
            </div>

            {/* Quick Stats - show for compact variant or when explicitly requested */}
            {(variant === 'compact' || showStats) && (
              <div style={{
                display: 'flex',
                gap: variant === 'compact' ? '1.5rem' : '0.75rem',
                marginTop: '1rem',
                fontSize: variant === 'compact' ? '0.9rem' : '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)' }}>
                    {githubProfile.publicRepos}
                  </span>
                  <span>repositories</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)' }}>
                    {githubProfile.followers}
                  </span>
                  <span>followers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)' }}>
                    {githubProfile.following}
                  </span>
                  <span>following</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};