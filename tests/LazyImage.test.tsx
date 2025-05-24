import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LazyImage } from '../src/components/common/LazyImage';

// Mock Image constructor
const originalImage = global.Image;
let imageOnloadMock: Function | null = null;
let imageOnerrorMock: Function | null = null;

// Create a mock implementation of the Image
class MockImage {
  src: string = '';
  onload: Function | null = null;
  onerror: Function | null = null;
  
  constructor() {
    // Store callbacks for testing
    imageOnloadMock = (callback: Function) => {
      this.onload = callback;
    };
    imageOnerrorMock = (callback: Function) => {
      this.onerror = callback;
    };
  }
}

describe('LazyImage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Replace global Image with our mock
    // @ts-ignore - we're intentionally mocking this
    global.Image = MockImage;
    
    // Reset callback references
    imageOnloadMock = null;
    imageOnerrorMock = null;
  });
  
  afterEach(() => {
    // Restore original Image
    global.Image = originalImage;
  });
  
  it('should render a loading placeholder initially', () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);
    
    // Should show loading state
    expect(screen.getByLabelText(/Loading Test image/i)).toBeInTheDocument();
  });
  
  it('should render the image after it loads', async () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);
    
    // Simulate image load
    await act(async () => {
      if (imageOnloadMock) {
        const mockOnload = (MockImage.prototype as any).onload;
        if (mockOnload) mockOnload();
      }
    });
    
    // Should show the actual image
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });
  
  it('should render a fallback when image fails to load', async () => {
    render(<LazyImage src="test.jpg" alt="Test image" />);
    
    // Simulate image error
    await act(async () => {
      if (imageOnerrorMock) {
        const mockOnerror = (MockImage.prototype as any).onerror;
        if (mockOnerror) mockOnerror();
      }
    });
    
    // Should show error state
    expect(screen.getByLabelText(/Failed to load Test image/i)).toBeInTheDocument();
    expect(screen.getByText(/Image unavailable/i)).toBeInTheDocument();
  });
});
