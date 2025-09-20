'use client';

import { useState } from 'react';
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
import { sleep } from '@/lib/utils';

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

  const { addToast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast({
        type: 'error',
        title: 'Prompt Required',
        message: 'Please enter a description for your image.'
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate generation progress
      for (let i = 0; i <= 100; i += 10) {
        setGenerationProgress(i);
        await sleep(200);
      }

      // Create new mock image
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=512&h=512&fit=crop&crop=face',
        prompt: prompt,
        style: selectedStyle.name,
        timestamp: new Date(),
        isProcessing: false
      };

      setGeneratedImages(prev => [newImage, ...prev]);

      addToast({
        type: 'success',
        title: 'Image Generated!',
        message: 'Your AI profile picture has been created successfully.'
      });

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Generation Failed',
        message: 'Something went wrong. Please try again.'
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

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            isLoading={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
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