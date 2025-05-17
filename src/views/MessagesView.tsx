import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getContactMessages, deleteContactMessage } from '../data/api';
import type { ContactFormData } from '../types/index';
import { useAuth } from '../contexts/AuthUtils';
import { AuthContent } from '../components/common/AuthContent/AuthContent';

export const MessagesView = () => {
  const [messages, setMessages] = useState<ContactFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useAppStore();
  const { isAuthenticated } = useAuth();
  const isDebianTheme = theme === 'light';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const messagesData = await getContactMessages();
        setMessages(messagesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(message => message.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message. Please try again.');
    }
  };

  return (
    <AuthContent 
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' }}>
          Please login to view messages.
        </div>
      }
    >
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
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Contact Messages
            {!loading && !error && messages.length > 0 && (
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: '#00AA00', 
                color: 'white',
                padding: '0.1rem 0.3rem',
                borderRadius: '0.25rem',
                fontWeight: 'normal'
              }}>
                {messages.length}
              </span>
            )}
          </h2>
        </div>
        
        {loading ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
          }}>
            Loading messages...
          </div>
        ) : error ? (
          <div style={{ 
            padding: '1rem', 
            color: isDebianTheme ? '#FF6666' : '#FF6666',
            borderLeft: '3px solid #FF6666'
          }}>
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
            opacity: 0.7
          }}>
            No messages found
          </div>
        ) : (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                style={{
                  padding: '1rem',
                  border: '1px solid',
                  borderColor: isDebianTheme ? '#666666' : '#103149',
                  backgroundColor: isDebianTheme ? '#0000B3' : 'transparent',
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
                }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem' }}>{message.name}</strong>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{message.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {message.date && (
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={() => message.id && handleDelete(message.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid',
                        borderColor: isDebianTheme ? '#FF6666' : '#FF6666',
                        color: isDebianTheme ? '#FF6666' : '#FF6666',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ 
                  padding: '0.5rem',
                  backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                  color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
                  borderRadius: isDebianTheme ? '0' : '0.25rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthContent>
  );
};
