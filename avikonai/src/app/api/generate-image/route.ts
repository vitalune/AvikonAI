import { NextRequest, NextResponse } from 'next/server';
import { generateImage, type GenerateImageOptions } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables.',
          code: 'API_KEY_NOT_CONFIGURED'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      prompt,
      style,
      aspectRatio,
      quality,
      negativePrompt,
      referenceImageBase64
    }: GenerateImageOptions = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate prompt length (Gemini has limits)
    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Please keep it under 2000 characters.' },
        { status: 400 }
      );
    }

    // Generate image using Gemini
    const result = await generateImage({
      prompt: prompt.trim(),
      style,
      aspectRatio,
      quality,
      negativePrompt,
      referenceImageBase64
    });

    return NextResponse.json({
      success: true,
      imageData: result.imageData,
      mimeType: result.mimeType
    });

  } catch (error) {
    console.error('Image generation API error:', error);

    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            error: 'Invalid API key. Please check your Gemini API configuration.',
            code: 'INVALID_API_KEY'
          },
          { status: 401 }
        );
      }

      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'API quota exceeded. Please try again later.',
            code: 'QUOTA_EXCEEDED'
          },
          { status: 429 }
        );
      }

      if (error.message.includes('safety') || error.message.includes('blocked')) {
        return NextResponse.json(
          {
            error: 'Content was blocked by safety filters. Please modify your prompt.',
            code: 'CONTENT_BLOCKED'
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: error.message,
          code: 'GENERATION_FAILED'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred during image generation',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = process.env.GEMINI_API_KEY &&
                      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

  return NextResponse.json({
    status: 'ok',
    geminiConfigured: isConfigured,
    timestamp: new Date().toISOString()
  });
}