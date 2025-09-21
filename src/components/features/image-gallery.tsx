'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GeneratedImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Share2, Edit, Trash2, ZoomIn } from 'lucide-react';
import { ImagePreviewModal } from './image-preview-modal';
import { useToast } from '@/hooks/use-toast';

interface ImageGalleryProps {
  images: GeneratedImage[];
  isGenerating?: boolean;
}

export function ImageGallery({ images, isGenerating }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const { addToast } = useToast();

  const handleDownload = async (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // Get image source (blob URL or data URL)
      const imageSource = image.blobUrl || image.url;

      // Fetch the image
      const response = await fetch(imageSource);
      const blob = await response.blob();

      // Create a download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `avikonai-${image.id}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(downloadUrl);

      addToast({
        type: 'success',
        title: 'Download Complete',
        message: 'Your HD image has been downloaded successfully.'
      });
    } catch (error) {
      console.error('Download failed:', error);
      addToast({
        type: 'error',
        title: 'Download Failed',
        message: 'Unable to download the image. Please try again.'
      });
    }
  };

  const handleShare = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();

    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Check out my AI-generated profile picture!',
        text: `Generated with prompt: ${image.prompt}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Share link copied to clipboard.'
      });
    }
  };

  const handleEdit = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();

    // Mock edit functionality
    addToast({
      type: 'info',
      title: 'Edit Feature',
      message: 'Image editing feature coming soon!'
    });
  };

  const handleDelete = (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();

    // Mock delete functionality
    addToast({
      type: 'success',
      title: 'Image Deleted',
      message: 'Image has been removed from your gallery.'
    });
  };

  if (images.length === 0 && !isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <ZoomIn className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No images generated yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Enter a prompt and click &quot;Generate Image&quot; to create your first AI profile picture.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Loading placeholder */}
        {isGenerating && (
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generating...</p>
            </div>
          </div>
        )}

        {/* Generated images */}
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={image.prompt}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              unoptimized
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200">
              {/* Action buttons */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => handleDownload(image, e)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => handleShare(image, e)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
                  onClick={(e) => handleEdit(image, e)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="w-8 h-8 p-0 bg-red-500/90 hover:bg-red-500 text-white"
                  onClick={(e) => handleDelete(image, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-white text-sm font-medium truncate mb-1">
                  {image.style}
                </p>
                <p className="text-white/80 text-xs truncate">
                  {image.prompt}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {image.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Processing indicator */}
            {image.isProcessing && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Processing...</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}