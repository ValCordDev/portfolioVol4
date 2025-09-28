'use client';

import { useState, useRef, useEffect } from 'react';
import { TrashIcon, PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { uploadMultipleImages, validateImageFile, generateAlbumId } from '@/lib/imageUpload';
import { addAlbum, updateAlbum, getNextAlbumIndex, Album } from '@/lib/albums';
import Image from 'next/image';

interface ImageUploadFormProps {
  album?: Album | null;
  onClose: () => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export default function ImageUploadForm({ album, onClose }: ImageUploadFormProps) {
  const [formData, setFormData] = useState({
    idx: 0,
    title: '',
    date: '',
    cover: '',
    images: [] as string[],
    description: '',
    client: '',
    location: '',
    category: '',
    featured: false
  });
  
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when album prop changes
  useEffect(() => {
    const initializeForm = async () => {
      if (album) {
        setFormData({
          idx: album.idx || 0,
          title: album.title || '',
          date: album.date || '',
          cover: album.cover || '',
          images: album.images || [],
          description: album.description || '',
          client: album.client || '',
          location: album.location || '',
          category: album.category || '',
          featured: album.featured || false
        });
      } else {
        try {
          const nextIdx = await getNextAlbumIndex();
          setFormData(prev => ({ ...prev, idx: nextIdx }));
        } catch (error) {
          console.error('Error getting next index:', error);
        }
      }
    };

    initializeForm();
  }, [album]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setError(`Some files were rejected:\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      const newUploadingFiles = validFiles.map(file => ({
        file,
        progress: 0
      }));
      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (uploadingFiles.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      // Generate album ID if creating new album
      const albumId = album?.id || generateAlbumId(formData.title || 'new-album');
      const files = uploadingFiles.map(uf => uf.file);

      const uploadedUrls = await uploadMultipleImages(
        files,
        albumId,
        (progress, fileIndex) => {
          setUploadingFiles(prev => prev.map((uf, index) => 
            index === fileIndex ? { ...uf, progress } : uf
          ));
        }
      );

      // Add uploaded URLs to form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        cover: prev.cover || uploadedUrls[0] // Set first image as cover if no cover set
      }));

      // Clear uploading files
      setUploadingFiles([]);
      
    } catch (error) {
      setError('Failed to upload images: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.images.length === 0) {
        throw new Error('At least one image is required');
      }

      const albumData = {
        idx: formData.idx,
        title: formData.title,
        date: formData.date,
        cover: formData.cover,
        images: formData.images,
        description: formData.description || undefined,
        client: formData.client || undefined,
        location: formData.location || undefined,
        category: formData.category || undefined,
        featured: formData.featured
      };

      if (album && album.id) {
        await updateAlbum(album.id, albumData);
      } else {
        await addAlbum(albumData);
      }

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save album');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-neutral-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {album ? 'Edit Album' : 'Create New Album'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Album Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="BMW 316D - Revamped"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="text"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="01. August, 2025"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="border border-neutral-700 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Images</h3>
            
            {/* File Upload */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>Select Images</span>
              </button>
            </div>

            {/* Uploading Files */}
            {uploadingFiles.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Pending Uploads</h4>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading...' : 'Upload All'}
                  </button>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadingFiles.map((uploadingFile, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-neutral-800 p-2 rounded">
                      <PhotoIcon className="w-6 h-6 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-white">{uploadingFile.file.name}</p>
                        <div className="w-full bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadingFile.progress}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadingFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Images */}
            {formData.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Album Images ({formData.images.length})</h4>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Album image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                      {formData.cover === imageUrl && (
                        <div className="absolute bottom-0 left-0 bg-yellow-500 text-black text-xs px-1 rounded-tr">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image URL *
            </label>
            <select
              value={formData.cover}
              onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">Select cover image</option>
              {formData.images.map((imageUrl, index) => (
                <option key={index} value={imageUrl}>
                  Image {index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-300 mb-2">
                Client (optional)
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="@username or Company Name"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category (optional)
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Automotive, Portrait, etc."
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="A brief description of this photo album..."
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-700 text-gray-300 rounded-lg hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : (album ? 'Update Album' : 'Create Album')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}