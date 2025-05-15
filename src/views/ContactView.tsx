import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';

export const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const isDebianTheme = theme === 'light';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Simulação de envio bem-sucedido
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset submission status after a delay
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      setSubmitting(false);
    }, 1500);
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
        
        {submitted ? (
          <div style={{
            padding: '1rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 255, 217, 0.1)',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            <p>Message sent successfully! I'll get back to you soon.</p>
          </div>
        ) : error ? (
          <div style={{
            padding: '1rem',
            backgroundColor: isDebianTheme ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 50, 50, 0.1)',
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            <p>{error}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label 
                htmlFor="name" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.25rem',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#666666' : '#103149',
                  borderRadius: isDebianTheme ? '0' : '0.25rem'
                }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.25rem',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#666666' : '#103149',
                  borderRadius: isDebianTheme ? '0' : '0.25rem'
                }}
              />
            </div>
            
            <div>
              <label 
                htmlFor="message" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.25rem',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}
              >
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#666666' : '#103149',
                  borderRadius: isDebianTheme ? '0' : '0.25rem'
                }}
              />
            </div>
            
            <div>
              <button 
                type="submit" 
                disabled={submitting}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: isDebianTheme ? '#0000D3' : 'rgba(0, 255, 217, 0.1)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
                  borderRadius: isDebianTheme ? '0' : '0.25rem',
                  cursor: submitting ? 'wait' : 'pointer'
                }}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
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
          <SocialLink 
            command="twitter" 
            url="https://twitter.com/username" 
            label="Twitter" 
            isDebianTheme={isDebianTheme}
          />
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
