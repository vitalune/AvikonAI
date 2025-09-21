'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ImageGallery } from '@/components/features/image-gallery';
import type { GeneratedImage } from '@/types';
import { loadStoredImages } from '@/lib/storage/images';
import { Search, Filter, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [images, setImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    const list = loadStoredImages();
    setImages(list);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 gradient-secondary rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 gradient-primary rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 relative"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Image <span className="text-gradient-primary">Gallery</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Browse and manage your AI-generated profile pictures
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8 relative"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

            {/* Style filter */}
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="px-3 py-2 border border-teal-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
            </select>

            {/* View mode */}
            <div className="flex gap-1 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 p-0 transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'gradient-primary text-white glow-primary'
                    : 'hover:bg-teal-100 dark:hover:bg-gray-600 text-teal-600 dark:text-teal-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 p-0 transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'gradient-primary text-white glow-primary'
                    : 'hover:bg-teal-100 dark:hover:bg-gray-600 text-teal-600 dark:text-teal-400'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative"
      >
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 glow-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-gradient-primary">Images</span>
              <motion.span
                key={images.length}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-normal text-gray-500 dark:text-gray-400"
              >
                {images.length} image{images.length !== 1 ? 's' : ''}
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 glow-primary">
                  <Filter className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No images found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Generate or edit an image to see it here.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ImageGallery images={images} />
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}