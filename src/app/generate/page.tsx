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
import { generateImageAPI, checkGeminiStatus } from '@/lib/api';
import { fileToBase64 } from '@/lib/gemini';
import { stylePresets } from '@/lib/mock-data';
import { motion } from 'framer-motion';

// Local gallery persistence helper
const GALLERY_STORAGE_KEY = 'app.images';

function saveImageToStorage(image: GeneratedImage) {
  if (typeof window === 'undefined') return;
  try {
    // Convert blob URL to data URL for storage
    fetch(image.blobUrl || image.url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const storedImage = {
              id: image.id,
              url: reader.result, // data URL
              prompt: image.prompt,
              style: image.style,
              timestamp: image.timestamp.toISOString(),
              isGenerated: true
            };
            
            const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
            const list = raw ? JSON.parse(raw) : [];
            localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify([storedImage, ...list]));
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch(console.error);
  } catch (e) {
    console.error('Failed to save image to localStorage', e);
  }
}

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
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
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

      // Save to localStorage immediately
      saveImageToStorage(newImage);

      setGeneratedImages(prev => [newImage, ...prev]);
      setGenerationProgress(100);

      addToast({
        type: 'success',
        title: 'Image Generated!',
        message: 'Your AI profile picture has been created and saved to your gallery.'
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
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 gradient-secondary rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 gradient-primary rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 relative"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          AI <span className="text-gradient-primary">Profile Picture</span> Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Create stunning, personalized profile pictures with advanced AI technology
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Left Column - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Prompt Input */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Describe Your Image</CardTitle>
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
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Choose Style</CardTitle>
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
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Reference Image (Optional)</CardTitle>
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
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
            <CardHeader>
              <CardTitle className="text-gradient-primary">Settings</CardTitle>
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
            className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-300 glow-hover font-semibold"
          >
            {isGenerating ? 'Generating...' : isGeminiConfigured === false ? 'API Not Configured' : 'Generate Image'}
          </Button>

          {/* Progress */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <GenerationProgress progress={generationProgress} />
            </motion.div>
          )}
        </motion.div>

        {/* Right Column - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-gradient-primary">Generated Images</span>
                <motion.span
                  key={generatedImages.length}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-normal text-gray-500 dark:text-gray-400"
                >
                  {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                </motion.span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={generatedImages}
                isGenerating={isGenerating}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}