import { useCallback, useRef } from 'react';

interface PixoResult {
  toDataURL: () => string;
  toBase64: () => string;
  toBlob: () => Blob;
  toImage: () => HTMLImageElement;
  toJSON: () => unknown;
  download: () => void;
}

interface PixoBridge {
  edit: (imageSource: string) => void;
  cancelEditing: () => void;
}

interface PixoEditorOptions {
  apiKey: string;
  onSave: (result: PixoResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
  theme?: 'Default' | 'Light' | 'Dark' | 'WordPress';
}

export function usePixoEditor(options: PixoEditorOptions) {
  const editorRef = useRef<PixoBridge | null>(null);

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