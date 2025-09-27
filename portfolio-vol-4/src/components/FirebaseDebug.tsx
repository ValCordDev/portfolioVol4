'use client';

import { auth, db } from '@/lib/firebase';

export default function FirebaseDebug() {
  const firebaseStatus = {
    hasAuth: !!auth,
    hasDB: !!db,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
    isBrowser: typeof window !== 'undefined'
  };

  return (
    <div className="bg-neutral-800 p-4 rounded-lg text-xs text-gray-300 mt-4">
      <h3 className="font-semibold text-white mb-2">Firebase Debug Info:</h3>
      <div className="space-y-1">
        <div>Auth initialized: {firebaseStatus.hasAuth ? '✅' : '❌'}</div>
        <div>Database initialized: {firebaseStatus.hasDB ? '✅' : '❌'}</div>
        <div>Is browser: {firebaseStatus.isBrowser ? '✅' : '❌'}</div>
        <div>API Key: {firebaseStatus.apiKey}</div>
        <div>Auth Domain: {firebaseStatus.authDomain}</div>
        <div>Project ID: {firebaseStatus.projectId}</div>
      </div>
    </div>
  );
}