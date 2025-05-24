import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getGithubProfile } from '../data/api';
import type { GitHubProfile } from '../types/githubProfile';

export const StatusBar = () => {
  const { theme, isCommandMode } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  
  // Social media links - fallback values that will be updated by API
  const [githubUrl, setGithubUrl] = useState('https://github.com/kauefontes');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/kauefontes');
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Fetch GitHub profile to get user URLs with retry mechanism
    const fetchGithubProfile = async (retryCount = 0, maxRetries = 3) => {
      try {
        const profileData = await getGithubProfile();
        setGithubProfile(profileData);
        
        // Set GitHub URL from profile data
        if (profileData.htmlUrl) {
          setGithubUrl(profileData.htmlUrl);
        }
        
        // Try to find LinkedIn URL in profile data
        if (profileData.blog?.includes('linkedin.com')) {
          setLinkedinUrl(profileData.blog);
        }
      } catch (error) {
        console.error('Error fetching GitHub profile for StatusBar:', error);
        
        // Retry logic with exponential backoff
        if (retryCount < maxRetries) {
          const backoffDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, ...
          console.log(`Retrying GitHub profile fetch in ${backoffDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);
          
          setTimeout(() => {
            fetchGithubProfile(retryCount + 1, maxRetries);
          }, backoffDelay);
        } else {
          // Keep using default values on error after max retries
          console.warn('Failed to fetch GitHub profile after maximum retry attempts');
        }
      }
    };
    
    fetchGithubProfile();
    
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