// Firebase configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with fallbacks for build time
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fallback-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'fallback.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'fallback-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'fallback.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'fallback-app-id'
};

// Function to check if we have real Firebase config
function hasValidConfig(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'fallback-key' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'fallback-project'
  );
}

// Function to initialize Firebase
function initializeFirebaseApp() {
  if (typeof window === 'undefined') return null;
  if (!hasValidConfig()) {
    console.warn('Firebase: No valid configuration found. Using fallback mode.');
    return null;
  }

  try {
    // Check if app is already initialized
    if (getApps().length > 0) {
      return getApp();
    }
    
    // Initialize new app
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
}

// Initialize Firebase
const app = initializeFirebaseApp();

// Initialize services conditionally
let auth;
let db;

if (app) {
  try {
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase services initialization error:', error);
    auth = undefined;
    db = undefined;
  }
}

export { auth, db };
export default app;