import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { submitContactForm } from '../data/api';
import type { ContactFormData } from '../types/index';
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
            title="Enviando mensagem"
            message="Aguarde enquanto sua mensagem está sendo enviada..."
            isLoading={true}
          />
        ) : submitted ? (
          <EmptyState 
            title="Mensagem enviada"
            message="Sua mensagem foi enviada com sucesso! Entraremos em contato em breve."
            icon="✅"
          />
        ) : error ? (
          <EmptyState 
            title="Erro ao enviar"
            message={error || "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."}
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
