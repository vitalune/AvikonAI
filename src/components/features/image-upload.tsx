'use client';

import { useCallback, useState, useRef, DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile, formatFileSize } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
}

export function ImageUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = 'image/*'
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);

      // Validate and process files
      const validFiles = fileArray.filter((file) => {
        if (!validateImageFile(file)) {
          addToast({
            type: 'error',
            title: 'Invalid File',
            message: `${file.name} is not a valid image file.`
          });
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // Check total file count
      const totalFiles = files.length + validFiles.length;
      if (totalFiles > maxFiles) {
        addToast({
          type: 'error',
          title: 'Too Many Files',
          message: `You can only upload up to ${maxFiles} files.`
        });
        return;
      }

      // Create previews
      const newPreviews: string[] = [];
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === validFiles.length) {
              setPreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });

      // Update files
      onFilesChange([...files, ...validFiles]);

      if (validFiles.length > 0) {
        addToast({
          type: 'success',
          title: 'Files Uploaded',
          message: `${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded successfully.`
        });
      }
    },
    [files, maxFiles, addToast, onFilesChange]
  );

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200',
          isDragActive
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Upload className={cn(
              'w-6 h-6',
              isDragActive ? 'text-blue-600' : 'text-gray-400'
            )} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isDragActive ? 'Drop your images here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF up to {formatFileSize(maxSize)} • Max {maxFiles} file{maxFiles > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Uploaded Files ({files.length})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {/* Preview */}
                {previews[index] ? (
                  <Image
                    src={previews[index]}
                    alt={file.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="w-8 h-8 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}