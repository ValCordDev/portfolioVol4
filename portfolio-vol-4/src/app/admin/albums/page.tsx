'use client';

import { useState, useEffect, useCallback } from 'react';

import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { getAllAlbums, deleteAlbum, Album } from '@/lib/albums';
import { albums as fallbackAlbums } from '@/data/albums';
import Image from 'next/image';
import Link from 'next/link';
import AlbumForm from './AlbumForm';

export default function AlbumsAdmin() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [error, setError] = useState('');

  // Generate URL-friendly slug from album title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Parse date string to Date object for sorting
  const parseAlbumDate = (dateString: string): Date => {
    // Handle various date formats like "01. August, 2025", "2025-08-01", etc.
    const cleanDate = dateString.replace(/\./g, '').trim();
    const parsed = new Date(cleanDate);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAlbums = await getAllAlbums();
      // Sort by date (newest first)
      const sortedAlbums = [...fetchedAlbums].sort((a, b) => 
        parseAlbumDate(b.date).getTime() - parseAlbumDate(a.date).getTime()
      );
      setAlbums(sortedAlbums);
    } catch (error) {
      console.error('Failed to load albums from Firebase:', error);
      // Fallback to local albums if Firebase fails
      const sortedFallback = [...fallbackAlbums].sort((a, b) => 
        parseAlbumDate(b.date).getTime() - parseAlbumDate(a.date).getTime()
      );
      setAlbums(sortedFallback);
      setError('Using offline data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAlbum(id);
      await loadAlbums(); // Refresh the list
    } catch (error) {
      setError('Failed to delete album');
      console.error(error);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAlbum(null);
    loadAlbums(); // Refresh after form closes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading albums...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Albums</h2>
          <p className="text-gray-400 mt-1">Albums sorted by date (newest first)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Album</span>
        </button>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="flex items-center">
            <PhotoIcon className="w-6 h-6 text-blue-500" />
            <div className="ml-3">
              <p className="text-lg font-bold">{albums.length}</p>
              <p className="text-gray-400 text-sm">Total Albums</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="flex items-center">
            <StarIcon className="w-6 h-6 text-yellow-500" />
            <div className="ml-3">
              <p className="text-lg font-bold">
                {albums.filter(a => a.featured).length}
              </p>
              <p className="text-gray-400 text-sm">Featured</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="flex items-center">
            <PhotoIcon className="w-6 h-6 text-green-500" />
            <div className="ml-3">
              <p className="text-lg font-bold">
                {albums.reduce((total, album) => total + (album.images?.length || 0), 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Images</p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-900 rounded-xl p-4">
          <div className="flex items-center">
            <PhotoIcon className="w-6 h-6 text-purple-500" />
            <div className="ml-3">
              <p className="text-lg font-bold">
                {Math.round(albums.reduce((total, album) => total + (album.images?.length || 0), 0) / albums.length) || 0}
              </p>
              <p className="text-gray-400 text-sm">Avg per Album</p>
            </div>
          </div>
        </div>
      </div>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No albums found. Create your first album!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <div key={album.id || `album-${index}`} className="bg-neutral-900 rounded-xl overflow-hidden hover:bg-neutral-800 transition">
              {/* Album Cover */}
              <div className="relative h-48">
                <Image
                  src={album.cover}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
                {album.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1 rounded">
                    <StarIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {album.images?.length || 0} images
                </div>
              </div>

              {/* Album Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{album.title}</h3>
                    <p className="text-gray-400 text-sm">{album.date}</p>
                    {album.client && (
                      <p className="text-gray-500 text-xs mt-1">Client: {album.client}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 bg-neutral-800 px-2 py-1 rounded">
                    #{album.idx}
                  </span>
                </div>

                {album.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {album.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/album/${generateSlug(album.title)}`}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(album)}
                      className="p-1 text-gray-400 hover:text-yellow-400 transition"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(album.id!, album.title)}
                      className="p-1 text-gray-400 hover:text-red-400 transition"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Form Modal */}
      {showForm && (
        <AlbumForm
          album={editingAlbum}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}