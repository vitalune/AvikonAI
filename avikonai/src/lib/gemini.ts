import { GoogleGenerativeAI } from '@google/generative-ai';// gets the gemini sdk

// Initialize the Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');//check to see if there is a key
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
}// give options to how the image is generated

export interface GeneratedImageResult {
  imageData: string; 
  mimeType: string;
}//describes what image is generated


export async function generateImage(options: GenerateImageOptions): Promise<GeneratedImageResult> {
  const {
    prompt,
    style,
    aspectRatio = '1:1',
    quality = 8,
    negativePrompt,
    referenceImageBase64
  } = options;
  //all this function does is generate a image given the prompt style and ratio

  // Build enhanced prompt with style and settings
  let enhancedPrompt = prompt;//gets user prompt 

  // Add style guidance
  if (style) {
    enhancedPrompt += ` Style: ${style}.`;
  }//if style is added given add that to the prompt


  const aspectRatioMap = {
    '1:1': 'Square image.',
    '16:9': 'Wide landscape format.',
    '9:16': 'Tall portrait format.',
    '4:3': 'Standard photo format.'
  };//just aspect ratio for how the image is displayed
  enhancedPrompt += ` ${aspectRatioMap[aspectRatio]}`;//adds that to prompt

  // Add quality guidance
  if (quality >= 8) {
    enhancedPrompt += ' High-resolution, professional quality, ultra-detailed.';
  } else if (quality >= 6) {
    enhancedPrompt += ' Good quality, detailed.';
  }//adds quality to prompt

  if (negativePrompt) {
    enhancedPrompt += ` Avoid: ${negativePrompt}.`;
  } // Makes sure to avoid negative qualities

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image-preview'
    }); //initialize the gemini model and loads the image

    
    const contentParts = []; //holds data to send to gemeini

    // Add reference image if provided
    if (referenceImageBase64) {
      contentParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: referenceImageBase64,
        },
      });//pushes the image to part of the content sent to gemini
      enhancedPrompt = `Use this reference image as inspiration and style guide. ${enhancedPrompt}`;
    }

    // Add text prompt
    contentParts.push({ text: enhancedPrompt });

    const response = await model.generateContent(contentParts);//waits for response given

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