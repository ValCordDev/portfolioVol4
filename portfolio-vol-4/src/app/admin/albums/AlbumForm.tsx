'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { addAlbum, updateAlbum, getNextAlbumIndex, Album } from '@/lib/albums';
import ImageDropZone from './ImageDropZone';

interface AlbumFormProps {
  album?: Album | null;
  onClose: () => void;
}

export default function AlbumForm({ album, onClose }: AlbumFormProps) {
  const [formData, setFormData] = useState({
    idx: 0,
    title: '',
    date: '',
    cover: '',
    images: [''],
    description: '',
    client: '',
    location: '',
    category: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeForm = async () => {
      if (album) {
        setFormData({
          idx: album.idx || 0,
          title: album.title || '',
          date: album.date || '',
          cover: album.cover || '',
          images: album.images || [''],
          description: album.description || '',
          client: album.client || '',
          location: album.location || '',
          category: album.category || '',
          featured: album.featured || false
        });
      } else {
        // For new albums, get the next available index
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      
      if (filteredImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const albumData = {
        idx: formData.idx,
        title: formData.title,
        date: formData.date,
        cover: formData.cover,
        images: filteredImages,
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

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleImagesFromUpload = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-neutral-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {album ? 'Edit Album' : 'Add New Album'}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="idx" className="block text-sm font-medium text-gray-300 mb-2">
                Index Position *
              </label>
              <input
                type="number"
                id="idx"
                name="idx"
                required
                min="1"
                value={formData.idx}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-yellow-500 bg-neutral-800 border-neutral-700 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-300">Featured Album</span>
              </label>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location (optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Oslo, Norway"
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
            <label htmlFor="cover" className="block text-sm font-medium text-gray-300 mb-2">
              Cover Image URL *
            </label>
            <input
              type="text"
              id="cover"
              name="cover"
              required
              value={formData.cover}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="/album/cover-image.jpg"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Album Images * (at least 1 required)
            </label>
            
                        <ImageDropZone
              images={formData.images.filter(img => img.trim() !== '')}
              onImagesChange={handleImagesFromUpload}
              albumTitle={formData.title || 'New Album'}
            />
            
            {/* Manual URL input fallback */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-400">
                  Manual URL Input (optional)
                </label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400 text-xs"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>Add URL</span>
                </button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {formData.images.filter(img => img.trim() !== '').map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="flex-1 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 text-xs"
                      placeholder={`/album/folder/image-${index + 1}.jpg`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
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
              disabled={loading}
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