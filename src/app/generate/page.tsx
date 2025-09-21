'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptInput } from '@/components/features/prompt-input';
import { StyleSelector } from '@/components/features/style-selector';
import { ImageUpload } from '@/components/features/image-upload';
import { GenerationSettings } from '@/components/features/generation-settings';
import { ImageGallery } from '@/components/features/image-gallery';
import { GenerationProgress } from '@/components/features/generation-progress';
import { useToast } from '@/hooks/use-toast';
import { GeneratedImage, StylePreset, GenerationSettings as IGenerationSettings } from '@/types';
import { mockImages, stylePresets } from '@/lib/mock-data';
import { generateImageAPI, checkGeminiStatus } from '@/lib/api';
import { fileToBase64 } from '@/lib/gemini';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(stylePresets[0]);
  const [settings, setSettings] = useState<IGenerationSettings>({
    style: stylePresets[0].id,
    quality: 8,
    aspectRatio: '1:1',
    negativePrompt: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>(mockImages);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean | null>(null);

  const { addToast } = useToast();

  // Check Gemini API configuration on component mount
  useEffect(() => {
    checkGeminiStatus().then(({ configured, error }) => {
      setIsGeminiConfigured(configured);
      if (!configured) {
        console.warn('Gemini API not configured:', error);
      }
    });
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast({
        type: 'error',
        title: 'Prompt Required',
        message: 'Please enter a description for your image.'
      });
      return;
    }

    // Check if Gemini is configured
    if (isGeminiConfigured === false) {
      addToast({
        type: 'error',
        title: 'API Not Configured',
        message: 'Gemini API key is not configured. Please check your environment variables.'
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Prepare reference image if uploaded
      let referenceImageBase64: string | undefined;
      if (uploadedFiles.length > 0) {
        setGenerationProgress(10);
        referenceImageBase64 = await fileToBase64(uploadedFiles[0]);
      }

      setGenerationProgress(25);

      // Call the generation API
      const response = await generateImageAPI({
        prompt: prompt.trim(),
        style: selectedStyle.description,
        aspectRatio: settings.aspectRatio,
        quality: settings.quality,
        negativePrompt: settings.negativePrompt,
        referenceImageBase64
      });

      setGenerationProgress(75);

      if (!response.success || !response.imageData) {
        throw new Error(response.error || 'Failed to generate image');
      }

      // Convert base64 to blob URL
      const byteCharacters = atob(response.imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.mimeType || 'image/png' });
      const blobUrl = URL.createObjectURL(blob);

      setGenerationProgress(90);

      // Create new generated image
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: blobUrl, // Use blob URL for display
        blobUrl: blobUrl,
        prompt: prompt,
        style: selectedStyle.name,
        timestamp: new Date(),
        isProcessing: false,
        isGenerated: true
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setGenerationProgress(100);

      addToast({
        type: 'success',
        title: 'Image Generated!',
        message: 'Your AI profile picture has been created successfully.'
      });

    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';

      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: errorMessage
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleStyleChange = (style: StylePreset) => {
    setSelectedStyle(style);
    setSettings(prev => ({ ...prev, style: style.id }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          AI Profile Picture Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create stunning, personalized profile pictures with advanced AI technology
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Image</CardTitle>
            </CardHeader>
            <CardContent>
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder="Enter a detailed description of your ideal profile picture..."
              />
            </CardContent>
          </Card>

          {/* Style Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Style</CardTitle>
            </CardHeader>
            <CardContent>
              <StyleSelector
                styles={stylePresets}
                selectedStyle={selectedStyle}
                onStyleChange={handleStyleChange}
              />
            </CardContent>
          </Card>

          {/* Reference Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Reference Image (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={1}
                accept="image/*"
              />
            </CardContent>
          </Card>

          {/* Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <GenerationSettings
                settings={settings}
                onSettingsChange={setSettings}
              />
            </CardContent>
          </Card>

          {/* API Status Warning */}
          {isGeminiConfigured === false && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Gemini API not configured. Set your GEMINI_API_KEY to enable real image generation.
              </p>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || isGeminiConfigured === false}
            isLoading={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? 'Generating...' : isGeminiConfigured === false ? 'API Not Configured' : 'Generate Image'}
          </Button>

          {/* Progress */}
          {isGenerating && (
            <GenerationProgress progress={generationProgress} />
          )}
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Images
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={generatedImages}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}