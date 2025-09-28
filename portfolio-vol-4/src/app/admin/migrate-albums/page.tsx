/**
 * Album Migration Script
 * Migrates existing albums from local data to Firebase
 * 
 * To run this migration:
 * 1. Make sure Firebase is configured with valid credentials
 * 2. Navigate to /admin/migrate-albums
 * 3. Review the albums to be migrated
 * 4. Click "Start Migration"
 */

'use client';

import { useState } from 'react';
import { albums as localAlbums } from '@/data/albums';
import { addAlbum, type Album } from '@/lib/albums';
import Link from 'next/link';
import FirebaseDebugInfo from '@/components/FirebaseDebugInfo';

export default function AlbumMigrationPage() {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [migratedCount, setMigratedCount] = useState(0);
  const [migratedAlbums, setMigratedAlbums] = useState<string[]>([]);

  const handleMigrate = async () => {
    setStatus('migrating');
    setMessage('');
    setMigratedCount(0);
    setMigratedAlbums([]);

    try {
      let count = 0;
      const successful: string[] = [];

      for (const album of localAlbums) {
        try {
          // Only include fields that have values to avoid undefined errors
          const albumData: Omit<Album, 'id'> = {
            idx: album.idx,
            title: album.title,
            date: album.date,
            cover: album.cover,
            images: album.images
          };

          await addAlbum(albumData);
          count++;
          successful.push(album.title);
          setMigratedCount(count);
          setMigratedAlbums([...successful]);
          setMessage(`Migrated ${count}/${localAlbums.length} albums...`);
          
          // Add a small delay to prevent overwhelming Firebase
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to migrate album "${album.title}":`, error);
          setMessage(`Warning: Failed to migrate "${album.title}". Continuing with others...`);
        }
      }
      
      setStatus('success');
      setMessage(`Successfully migrated ${count}/${localAlbums.length} albums to Firebase!`);
    } catch (error) {
      setStatus('error');
      setMessage(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const totalImages = localAlbums.reduce((total, album) => total + album.images.length, 0);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/admin"
            className="text-yellow-400 hover:text-yellow-300 text-sm"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Album Migration</h1>
        
        {/* Firebase Debug Info */}
        <FirebaseDebugInfo />
        
        <div className="bg-neutral-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Migrate Local Albums to Firebase</h2>
          <p className="text-gray-400 mb-6">
            This will migrate <strong>{localAlbums.length} albums</strong> with{' '}
            <strong>{totalImages} total images</strong> from your local data file to Firebase.
            Only run this once after setting up Firebase.
          </p>

          {/* Migration Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{localAlbums.length}</div>
              <div className="text-sm text-gray-400">Albums to Migrate</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{totalImages}</div>
              <div className="text-sm text-gray-400">Total Images</div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(totalImages / localAlbums.length)}
              </div>
              <div className="text-sm text-gray-400">Avg Images/Album</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {status === 'idle' && (
              <button
                onClick={handleMigrate}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium"
              >
                Start Album Migration
              </button>
            )}
            
            {status === 'migrating' && (
              <div>
                <div className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg mb-4">
                  {message}
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{migratedCount}/{localAlbums.length}</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(migratedCount / localAlbums.length) * 100}%` }}
                    />
                  </div>
                  {migratedAlbums.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Recently migrated:</p>
                      <p className="text-sm text-green-400">
                        {migratedAlbums.slice(-3).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div>
                <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
                  {message}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Successfully migrated albums:</h4>
                  <div className="bg-neutral-800 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <ul className="text-sm text-gray-300 space-y-1">
                      {migratedAlbums.map((albumTitle, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="text-green-400">✓</span>
                          <span>{albumTitle}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Albums Preview */}
        <div className="bg-neutral-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Albums to Migrate:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {localAlbums.map((album, index) => (
              <div key={index} className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center text-sm font-bold">
                    #{album.idx}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{album.title}</h4>
                    <p className="text-sm text-gray-400">{album.date}</p>
                    <p className="text-xs text-gray-500">
                      {album.images.length} images • Cover: {album.cover.split('/').pop()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <Link 
            href="/admin" 
            className="text-yellow-400 hover:text-yellow-300"
          >
            ← Go to Admin Dashboard
          </Link>
          {status === 'success' && (
            <Link 
              href="/admin" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium"
            >
              Manage Albums →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}