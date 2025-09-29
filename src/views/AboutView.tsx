import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getTools, getProfile, getGithubProfile } from '../data/api';
import type { Tool, Profile, GitHubProfile } from '../types/index';
import { TechTag } from '../components/common/TechTag';
import { EmptyState } from '../components/common/EmptyState/EmptyState';
import { GitHubProfileCard } from '../components/common/GitHubProfileCard';
import { PageContainer } from '../components/layout/PageContainer';
import { TwoColumnLayout } from '../components/layout/TwoColumnLayout';
import { PageSection } from '../components/common/PageSection';

// About View Component - Simplified for Go backend
export const AboutView = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const toolsData = await getTools();
        setTools(toolsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching tools:', err);
        setError('Failed to load toolbox data. Please try again later.');
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
        setProfileError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfileError('Failed to load profile data.');
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchGithubProfile = async () => {
      try {
        setGithubLoading(true);
        const githubData = await getGithubProfile();
        setGithubProfile(githubData);
        setGithubError(null);
      } catch (err) {
        console.error('Error fetching GitHub profile:', err);
        setGithubError('Failed to load GitHub profile data.');
      } finally {
        setGithubLoading(false);
      }
    };

    fetchTools();
    fetchProfile();
    fetchGithubProfile();
  }, []);



  return (
    <PageContainer padding="small">
      {/* GitHub Profile Section - Top */}
      <section style={{ marginBottom: '2rem' }}>
        <GitHubProfileCard
          githubProfile={githubProfile}
          loading={githubLoading}
          error={githubError}
          isDebianTheme={isDebianTheme}
          variant="compact"
          showTitle={false}
          showStats={true}
        />
      </section>

      <TwoColumnLayout
        leftColumn={
          <PageSection 
            title="My Toolbox" 
            showLiveBadge={!loading && !error}
          >
            {loading ? (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                Loading toolbox...
              </div>
            ) : error ? (
              <EmptyState
                title="Unable to load toolbox"
                message={error}
                isError={true}
              />
            ) : tools.length === 0 ? (
              <EmptyState
                title="No tools data"
                message="Toolbox information is not available at the moment."
              />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginTop: '1rem'
              }}>
                {tools.map((toolCategory) => (
                  <div
                    key={toolCategory.category}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,0,0.05)',
                      borderRadius: '0.5rem',
                      borderLeft: '3px solid',
                      borderLeftColor: isDebianTheme ? '#00FF00' : 'var(--accent-color)'
                    }}
                  >
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      marginTop: '0',
                      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                    }}>
                      {toolCategory.category}
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {toolCategory.items.map((skill) => (
                        <TechTag
                          key={skill}
                          label={skill}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PageSection>
        }
        rightColumn={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Bio section */}
          {profile && (
            <section>
              <h3 style={{ 
                fontSize: '1.125rem',
                fontWeight: 'bold', 
                marginBottom: '1rem',
                paddingBottom: '0.25rem',
                borderBottom: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                About Me
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: '#00AA00', 
                  color: 'white',
                  padding: '0.1rem 0.3rem',
                  borderRadius: '0.25rem',
                  fontWeight: 'normal'
                }}>live</span>
              </h3>
              
              <div style={{ 
                padding: '1rem',
                backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,0,0.05)',
                borderRadius: '0.5rem',
                borderLeft: '4px solid',
                borderLeftColor: isDebianTheme ? '#00FF00' : 'var(--accent-color)'
              }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem'
                }}>
                  {profile.title}
                </div>
                <p style={{ 
                  lineHeight: '1.6',
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {profile.bio}
                </p>
              </div>
            </section>
          )}





          {/* Profile loading/error states */}
          {profileLoading && (
            <div style={{ 
              padding: '1rem', 
              textAlign: 'center', 
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
            }}>
              Loading profile...
            </div>
          )}
          
          {profileError && (
            <div style={{ 
              padding: '1rem', 
              color: isDebianTheme ? '#FF6666' : '#FF6666',
              borderLeft: '3px solid #FF6666',
              backgroundColor: isDebianTheme ? 'rgba(255,102,102,0.1)' : 'rgba(255,102,102,0.1)'
            }}>
              {profileError}
            </div>
          )}
          </div>
        }
      />
    </PageContainer>
  );
};

export default AboutView;