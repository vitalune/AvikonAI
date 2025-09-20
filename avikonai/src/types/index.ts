export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: Date;
  isProcessing?: boolean;
  blobUrl?: string; // For locally generated images
  isGenerated?: boolean; // Distinguish between generated and mock images
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  example: string;
  category: 'professional' | 'artistic' | 'gaming' | 'creative';
}

export interface GenerationSettings {
  style: string;
  quality: number;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  negativePrompt?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

export type Theme = 'light' | 'dark';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// API Response types
export interface GenerateImageResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  error?: string;
  code?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  quality?: number;
  negativePrompt?: string;
  referenceImageBase64?: string;
}