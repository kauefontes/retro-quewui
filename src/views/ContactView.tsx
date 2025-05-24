import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { submitContactForm, getProfile } from '../data/api';
import type { ContactFormData, Profile } from '../types/index';
import { EmptyState } from '../components/common/EmptyState';
import './ContactView.css';

export const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';
  
  useEffect(() => {
    // Fetch profile data to get social links
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile for ContactView:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Send data to the API
      await submitContactForm(formData as ContactFormData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset submission status after a delay
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit contact form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
        }}>Contact</h2>
      </div>
      
      <p style={{ 
        marginBottom: '1.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        Feel free to reach out for collaborations, questions, or just to say hello.
      </p>
      
      <div style={{ 
        border: '1px solid', 
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        padding: '1rem',
        backgroundColor: isDebianTheme ? '#0000B3' : 'transparent',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.75rem',
          paddingBottom: '0.25rem',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>Send a Message</h3>
        
        {submitting ? (
          <EmptyState 
            title="Sending message"
            message="Please wait while your message is being sent..."
            isLoading={true}
          />
        ) : submitted ? (
          <EmptyState 
            title="Message sent"
            message="Your message was sent successfully! We'll get back to you soon."
            icon="✅"
          />
        ) : error ? (
          <EmptyState 
            title="Error sending"
            message={error || "An error occurred while sending your message. Please try again."}
            isError={true}
          />
        ) : (
          <form onSubmit={handleSubmit} className={`contact-form theme-${theme}`}>
            <div className="contact-form-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="contact-form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="contact-form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit"
              className="form-button"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          paddingBottom: '0.25rem',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>Connect With Me</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {profileLoading ? (
            <div style={{ padding: '1rem', color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' }}>
              Loading social links...
            </div>
          ) : profile?.socialLinks ? (
            profile.socialLinks
              .filter(link => 
                link.title.toLowerCase().includes('github') || 
                link.title.toLowerCase().includes('linkedin') ||
                link.url.includes('github.com') ||
                link.url.includes('linkedin.com')
              )
              .map((link, index) => (
                <SocialLink 
                  key={index}
                  command={link.title.toLowerCase().includes('github') ? 'github' : 'linkedin'} 
                  url={link.url} 
                  label={link.title} 
                  isDebianTheme={isDebianTheme}
                />
              ))
          ) : (
            <>
              <SocialLink 
                command="github" 
                url="https://github.com/username" 
                label="GitHub" 
                isDebianTheme={isDebianTheme}
              />
              <SocialLink 
                command="linkedin" 
                url="https://linkedin.com/in/username" 
                label="LinkedIn" 
                isDebianTheme={isDebianTheme}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface SocialLinkProps {
  command: string;
  url: string;
  label: string;
  isDebianTheme: boolean;
}

const SocialLink = ({ command, url, label, isDebianTheme }: SocialLinkProps) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
    }}>
      <span style={{ 
        marginRight: '0.5rem',
        color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)'
      }}>›</span>
      <span style={{ marginRight: '0.5rem' }}>{command} --open</span>
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
          color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          borderRadius: isDebianTheme ? '0' : '0.25rem',
          textDecoration: 'none',
          fontSize: '0.875rem'
        }}
      >
        {label}
      </a>
    </div>
  );
};
