import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getSkills, getProfile } from '../data/api';
import type { Skill, Profile, SocialLink } from '../types/index';
import { TechTag } from '../components/common/TechTag';
import { EmptyState } from '../components/common/EmptyState/EmptyState';

// About View Component
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
        setError('Failed to load skills data. Please try again later.');      // We don't use mock data, keep it empty
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
        // We don't have mock data for the profile, so we keep it as null
      } finally {
        setProfileLoading(false);
      }
    };

    fetchSkills();
    fetchProfile();
  }, []);
  
  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent',
      height: '100%'
    }}>
      {/* Header with title */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        paddingBottom: '0.5rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' 
        }}>About Me</h2>
      </div>
      
      {/* Main content with flex layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1.5rem' 
      }}>
        {/* Bio section */}
        <section>
          {profileLoading ? (
            <EmptyState 
              title="Loading profile"
              message="Please wait while we load profile information..."
              isLoading={true}
            />
          ) : profileError ? (
            <EmptyState 
              title="Error loading profile"
              message={profileError || "Unable to load profile information."}
              isError={true}
            />
          ) : profile ? (
            <div style={{ 
              padding: '1rem',
              backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '4px'
            }}>
              <div style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                {profile.bio.map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: index < profile.bio.length - 1 ? '1rem' : '0' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '1rem',
              color: isDebianTheme ? '#FFFFFF99' : 'var(--text-color-secondary)'
            }}>
              Bio not available.
            </div>
          )}
        </section>
        
        {/* Main content grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '2rem'
        }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Technical Skills section */}
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
                Technical Skills
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
              </h3>
              
              <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }}>
                  {loading ? (
                    <div style={{ gridColumn: 'span 2' }}>
                      <EmptyState 
                        title="Loading skills"
                        message="Please wait while we load technical skills..."
                        isLoading={true}
                      />
                    </div>
                  ) : error ? (
                    <div style={{ gridColumn: 'span 2' }}>
                      <EmptyState 
                        title="Error loading"
                        message={error || "An error occurred while loading skills."}
                        isError={true}
                      />
                    </div>
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
          
          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Links section */}
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
                Links
                {!profileLoading && !profileError && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: '#00AA00', 
                    color: 'white',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'normal'
                  }}>live</span>
                )}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profileLoading ? (
                  <div style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                  }}>
                    Loading links...
                  </div>
                ) : profileError ? (
                  <div style={{ 
                    padding: '1rem', 
                    color: isDebianTheme ? '#FF6666' : '#FF6666',
                    borderLeft: '3px solid #FF6666'
                  }}>
                    {profileError}
                  </div>
                ) : profile && profile.socialLinks.map((link, index) => (
                  <SocialLink
                    key={index}
                    title={link.title}
                    url={link.url}
                    icon={link.icon}
                    isDebianTheme={isDebianTheme}
                  />
                ))}
              </div>
            </section>
            
            {/* Education section */}
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
                Education
                {!profileLoading && !profileError && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    backgroundColor: '#00AA00', 
                    color: 'white',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'normal'
                  }}>live</span>
                )}
              </h3>
              
              {profileLoading ? (
                <div style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}>
                  Loading education...
                </div>
              ) : profileError ? (
                <div style={{ 
                  padding: '1rem', 
                  color: isDebianTheme ? '#FF6666' : '#FF6666',
                  borderLeft: '3px solid #FF6666'
                }}>
                  {profileError}
                </div>
              ) : profile && profile.education.map((edu, index) => (
                <div 
                  key={index}
                  style={{
                    marginBottom: index < profile.education.length - 1 ? '0.75rem' : '0',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{edu.degree}</div>
                  <div>{edu.institution}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{edu.period}</div>
                </div>
              ))}
            </section>
            
            {/* Languages section */}
            <section>
              <div>
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
                  Languages
                  {!profileLoading && !profileError && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: '#00AA00', 
                      color: 'white',
                      padding: '0.1rem 0.3rem',
                      borderRadius: '0.25rem',
                      fontWeight: 'normal'
                    }}>live</span>
                  )}
                </h3>
              </div>
              
              <div>
                {profileLoading ? (
                  <div style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                  }}>
                    Loading languages...
                  </div>
                ) : profileError ? (
                  <div style={{ 
                    padding: '1rem', 
                    color: isDebianTheme ? '#FF6666' : '#FF6666',
                    borderLeft: '3px solid #FF6666'
                  }}>
                    {profileError}
                  </div>
                ) : (
                  <ul style={{
                    listStyleType: 'none',
                    paddingLeft: isDebianTheme ? '0.75rem' : '1rem',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                  }}>
                    {profile && profile.languages.map((lang, index) => (
                      <li 
                        key={index}
                        style={{
                          position: 'relative',
                          paddingLeft: '1rem',
                          marginBottom: index < profile.languages.length - 1 ? '0.5rem' : '0'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                        }}>›</span>
                        {lang.name} ({lang.level})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkillCategoryProps {
  title: string;
  skills: string[];
  isDebianTheme: boolean;
}

const SkillCategory = ({ title, skills, isDebianTheme }: SkillCategoryProps) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4 style={{
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>{title}</h4>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.25rem'
      }}>
        {skills.map((skill, index) => (
          <TechTag
            key={index}
            label={skill}
            size="small"
          />
        ))}
      </div>
    </div>
  );
};

interface SocialLinkProps {
  title: string;
  url: string;
  icon: string;
  isDebianTheme: boolean;
}

const SocialLink = ({ title, url, icon, isDebianTheme }: SocialLinkProps) => {
  return (
    <a 
      href={url} 
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
      <span style={{ fontFamily: 'monospace' }}>{icon}</span>
      <span>{title}</span>
    </a>
  );
};
