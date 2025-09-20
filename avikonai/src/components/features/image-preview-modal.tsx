'use client';

import { useState } from 'react';
import { GeneratedImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Share2, Edit, Copy, Heart, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImagePreviewModalProps {
  image: GeneratedImage;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({ image, isOpen, onClose }: ImagePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleDownload = () => {
    addToast({
      type: 'success',
      title: 'Download Started',
      message: 'Your high-resolution image is being downloaded.'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my AI-generated profile picture!',
        text: `Generated with prompt: "${image.prompt}"`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Share link copied to clipboard.'
      });
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    addToast({
      type: 'success',
      title: 'Prompt Copied',
      message: 'Prompt copied to clipboard.'
    });
  };

  const handleLike = () => {
    addToast({
      type: 'success',
      title: 'Added to Favorites',
      message: 'Image saved to your favorites.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <Card className="relative w-full max-w-4xl mx-auto">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Image Preview</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download HD
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={handleLike}>
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Details & Editing */}
              <div className="space-y-4">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {[
                    { id: 'details', label: 'Details', icon: MessageSquare },
                    { id: 'edit', label: 'Edit', icon: Edit }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      {/* Prompt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prompt
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                            {image.prompt}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyPrompt}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Style
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                          {image.style}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Created
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {image.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Resolution
                          </label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            1024 × 1024
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'edit' && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Editing Tools Coming Soon
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Advanced editing features like background removal, style transfer, and enhancement tools will be available soon.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('details')}>
                          Back to Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}