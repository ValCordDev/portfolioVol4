/**
 * Migration script to move existing events from local data to Firebase
 * Run this script once to migrate your existing events to Firebase
 * 
 * To run this script:
 * 1. Make sure Firebase is configured with valid credentials in .env.local
 * 2. Run: npm run dev
 * 3. Navigate to /admin/migrate in your browser
 * 4. Click the migrate button
 */

'use client';

import { useState } from 'react';
import { events as localEvents } from '@/data/events';
import { addEvent } from '@/lib/events';

export default function MigratePage() {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [migratedCount, setMigratedCount] = useState(0);

  const handleMigrate = async () => {
    setStatus('migrating');
    setMessage('');
    setMigratedCount(0);

    try {
      let count = 0;
      for (const event of localEvents) {
        // Only include fields that have values to avoid undefined errors
        const eventData: { title: string; date: string; company?: string; logo?: string } = {
          title: event.title,
          date: event.date
        };
        
        if (event.company) {
          eventData.company = event.company;
        }
        if (event.logo) {
          eventData.logo = event.logo;
        }
        
        await addEvent(eventData);
        count++;
        setMigratedCount(count);
        setMessage(`Migrated ${count}/${localEvents.length} events...`);
      }
      
      setStatus('success');
      setMessage(`Successfully migrated ${count} events to Firebase!`);
    } catch (error) {
      setStatus('error');
      setMessage(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Data Migration</h1>
        
        <div className="bg-neutral-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Migrate Local Events to Firebase</h2>
          <p className="text-gray-400 mb-4">
            This will migrate {localEvents.length} events from your local data file to Firebase.
            Only run this once after setting up Firebase.
          </p>
          
          <div className="space-y-4">
            {status === 'idle' && (
              <button
                onClick={handleMigrate}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium"
              >
                Start Migration
              </button>
            )}
            
            {status === 'migrating' && (
              <div>
                <div className="bg-blue-500/10 border border-blue-500 text-blue-400 px-4 py-3 rounded-lg">
                  {message}
                </div>
                <div className="mt-2 text-gray-400">
                  Progress: {migratedCount}/{localEvents.length}
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Events to Migrate:</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localEvents.map((event, index) => (
              <div key={index} className="text-sm text-gray-400 border-l-2 border-gray-700 pl-3">
                <div className="font-medium text-white">{event.title}</div>
                <div>{new Date(event.date).toLocaleDateString()} - {event.company || 'No company'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/admin" className="text-yellow-400 hover:text-yellow-300">
            Go to Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}