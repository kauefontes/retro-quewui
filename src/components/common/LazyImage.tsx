import { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
  placeholderColor?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  style = {}, 
  className = '',
  placeholderColor = '#1e1e1e'
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setError(false);
    setImageSrc(null);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // If loading, show a placeholder
  if (isLoading) {
    return (
      <div 
        style={{
          ...style,
          backgroundColor: placeholderColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff'
        }}
        className={className}
        aria-label={`Loading ${alt}`}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #ffffff', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If error, show a fallback
  if (error) {
    return (
      <div 
        style={{
          ...style,
          backgroundColor: '#444444',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontSize: '12px',
          textAlign: 'center',
          padding: '5px'
        }}
        className={className}
        aria-label={`Failed to load ${alt}`}
      >
        <span>Image unavailable</span>
      </div>
    );
  }

  // Show the image
  return <img src={imageSrc || ''} alt={alt} style={style} className={className} />;
};
