'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export default function FirebaseDebugInfo() {
  const [firebaseStatus, setFirebaseStatus] = useState({
    auth: false,
    db: false,
    storage: false,
    config: false
  });

  const { user, loading } = useAuth();

  useEffect(() => {
    // Check Firebase configuration
    const hasConfig = !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'fallback-key' &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'fallback-project'
    );

    setFirebaseStatus({
      auth: !!auth,
      db: !!db,
      storage: !!storage,
      config: hasConfig
    });
  }, []);

  return (
    <div className="bg-neutral-900 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">🔧 Firebase Debug Information</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <h4 className="font-medium">Service Status:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${firebaseStatus.config ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Configuration: {firebaseStatus.config ? 'Valid' : 'Invalid/Missing'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${firebaseStatus.auth ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Authentication: {firebaseStatus.auth ? 'Connected' : 'Not Connected'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${firebaseStatus.db ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Firestore: {firebaseStatus.db ? 'Connected' : 'Not Connected'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${firebaseStatus.storage ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Storage: {firebaseStatus.storage ? 'Connected' : 'Not Connected'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Authentication Status:</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>User: {loading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}</span>
            </div>
            {user && (
              <>
                <div className="text-gray-400">Email: {user.email}</div>
                <div className="text-gray-400">UID: {user.uid}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Environment Variables:</h4>
        <div className="grid grid-cols-1 gap-2 text-sm font-mono">
          <div className="flex justify-between">
            <span>FIREBASE_API_KEY:</span>
            <span className={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'text-green-400' : 'text-red-400'}>
              {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FIREBASE_PROJECT_ID:</span>
            <span className={process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'text-green-400' : 'text-red-400'}>
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FIREBASE_AUTH_DOMAIN:</span>
            <span className={process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'text-green-400' : 'text-red-400'}>
              {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>FIREBASE_STORAGE_BUCKET:</span>
            <span className={process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'text-green-400' : 'text-red-400'}>
              {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing'}
            </span>
          </div>
        </div>
      </div>

      {!firebaseStatus.config && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <h4 className="font-medium text-red-400 mb-2">⚠️ Configuration Issues Detected</h4>
          <p className="text-red-300 text-sm">
            Firebase environment variables are missing or invalid. Please ensure you have:
          </p>
          <ul className="text-red-300 text-sm mt-2 list-disc list-inside space-y-1">
            <li>Created a Firebase project at <a href="https://console.firebase.google.com" className="underline">console.firebase.google.com</a></li>
            <li>Added your environment variables to <code>.env.local</code> (for development)</li>
            <li>Configured environment variables on your hosting platform (for production)</li>
            <li>Enabled Authentication, Firestore, and Storage in your Firebase project</li>
          </ul>
        </div>
      )}

      {firebaseStatus.config && !user && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <h4 className="font-medium text-yellow-400 mb-2">🔑 Authentication Required</h4>
          <p className="text-yellow-300 text-sm">
            Firebase is configured but you&apos;re not authenticated. Please:
          </p>
          <ul className="text-yellow-300 text-sm mt-2 list-disc list-inside space-y-1">
            <li>Create a user account in Firebase Auth console</li>
            <li>Login through the admin login page</li>
            <li>Ensure your email is set as the admin email in environment variables</li>
          </ul>
        </div>
      )}
    </div>
  );
}