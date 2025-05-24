import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getGithubProfile, getProfile } from '../data/api';
import type { GitHubProfile } from '../types/githubProfile';
import type { SocialLink, Profile } from '../types/index';

export const StatusBar = () => {
  const { theme, isCommandMode } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Social media links - fallback values that will be updated by API
  const [githubUrl, setGithubUrl] = useState('https://github.com/kauefontes');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/kauefontes');
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Fetch GitHub profile to get user URLs with retry mechanism
    const fetchGithubProfile = async () => {
      try {
        const profileData = await getGithubProfile();
        setGithubProfile(profileData);
        
        // Set GitHub URL from profile data
        if (profileData.htmlUrl) {
          setGithubUrl(profileData.htmlUrl);
        }
      } catch (error) {
        console.error('Error fetching GitHub profile for StatusBar:', error);
      }
    };
    
    // Fetch profile data to get social links
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        
        // Find GitHub and LinkedIn URLs from profile social links
        if (profileData && profileData.socialLinks) {
          // Look for GitHub link
          const githubLink = profileData.socialLinks.find(
            link => link.title.toLowerCase().includes('github') || link.url.includes('github.com')
          );
          if (githubLink) {
            setGithubUrl(githubLink.url);
          }
          
          // Look for LinkedIn link
          const linkedinLink = profileData.socialLinks.find(
            link => link.title.toLowerCase().includes('linkedin') || link.url.includes('linkedin.com')
          );
          if (linkedinLink) {
            setLinkedinUrl(linkedinLink.url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile for StatusBar:', error);
      }
    };
    
    // Fetch both GitHub profile and general profile data
    fetchGithubProfile();
    fetchProfile();
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date and time
  const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  
  const isDebianTheme = theme === 'light';

  return (
    <div className="terminal-statusbar" style={{
      padding: isDebianTheme ? '0.25rem 0.5rem' : undefined,
      backgroundColor: isDebianTheme ? '#C0C0C0' : undefined,
      color: isDebianTheme ? '#000000' : undefined,
      fontWeight: isDebianTheme ? 'normal' : undefined,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ 
          fontWeight: isDebianTheme ? 'bold' : undefined
        }}>
          Theme: {theme === 'dark' ? 'NEON' : 'DEBIAN'}
        </span>
        <span className="mx-3">|</span>
        <span style={{ 
          fontWeight: isCommandMode ? 'bold' : undefined,
          color: isCommandMode 
            ? isDebianTheme ? '#000066' : 'var(--accent-color)' 
            : undefined
        }}>
          Mode: {isCommandMode ? 'COMMAND' : 'NORMAL'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <a 
          href={githubUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000066' : 'inherit',
            fontWeight: isDebianTheme ? 'bold' : 'normal'
          }}
          className="hover:underline"
        >
          GitHub{githubProfile ? `: @${githubProfile.username}` : ''}
        </a>
        <span>|</span>
        <a 
          href={linkedinUrl}
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            color: isDebianTheme ? '#000066' : 'inherit',
            fontWeight: isDebianTheme ? 'bold' : 'normal'
          }}
          className="hover:underline"
        >
          LinkedIn
        </a>
        <span className="mx-2">|</span>
        <span>{date}</span>
        <span className="mx-2">|</span>
        <span>{time}</span>
      </div>
    </div>
  );
};