import React, { useEffect, useState } from 'react';
import './ImageModal.css';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Reset currentIndex when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'h') {
        // Previous image
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'l') {
        // Next image
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>×</button>
        
        {images.length > 1 && (
          <button 
            className="image-modal-nav image-modal-prev" 
            onClick={handlePrev}
          >
            &#10094;
          </button>
        )}
        
        <div className="image-modal-img-container">
          <img 
            src={images[currentIndex]} 
            alt={`Image ${currentIndex + 1}`} 
            className="image-modal-img"
          />
          
          {images.length > 1 && (
            <div className="image-modal-counter">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
        
        {images.length > 1 && (
          <button 
            className="image-modal-nav image-modal-next" 
            onClick={handleNext}
          >
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
