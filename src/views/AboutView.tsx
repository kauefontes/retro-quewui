import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getSkills, getProfile } from '../data/api';
import type { Skill, Profile } from '../types/index';
import { TechTag } from '../components/common/TechTag';
import { EmptyState } from '../components/common/EmptyState/EmptyState';

// About View Component - Simplified for Go backend
export const AboutView = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const skillsData = await getSkills();
        setSkills(skillsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills data. Please try again later.');
        setSkills([]);
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

    fetchSkills();
    fetchProfile();
  }, []);

  const SkillCategory = ({ title, skills, isDebianTheme }: { 
    title: string; 
    skills: string[]; 
    isDebianTheme: boolean;
  }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ 
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {title}
      </h4>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem'
      }}>
        {skills.map((skill, index) => (
          <TechTag 
            key={index} 
            label={skill} 
          />
        ))}
      </div>
    </div>
  );

  const ProfileLink = ({ label, url, isDebianTheme }: { 
    label: string; 
    url: string; 
    isDebianTheme: boolean;
  }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,0,0.1)'
    }}>
      <span style={{ 
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        fontWeight: 'bold',
        minWidth: '80px'
      }}>
        {label}:
      </span>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ 
          color: isDebianTheme ? '#00FF00' : 'var(--accent-color)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'underline'}
        onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = 'none'}
      >
        {url}
      </a>
    </div>
  );

  return (
    <div style={{ 
      padding: '1.5rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', 
        gap: '2rem'
      }}>
        {/* Left column - Skills */}
        <div>
          <section>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid',
              borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
              color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              Skills & Technologies
              {!loading && !error && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: '#00AA00', 
                  color: 'white',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '0.25rem',
                  fontWeight: 'normal'
                }}>live</span>
              )}
            </h2>
            
            <div>
              {loading ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}>
                  Loading skills...
                </div>
              ) : error ? (
                <EmptyState
                  title="Unable to load skills"
                  message={error}
                  isError={true}
                />
              ) : skills.length === 0 ? (
                <EmptyState
                  title="No skills data"
                  message="Skills information is not available at the moment."
                />
              ) : (
                skills.map((skillCategory) => (
                  <SkillCategory 
                    key={skillCategory.category}
                    title={skillCategory.category} 
                    skills={skillCategory.items} 
                    isDebianTheme={isDebianTheme}
                  />
                ))
              )}
            </div>
          </section>
        </div>
        
        {/* Right column - Profile Info */}
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
                About {profile.name}
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
                {profile.availableForHire && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#00AA00',
                    color: 'white',
                    borderRadius: '0.25rem',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    ✅ Available for hire
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Contact & Links section */}
          {profile && (
            <section>
              <h3 style={{ 
                fontSize: '1.125rem',
                fontWeight: 'bold', 
                marginBottom: '1rem',
                paddingBottom: '0.25rem',
                borderBottom: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                Contact & Links
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.email && (
                  <ProfileLink 
                    label="Email" 
                    url={`mailto:${profile.email}`} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.phone && (
                  <ProfileLink 
                    label="Phone" 
                    url={`tel:${profile.phone}`} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.linkedinUrl && (
                  <ProfileLink 
                    label="LinkedIn" 
                    url={profile.linkedinUrl} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.githubUrl && (
                  <ProfileLink 
                    label="GitHub" 
                    url={profile.githubUrl} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.twitterUrl && (
                  <ProfileLink 
                    label="Twitter" 
                    url={profile.twitterUrl} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.websiteUrl && (
                  <ProfileLink 
                    label="Website" 
                    url={profile.websiteUrl} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
                {profile.resumeUrl && (
                  <ProfileLink 
                    label="Resume" 
                    url={profile.resumeUrl} 
                    isDebianTheme={isDebianTheme}
                  />
                )}
              </div>
            </section>
          )}

          {/* Location section */}
          {profile?.location && (
            <section>
              <h3 style={{ 
                fontSize: '1.125rem',
                fontWeight: 'bold', 
                marginBottom: '1rem',
                paddingBottom: '0.25rem',
                borderBottom: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                Location
              </h3>
              
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: isDebianTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,0,0.1)',
                borderRadius: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <span>{profile.location}</span>
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
      </div>
    </div>
  );
};

export default AboutView;