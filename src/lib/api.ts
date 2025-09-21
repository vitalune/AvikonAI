import { GenerateImageRequest, GenerateImageResponse } from '@/types';

/**
 * Client-side function to call the image generation API
 */
export async function generateImageAPI(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if the Gemini API is properly configured
 */
export async function checkGeminiStatus(): Promise<{ configured: boolean; error?: string }> {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'GET',
    });

    if (!response.ok) {
      return { configured: false, error: 'Failed to check API status' };
    }

    const data = await response.json();
    return { configured: data.geminiConfigured };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}