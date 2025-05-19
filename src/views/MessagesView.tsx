import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { getContactMessages, deleteContactMessage } from '../data/api';
import type { ContactFormData } from '../types/index';
import { useAuth } from '../contexts/AuthUtils';
import { AuthContent } from '../components/common/AuthContent/AuthContent';
import { DetailActionButtons } from '../components/common/DetailActionButtons';
import { ListDetailLayout } from '../components/common/ListDetailLayout';
import { EmptyProjectState } from '../components/common/EmptyState';

export const MessagesView = () => {
  const [messages, setMessages] = useState<ContactFormData[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactFormData | null>(null);
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
        
        // Select the first message by default if available
        if (messagesData.length > 0) {
          setSelectedMessage(messagesData[0]);
        }
        
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

  const handleDelete = async () => {
    if (!selectedMessage || !selectedMessage.id) return;
    
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await deleteContactMessage(selectedMessage.id);
      const updatedMessages = messages.filter(message => message.id !== selectedMessage.id);
      setMessages(updatedMessages);
      
      // Select the first message in the updated list or null if empty
      setSelectedMessage(updatedMessages.length > 0 ? updatedMessages[0] : null);
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message. Please try again.');
    }
  };

  const messagesList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {messages.length > 0 ? (
        messages.map((message) => (
          <MessageCard 
            key={message.id} 
            message={message}
            isSelected={selectedMessage?.id === message.id}
            onClick={() => setSelectedMessage(message)}
            isDebianTheme={isDebianTheme}
          />
        ))
      ) : (
        <EmptyProjectState
          type="message"
          isFiltered={false}
        />
      )}
    </div>
  );
  
  const messageDetail = selectedMessage && (
    <MessageDetail 
      message={selectedMessage} 
      onClose={() => setSelectedMessage(null)}
      onDelete={handleDelete}
      isDebianTheme={isDebianTheme}
    />
  );
  
  const titleAction = !loading && !error && messages.length > 0 && (
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
  );

  return (
    <AuthContent 
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)' }}>
          Please login to view messages.
        </div>
      }
    >
      <ListDetailLayout
        title="Contact Messages"
        titleAction={titleAction}
        loading={loading}
        error={error}
        listContent={messagesList}
        detailContent={messageDetail}
        hasSelectedItem={!!selectedMessage}
        loadingMessage="Loading messages..."
        emptyMessage="No messages found"
      />
    </AuthContent>
  );
};

interface MessageCardProps {
  message: ContactFormData;
  isSelected: boolean;
  onClick: () => void;
  isDebianTheme: boolean;
}

const MessageCard = ({ message, isSelected, onClick, isDebianTheme }: MessageCardProps) => {
  return (
    <div 
      style={{
        padding: '0.75rem',
        border: '1px solid',
        borderColor: isDebianTheme
          ? (isSelected ? '#FFFFFF' : '#666666')
          : (isSelected ? 'var(--accent-color)' : '#103149'),
        cursor: 'pointer',
        backgroundColor: isDebianTheme 
          ? (isSelected ? '#0000D3' : '#0000B3')
          : (isSelected ? 'rgba(0, 255, 217, 0.1)' : 'transparent'),
        transition: 'border-color 0.2s',
      }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <h3 style={{ fontWeight: 'bold' }}>{message.name}</h3>
        {message.date && (
          <span style={{ fontSize: '0.875rem', opacity: '0.7' }}>
            {new Date(message.date).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <div style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: '0.8',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        {message.email}
      </div>
      
      <p style={{ 
        fontSize: '0.875rem', 
        marginTop: '0.25rem', 
        opacity: '0.8',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {message.message}
      </p>
    </div>
  );
};

interface MessageDetailProps {
  message: ContactFormData;
  onClose: () => void;
  onDelete: () => void;
  isDebianTheme: boolean;
}

const MessageDetail = ({ message, onClose, onDelete, isDebianTheme }: MessageDetailProps) => {
  return (
    <div style={{ 
      padding: '1rem', 
      borderLeft: '1px solid',
      borderColor: isDebianTheme ? '#666666' : 'var(--accent-color)', 
      height: '100%',
      backgroundColor: isDebianTheme ? '#0000B3' : 'transparent'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid',
        borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
        color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{message.name}</h3>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            {message.date && new Date(message.date).toLocaleDateString()}
          </div>
        </div>
        <DetailActionButtons
          onDelete={onDelete}
          onClose={onClose}
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Contact Email
        </h4>
        <div style={{ 
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)'
        }}>
          {message.email}
        </div>
      </div>
      
      <div>
        <h4 style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderBottom: '1px solid',
          borderColor: isDebianTheme ? '#FFFFFF' : 'var(--accent-color)',
          paddingBottom: '0.25rem'
        }}>
          Message
        </h4>
        <div style={{ 
          padding: '0.75rem',
          backgroundColor: isDebianTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)',
          color: isDebianTheme ? '#FFFFFF' : 'var(--text-color)',
          borderRadius: isDebianTheme ? '0' : '0.25rem',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.5'
        }}>
          {message.message}
        </div>
      </div>
    </div>
  );
};
