# React Reference Guide for Claude Code

## Core React Concepts

### Functional Components and JSX

React components are JavaScript functions that return JSX. Always use components within JSX, never call them directly:

```jsx
// ✅ Good: Components in JSX
function BlogPost() {
  return <Layout><Article /></Layout>;
}

// 🔴 Bad: Never call components directly
function BlogPost() {
  return <Layout>{Article()}</Layout>;
}
```

### useState Hook for State Management

```jsx
import { useState } from 'react';

export default function Form() {
  const [text, setText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <form>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => setIsSubmitted(true)}>
        Submit
      </button>
    </form>
  );
}
```

### useEffect Hook for Side Effects

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup function
    return () => clearInterval(id);
  }, []); // Empty dependency array - runs once

  return <h1>{time.toLocaleTimeString()}</h1>;
}
```

### Event Handling Patterns

```jsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  // ✅ Correct: Pass event handler reference
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  // ✅ Correct: Inline function
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Form Management with State

```jsx
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('typing'); // typing, submitting, success, error
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(formData);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err.message);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (status === 'success') {
    return <h1>Message sent successfully!</h1>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange('name')}
        disabled={status === 'submitting'}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange('email')}
        disabled={status === 'submitting'}
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={handleChange('message')}
        disabled={status === 'submitting'}
      />
      <button
        type="submit"
        disabled={status === 'submitting' || !formData.name || !formData.email}
      >
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Conditional Rendering

```jsx
function UserProfile({ user, isLoading }) {
  // Early return for loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Conditional rendering with logical AND
  return (
    <div>
      <h1>{user.name}</h1>
      {user.avatar && (
        <img src={user.avatar} alt={`${user.name}'s avatar`} />
      )}
      {user.isVerified ? (
        <span className="verified">✓ Verified</span>
      ) : (
        <span className="unverified">Pending verification</span>
      )}
    </div>
  );
}
```

### List Rendering

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ⚠️ Never use Math.random() for keys
// key={Math.random()} // 🔴 Bad - causes re-renders
```

### Component Props and Prop Types

```jsx
// Using TypeScript for better prop validation
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onEdit: (userId: string) => void;
  isEditable?: boolean;
}

function UserCard({ user, onEdit, isEditable = false }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {isEditable && (
        <button onClick={() => onEdit(user.id)}>
          Edit
        </button>
      )}
    </div>
  );
}
```

## Project-Specific React Patterns

### Image Handling and Display Components

```jsx
import { useState } from 'react';

function ImageDisplay({ src, alt, fallbackSrc }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="image-container">
      {isLoading && <div className="loading-placeholder">Loading...</div>}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`image ${isLoading ? 'hidden' : 'visible'}`}
      />
    </div>
  );
}

// Image gallery component
function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="gallery">
      <div className="thumbnail-grid">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.thumbnail}
            alt={`Generated image ${index + 1}`}
            className="thumbnail"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <div className="modal">
          <ImageDisplay
            src={selectedImage.fullSize}
            alt={selectedImage.alt}
            fallbackSrc="/placeholder.jpg"
          />
          <button onClick={() => setSelectedImage(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
```

### File Upload and Preview Functionality

```jsx
import { useState, useRef } from 'react';

function FileUploadPreview({ onFileSelect, acceptedTypes = "image/*" }) {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`upload-area ${isDragging ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={(e) => handleFileChange(e.target.files[0])}
        className="hidden"
      />

      {preview ? (
        <div className="preview-container">
          <img src={preview} alt="Upload preview" className="preview-image" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              onFileSelect(null);
            }}
            className="remove-preview"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="upload-prompt">
          <p>Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
```

### API Integration Patterns

```jsx
import { useState, useEffect } from 'react';

// Custom hook for API calls
function useApiCall(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = async (requestOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { ...options, ...requestOptions });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, makeRequest };
}

// Gemini 2.5 Flash API integration
function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const { loading, error, makeRequest } = useApiCall('/api/generate-image');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await makeRequest({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gemini-2.5-flash' })
      });

      setGeneratedImages(prev => [...prev, ...result.images]);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <div className="image-generator">
      <div className="prompt-input">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full p-3 border rounded-lg"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ImageGallery images={generatedImages} />
    </div>
  );
}
```

### Loading States and Error Handling

```jsx
function LoadingSpinner({ size = 'medium' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
}

function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <button onClick={() => setHasError(false)}>Try again</button>
      </div>
    );
  }

  return children;
}

// Usage in components
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return <div>{/* Render data */}</div>;
}
```

### Responsive Design with Tailwind CSS

```jsx
function ResponsiveImageGrid({ images }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow duration-200"
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      ))}
    </div>
  );
}

function ResponsiveLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b px-4 py-3 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          AI Image Generator
        </h1>
      </header>
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
```

## Modern React Best Practices

### Component Composition and Reusability

```jsx
// Compound component pattern
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

// Usage
function ImageCard({ image, onEdit, onDelete }) {
  return (
    <Card className="max-w-sm">
      <Card.Header>
        <h3 className="text-lg font-semibold">{image.title}</h3>
      </Card.Header>
      <Card.Body>
        <img src={image.url} alt={image.alt} className="w-full h-48 object-cover" />
        <p className="mt-2 text-gray-600">{image.description}</p>
      </Card.Body>
      <Card.Footer>
        <div className="flex justify-between">
          <button onClick={() => onEdit(image.id)} className="btn-secondary">
            Edit
          </button>
          <button onClick={() => onDelete(image.id)} className="btn-danger">
            Delete
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
}
```

### Custom Hooks for API Calls and State Management

```jsx
// Custom hook for image generation
function useImageGeneration() {
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async (prompt, options = {}) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...options })
      });

      if (!response.ok) throw new Error('Generation failed');

      const newImage = await response.json();
      setImages(prev => [newImage, ...prev]);
      return newImage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    isGenerating,
    error,
    generateImage,
    deleteImage,
    clearImages
  };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### Performance Optimization

```jsx
import { memo, useMemo, useCallback } from 'react';

// Memoized component - only re-renders when props change
const ImageThumbnail = memo(function ImageThumbnail({ image, onSelect, isSelected }) {
  return (
    <div
      className={`thumbnail ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(image.id)}
    >
      <img src={image.thumbnail} alt={image.alt} />
    </div>
  );
});

function ImageBrowser({ images, selectedId, onImageSelect }) {
  // Memoize expensive calculations
  const sortedImages = useMemo(() => {
    return images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [images]);

  // Memoize callback functions
  const handleImageSelect = useCallback((imageId) => {
    onImageSelect(imageId);
  }, [onImageSelect]);

  // Memoize filtered results
  const [searchTerm, setSearchTerm] = useState('');
  const filteredImages = useMemo(() => {
    if (!searchTerm) return sortedImages;
    return sortedImages.filter(image =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedImages, searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="image-grid">
        {filteredImages.map(image => (
          <ImageThumbnail
            key={image.id}
            image={image}
            onSelect={handleImageSelect}
            isSelected={selectedId === image.id}
          />
        ))}
      </div>
    </div>
  );
}
```

### Accessibility Considerations

```jsx
import { useId } from 'react';

function AccessibleImageGenerator() {
  const promptId = useId();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div role="main" aria-label="AI Image Generator">
      <h1 className="sr-only">Generate AI Images</h1>

      <div className="form-group">
        <label htmlFor={promptId} className="block text-sm font-medium mb-2">
          Image Description
        </label>
        <textarea
          id={promptId}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          aria-describedby={`${promptId}-help`}
          className="w-full p-3 border rounded-lg"
          rows={3}
        />
        <div id={`${promptId}-help`} className="text-sm text-gray-600 mt-1">
          Be specific about colors, style, composition, and mood for best results.
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        aria-describedby="generate-status"
        className="btn-primary"
      >
        {isGenerating ? (
          <>
            <LoadingSpinner size="small" aria-hidden="true" />
            <span className="ml-2">Generating Image...</span>
          </>
        ) : (
          'Generate Image'
        )}
      </button>

      <div id="generate-status" className="sr-only" aria-live="polite">
        {isGenerating ? 'Image generation in progress' : 'Ready to generate'}
      </div>
    </div>
  );
}

// Accessible image component
function AccessibleImage({ src, alt, title, onLoad, onError }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setHasLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className="image-wrapper">
      {!hasLoaded && !hasError && (
        <div className="loading-placeholder" aria-label="Image loading">
          <LoadingSpinner />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        className={`image ${hasLoaded ? 'loaded' : 'loading'}`}
        role="img"
        aria-describedby={hasError ? 'image-error' : undefined}
      />

      {hasError && (
        <div id="image-error" className="error-message" role="alert">
          Failed to load image: {alt}
        </div>
      )}
    </div>
  );
}
```

## Integration Guidelines

### Structuring React Apps with External APIs

```jsx
// API service layer
class ImageService {
  static async generateImage(prompt, options = {}) {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...options })
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async editImage(imageId, edits) {
    const response = await fetch(`/api/images/${imageId}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edits)
    });

    if (!response.ok) {
      throw new Error(`Edit failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Context for global state
const ImageContext = createContext();

export function ImageProvider({ children }) {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (prompt) => {
    setIsLoading(true);
    try {
      const newImage = await ImageService.generateImage(prompt);
      setImages(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
      return newImage;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    images,
    currentImage,
    isLoading,
    generateImage,
    setCurrentImage
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
}

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within ImageProvider');
  }
  return context;
};
```

### Managing Asynchronous Operations

```jsx
function AsyncImageProcessor() {
  const [operations, setOperations] = useState(new Map());

  const startOperation = (operationId, promise) => {
    setOperations(prev => new Map(prev).set(operationId, {
      status: 'pending',
      result: null,
      error: null
    }));

    promise
      .then(result => {
        setOperations(prev => new Map(prev).set(operationId, {
          status: 'success',
          result,
          error: null
        }));
      })
      .catch(error => {
        setOperations(prev => new Map(prev).set(operationId, {
          status: 'error',
          result: null,
          error: error.message
        }));
      });
  };

  const generateImage = async (prompt) => {
    const operationId = `generate-${Date.now()}`;
    const promise = ImageService.generateImage(prompt);
    startOperation(operationId, promise);
    return operationId;
  };

  return {
    operations: Object.fromEntries(operations),
    generateImage
  };
}
```

### Error Boundaries and User Feedback

```jsx
class ImageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Image component error:', error, errorInfo);
    // Report to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the image</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ImageErrorBoundary>
      <ImageProvider>
        <ImageGenerator />
        <ImageGallery />
      </ImageProvider>
    </ImageErrorBoundary>
  );
}
```

This comprehensive guide covers all essential React concepts and patterns specifically tailored for building modern AI-powered image generation applications. Use these patterns as building blocks for clean, maintainable, and performant React code.