import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

export interface GenerateImageOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  quality?: number;
  negativePrompt?: string;
  referenceImageBase64?: string;
}

export interface GeneratedImageResult {
  imageData: string; // base64 encoded image
  mimeType: string;
}

/**
 * Generate an image using Gemini 2.5 Flash
 */
export async function generateImage(options: GenerateImageOptions): Promise<GeneratedImageResult> {
  const {
    prompt,
    style,
    aspectRatio = '1:1',
    quality = 8,
    negativePrompt,
    referenceImageBase64
  } = options;

  // Build enhanced prompt with style and settings
  let enhancedPrompt = prompt;

  // Add style guidance
  if (style) {
    enhancedPrompt += ` Style: ${style}.`;
  }

  // Add aspect ratio guidance
  const aspectRatioMap = {
    '1:1': 'Square image.',
    '16:9': 'Wide landscape format.',
    '9:16': 'Tall portrait format.',
    '4:3': 'Standard photo format.'
  };
  enhancedPrompt += ` ${aspectRatioMap[aspectRatio]}`;

  // Add quality guidance
  if (quality >= 8) {
    enhancedPrompt += ' High-resolution, professional quality, ultra-detailed.';
  } else if (quality >= 6) {
    enhancedPrompt += ' Good quality, detailed.';
  }

  // Add negative prompt constraints
  if (negativePrompt) {
    enhancedPrompt += ` Avoid: ${negativePrompt}.`;
  }

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image-preview'
    });

    // Prepare content parts
    const contentParts: any[] = [];

    // Add reference image if provided
    if (referenceImageBase64) {
      contentParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: referenceImageBase64,
        },
      });
      enhancedPrompt = `Use this reference image as inspiration and style guide. ${enhancedPrompt}`;
    }

    // Add text prompt
    contentParts.push({ text: enhancedPrompt });

    const response = await model.generateContent(contentParts);

    // Extract image data from response
    const candidate = response.response.candidates?.[0];
    if (!candidate) {
      throw new Error('No image candidate returned from Gemini');
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return {
          imageData: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png'
        };
      }
    }

    throw new Error('No image data found in response');
  } catch (error) {
    console.error('Gemini image generation error:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert base64 image data to a blob URL
 */
export function base64ToBlob(base64Data: string, mimeType: string): string {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return URL.createObjectURL(blob);
}

/**
 * Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}