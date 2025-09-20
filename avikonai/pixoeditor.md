# Pixo Editor Integration Guide

This document provides a comprehensive guide for integrating Pixo Editor into the AvikonAI application's Image Preview modal Edit functionality.

## Overview

Pixo Editor is a browser-based image editing tool that allows users to edit images directly in their web browser. This integration will enable users to edit their AI-generated profile pictures with professional editing tools.

**Note**: This integration is designed for the Pixo Editor free plan and does not include premium features.

## Free Plan Features Available

### Core Editing Tools
- **Adjustments**: Color corrections, brightness, contrast, saturation
- **Filters**: Pre-defined image filters and effects
- **Draw**: Free drawing tools for annotations and artwork
- **Crop**: Image cropping with pre-defined aspect ratios
- **Text**: Text manipulation and overlay
- **Transform**: Flip and rotate operations
- **Stickers**: Basic sticker library (non-premium stickers only)

### Themes Available (Free)
- Default
- Light
- Dark
- WordPress

### Languages Supported
- en-US (English, United States)
- de-DE (German, Germany)
- fr-FR (French, France)
- pt-BR (Portuguese, Brazil)
- ru-RU (Russian, Russia)
- es-ES (Spanish, Spain)
- And many more...

## Integration Architecture

### 1. Script Loading
```html
<script src="https://pixoeditor.com/editor/scripts/bridge.m.js"></script>
```

### 2. Basic Initialization
```javascript
// Basic initialization for modal integration
const editor = new Pixo.Bridge({
  apikey: 'your_api_key_here',
  type: 'modal',
  width: '90%',
  height: '90%',
  theme: 'Default',
  language: 'en-US',
  onSave: function(result) {
    // Handle the edited image
    const editedImageUrl = result.toDataURL();
    // Update the UI with the edited image
  },
  onCancel: function() {
    // Handle cancellation
  },
  onClose: function() {
    // Handle editor close
  }
});
```

### 3. Opening the Editor
```javascript
// Open editor with an image URL or base64 data
editor.edit(imageUrl);

// Or with base64 data
editor.edit('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...');
```

## Implementation in React/Next.js

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_PIXO_API_KEY=your_pixo_api_key_here
```

### Component Integration

#### 1. Script Loading Hook
```typescript
// hooks/usePixoScript.ts
import { useEffect, useState } from 'react';

export function usePixoScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Pixo) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://pixoeditor.com/editor/scripts/bridge.m.js';
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load Pixo Editor script');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, error };
}
```

#### 2. Pixo Editor Hook
```typescript
// hooks/usePixoEditor.ts
import { useCallback, useRef } from 'react';

interface PixoEditorOptions {
  apiKey: string;
  onSave: (result: any) => void;
  onCancel?: () => void;
  onClose?: () => void;
  theme?: 'Default' | 'Light' | 'Dark' | 'WordPress';
}

export function usePixoEditor(options: PixoEditorOptions) {
  const editorRef = useRef<any>(null);

  const initializeEditor = useCallback(() => {
    if (!window.Pixo) {
      throw new Error('Pixo script not loaded');
    }

    editorRef.current = new window.Pixo.Bridge({
      apikey: options.apiKey,
      type: 'modal',
      width: '90%',
      height: '90%',
      theme: options.theme || 'Default',
      language: 'en-US',
      overlay: {
        color: 'rgba(0, 0, 0, 0.8)'
      },
      onSave: options.onSave,
      onCancel: options.onCancel,
      onClose: options.onClose,
    });

    return editorRef.current;
  }, [options]);

  const editImage = useCallback((imageSource: string) => {
    const editor = editorRef.current || initializeEditor();
    editor.edit(imageSource);
  }, [initializeEditor]);

  const closeEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.cancelEditing();
    }
  }, []);

  return {
    editImage,
    closeEditor,
    isReady: !!editorRef.current
  };
}
```

#### 3. Integration in Image Preview Modal
```typescript
// components/features/image-preview-modal.tsx (Edit tab section)

import { usePixoScript, usePixoEditor } from '@/hooks/pixo';

// Inside the ImagePreviewModal component:
const { isLoaded: isPixoLoaded, error: pixoError } = usePixoScript();

const { editImage, closeEditor } = usePixoEditor({
  apiKey: process.env.NEXT_PUBLIC_PIXO_API_KEY!,
  onSave: (result) => {
    // Convert edited image to blob URL
    const editedImageUrl = result.toDataURL();

    // Update the image in state
    setSelectedImage(prev => prev ? {
      ...prev,
      url: editedImageUrl,
      blobUrl: editedImageUrl,
      isGenerated: true
    } : null);

    // Show success message
    addToast({
      type: 'success',
      title: 'Image Edited',
      message: 'Your image has been successfully edited.'
    });
  },
  onCancel: () => {
    console.log('Edit cancelled');
  },
  onClose: () => {
    console.log('Editor closed');
  },
  theme: 'Default'
});

const handleEditImage = () => {
  if (!isPixoLoaded) {
    addToast({
      type: 'error',
      title: 'Editor Not Ready',
      message: 'Please wait for the editor to load.'
    });
    return;
  }

  if (!process.env.NEXT_PUBLIC_PIXO_API_KEY) {
    addToast({
      type: 'error',
      title: 'Editor Not Configured',
      message: 'Image editor is not properly configured.'
    });
    return;
  }

  // Use the image blob URL or regular URL
  const imageSource = image.blobUrl || image.url;
  editImage(imageSource);
};

// In the Edit tab content:
{activeTab === 'edit' && (
  <div className="space-y-4">
    {pixoError ? (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load image editor
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    ) : !isPixoLoaded ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading image editor...
        </p>
      </div>
    ) : (
      <div className="text-center py-8">
        <Button onClick={handleEditImage} className="mb-4">
          <Edit className="w-4 h-4 mr-2" />
          Open Image Editor
        </Button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Edit your image with professional tools including filters, text, crop, and more.
        </p>
      </div>
    )}
  </div>
)}
```

## Configuration Options (Free Plan)

### Basic Configuration
```javascript
const config = {
  apikey: 'your_api_key_here',          // Required
  type: 'modal',                        // 'modal', 'window', or 'child'
  width: '90%',                         // Editor width
  height: '90%',                        // Editor height
  theme: 'Default',                     // 'Default', 'Light', 'Dark', 'WordPress'
  language: 'en-US',                    // Language code

  // Output settings
  output: {
    format: 'auto',                     // 'auto', 'input', 'jpeg', 'png', 'webp'
    quality: 0.8                        // 0-1 for JPEG/WebP quality
  },

  // UI settings
  overlay: {
    color: 'rgba(0, 0, 0, 0.8)'         // Modal overlay color
  }
};
```

### Callback Functions
```javascript
const callbacks = {
  onSave: function(result) {
    // Available methods:
    // result.toImage()     - Returns Image element
    // result.toDataURL()   - Returns data URL string
    // result.toBase64()    - Returns base64 string
    // result.toBlob()      - Returns Blob object
    // result.toJSON()      - Returns JSON data
    // result.download()    - Downloads the image

    const editedImage = result.toDataURL();
    // Handle the edited image
  },

  onCancel: function() {
    // User cancelled editing
  },

  onClose: function() {
    // Editor window closed
  }
};
```

## Error Handling

### Common Issues and Solutions

1. **API Key Issues**
   ```javascript
   if (!process.env.NEXT_PUBLIC_PIXO_API_KEY) {
     console.error('Pixo API key not configured');
     return;
   }
   ```

2. **Script Loading Failures**
   ```javascript
   if (!window.Pixo) {
     console.error('Pixo script failed to load');
     // Show fallback UI or reload option
   }
   ```

3. **CORS Issues**
   - Ensure images are served with proper CORS headers
   - Use blob URLs for generated images to avoid CORS issues

4. **Mobile Responsiveness**
   ```javascript
   const isMobile = window.innerWidth < 768;
   const editorConfig = {
     width: isMobile ? '100%' : '90%',
     height: isMobile ? '100%' : '90%',
   };
   ```

## Integration Checklist

- [ ] Add Pixo script to application
- [ ] Configure API key in environment variables
- [ ] Implement usePixoScript hook for script loading
- [ ] Implement usePixoEditor hook for editor management
- [ ] Update Image Preview Modal with edit functionality
- [ ] Handle image save/cancel callbacks
- [ ] Add loading states and error handling
- [ ] Test with generated images
- [ ] Test mobile responsiveness
- [ ] Implement proper cleanup on component unmount

## Performance Considerations

1. **Lazy Loading**: Only load Pixo script when editing is needed
2. **Memory Management**: Properly cleanup editor instances
3. **Image Size**: Consider compressing large images before editing
4. **Caching**: Cache the Pixo script for better performance

## Security Notes

1. **API Key**: Store API key in environment variables, not in code
2. **Image Sources**: Validate image sources before passing to editor
3. **Output Validation**: Validate edited images before saving
4. **CORS**: Ensure proper CORS configuration for image resources

## Example Integration Flow

1. User generates an image with AI
2. User clicks on the generated image to open preview modal
3. User clicks "Edit" tab in the preview modal
4. Pixo Editor script loads (if not already loaded)
5. User clicks "Open Image Editor" button
6. Pixo Editor opens in modal mode with the image
7. User edits the image using available tools
8. User clicks "Save" in Pixo Editor
9. `onSave` callback receives the edited image
10. Updated image replaces the original in the gallery
11. Success toast notification is shown

This integration provides a seamless editing experience while maintaining the existing AvikonAI UI/UX design patterns.