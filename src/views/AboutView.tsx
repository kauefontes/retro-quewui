import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { skills as mockSkills } from '../data/mockData';
import { getSkills } from '../data/api';
import type { Skill } from '../types/index';

// About View Component
export const AboutView = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError('Failed to load skills data. Using fallback data.');
        // Usando dados mockados como fallback
        setSkills(mockSkills);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);
  
  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent',
      height: '100%',
      overflowY: 'auto'
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
          <p style={{
            marginBottom: '0.75rem',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            Senior Software Developer specializing in creating intuitive and high-performance web applications. 
            With over 5 years of professional experience, I've worked on projects ranging from automotive 
            dashboards to IoT systems and developer tools.
          </p>
          <p style={{
            marginBottom: '0.75rem',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            I'm passionate about building software that combines technical excellence with great user 
            experience. My approach emphasizes clean code, performance optimization, and sustainable 
            architecture that can evolve with changing requirements.
          </p>
          <p style={{
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            When I'm not coding, you can find me exploring new technologies, contributing to open-source 
            projects, or enjoying outdoor activities.
          </p>
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
                    <div style={{ 
                      gridColumn: 'span 2',
                      padding: '1rem', 
                      textAlign: 'center', 
                      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                    }}>
                      Loading skills...
                    </div>
                  ) : error ? (
                    <div style={{ 
                      gridColumn: 'span 2',
                      padding: '1rem', 
                      color: isDebianTheme ? '#FF6666' : '#FF6666',
                      borderLeft: '3px solid #FF6666'
                    }}>
                      {error}
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
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>Links</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SocialLink
                  title="GitHub"
                  url="https://github.com/kauefontes"
                  icon="󰊤"
                  isDebianTheme={isDebianTheme}
                />
                <SocialLink
                  title="LinkedIn"
                  url="https://www.linkedin.com/in/kauefontes/"
                  icon="󰌻"
                  isDebianTheme={isDebianTheme}
                />
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
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>Education</h3>
              
              <div style={{
                marginBottom: '0.75rem',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                <div style={{ fontWeight: 'bold' }}>Computer Science, B.Sc.</div>
                <div>University of Technology</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>2016 - 2020</div>
              </div>
              
              <div style={{
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                <div style={{ fontWeight: 'bold' }}>Advanced Software Architecture</div>
                <div>Tech Institute</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>2022</div>
              </div>
            </section>
            
            {/* Languages section */}
            <section>
              <h3 style={{ 
                fontSize: '1.125rem',
                fontWeight: 'bold', 
                marginBottom: '1rem',
                paddingBottom: '0.25rem',
                borderBottom: '1px solid',
                borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>Languages</h3>
              
              <ul style={{
                listStyleType: 'none',
                paddingLeft: isDebianTheme ? '0.75rem' : '1rem',
                color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
              }}>
                <li style={{
                  position: 'relative',
                  paddingLeft: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                  }}>›</span>
                  English (Fluent)
                </li>
                <li style={{
                  position: 'relative',
                  paddingLeft: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                  }}>›</span>
                  Portuguese (Native)
                </li>
                <li style={{
                  position: 'relative',
                  paddingLeft: '1rem'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
                  }}>›</span>
                  Spanish (Intermediate)
                </li>
              </ul>
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
      
      <ul style={{
        listStyleType: 'none',
        paddingLeft: isDebianTheme ? '0.75rem' : '1rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {skills.map((skill, index) => (
          <li key={index} style={{
            position: 'relative',
            paddingLeft: '1rem',
            marginBottom: '0.25rem'
          }}>
            <span style={{
              position: 'absolute',
              left: '0',
              color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
            }}>›</span>
            {skill}
          </li>
        ))}
      </ul>
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
