import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Pixo: {
      Bridge: new (config: PixoBridgeConfig) => PixoBridge;
    };
  }
}

interface PixoBridgeConfig {
  apikey: string;
  type: 'modal' | 'window' | 'child';
  width: string;
  height: string;
  theme?: 'Default' | 'Light' | 'Dark' | 'WordPress';
  language?: string;
  overlay?: {
    color: string;
  };
  onSave?: (result: PixoResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

interface PixoBridge {
  edit: (imageSource: string) => void;
  cancelEditing: () => void;
}

interface PixoResult {
  toDataURL: () => string;
  toBase64: () => string;
  toBlob: () => Blob;
  toImage: () => HTMLImageElement;
  toJSON: () => unknown;
  download: () => void;
}

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