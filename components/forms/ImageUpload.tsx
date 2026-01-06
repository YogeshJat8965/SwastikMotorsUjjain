'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface ImageUploadProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  // Single image mode props
  label?: string;
  onImageUpload?: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({
  images: imagesProp,
  onImagesChange,
  maxImages = 10,
  label,
  onImageUpload,
  currentImage,
}: ImageUploadProps) {
  // Support both multi-image and single-image mode
  const isSingleMode = onImageUpload !== undefined;
  const images = isSingleMode ? (currentImage ? [currentImage] : []) : (imagesProp || []);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image before upload
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob failed'));
            },
            'image/jpeg',
            0.85 // 85% quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload all images in parallel
      const uploadPromises = filesToUpload.map(async (file, index) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          return null;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum file size is 10MB`);
          return null;
        }

        try {
          // Compress image before upload
          const compressedBlob = await compressImage(file);
          const compressedFile = new File([compressedBlob], file.name, {
            type: 'image/jpeg',
          });

          const formData = new FormData();
          formData.append('file', compressedFile);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            return data.url;
          }
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
        }
        return null;
      });

      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.filter((url): url is string => url !== null);

      if (uploadedUrls.length > 0) {
        if (isSingleMode && onImageUpload) {
          // Single image mode - just call with first URL
          onImageUpload(uploadedUrls[0]);
        } else if (onImagesChange) {
          // Multi-image mode
          onImagesChange([...images, ...uploadedUrls]);
        }
      }
      
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = (index: number) => {
    if (isSingleMode && onImageUpload) {
      // Single image mode - clear the image
      onImageUpload('');
    } else if (onImagesChange) {
      // Multi-image mode
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${!isSingleMode && images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={!isSingleMode}
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={!isSingleMode && images.length >= maxImages}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">
              Uploading images... {uploadProgress !== null && `${uploadProgress}%`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {isSingleMode 
                  ? 'Upload 1 image • Max 10MB' 
                  : `${images.length}/${maxImages} images • Max 10MB per image`
                }
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={!isSingleMode && images.length >= maxImages}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  hover:bg-red-600"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              {!isSingleMode && index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
