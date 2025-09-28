'use client';

import { useState, useRef, useCallback } from 'react';
import { PhotoIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { uploadMultipleImages, validateImageFile } from '@/lib/imageUpload';
import SafeImage from '@/components/SafeImage';

interface ImageDropZoneProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  albumTitle: string;
  disabled?: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export default function ImageDropZone({ images, onImagesChange, albumTitle, disabled = false }: ImageDropZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        alert(`${file.name}: ${validation.error}`);
      }
    }

    if (validFiles.length === 0) return;

    // Initialize uploading files
    const newUploadingFiles = validFiles.map(file => ({
      file,
      progress: 0
    }));
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      // Upload files
      const albumId = albumTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const uploadResults = await uploadMultipleImages(validFiles, albumId, (progress, fileIndex) => {
        setUploadingFiles(prev => 
          prev.map((uploadFile, index) => {
            const actualIndex = prev.length - validFiles.length + fileIndex;
            if (index === actualIndex) {
              return { ...uploadFile, progress };
            }
            return uploadFile;
          })
        );
      });

      // Update images list
      const newImageUrls = uploadResults.filter(url => url !== null) as string[];
      onImagesChange([...images, ...newImageUrls]);

      // Clear uploading files
      setUploadingFiles(prev => 
        prev.filter(uploadFile => !validFiles.includes(uploadFile.file))
      );

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Clear failed uploads
      setUploadingFiles(prev => 
        prev.filter(uploadFile => !validFiles.includes(uploadFile.file))
      );
    }
  }, [albumTitle, images, onImagesChange]);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, [disabled, handleFileUpload]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Adjust cover index if needed
    if (coverIndex >= newImages.length) {
      setCoverIndex(Math.max(0, newImages.length - 1));
    }
  };

  // Set cover image
  const setCoverImage = (index: number) => {
    setCoverIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-neutral-600 hover:border-neutral-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          {dragActive ? 'Drop images here' : 'Upload Album Images'}
        </h3>
        <p className="text-gray-400 text-sm">
          Drag and drop images here, or click to browse
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Supports JPEG, PNG, WebP up to 10MB each
        </p>
      </div>

      {/* Uploading Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Uploading...</h4>
          {uploadingFiles.map((uploadFile, index) => (
            <div key={index} className="bg-neutral-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300 truncate">
                  {uploadFile.file.name}
                </span>
                <span className="text-sm text-gray-400">
                  {Math.round(uploadFile.progress)}%
                </span>
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadFile.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">
            Album Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`relative group bg-neutral-800 rounded-lg overflow-hidden ${
                  index === coverIndex ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                <div className="aspect-square relative bg-neutral-800">
                  <SafeImage
                    src={image}
                    alt={`Album image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCoverImage(index)}
                      className={`p-2 rounded-full transition ${
                        index === coverIndex 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      title={index === coverIndex ? 'Cover Image' : 'Set as Cover'}
                    >
                      <PhotoIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition"
                      title="Remove Image"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Cover Badge */}
                {index === coverIndex && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {images.length === 0 && uploadingFiles.length === 0 && (
        <div className="text-center py-4">
          <PhotoIcon className="w-8 h-8 mx-auto text-gray-500 mb-2" />
          <p className="text-gray-400 text-sm">
            No images uploaded yet. Add some images to get started!
          </p>
        </div>
      )}
    </div>
  );
}