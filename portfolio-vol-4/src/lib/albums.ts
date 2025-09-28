import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Album {
  id?: string;
  idx: number;
  title: string;
  date: string;
  cover: string;
  images: string[];
  description?: string;
  client?: string;
  location?: string;
  category?: string;
  featured?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const ALBUMS_COLLECTION = 'albums';

// Get all albums
export async function getAllAlbums(): Promise<Album[]> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const q = query(collection(db, ALBUMS_COLLECTION), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const albums: Album[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      albums.push({
        id: doc.id,
        ...data
      } as Album);
    });
    
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw new Error('Failed to fetch albums');
  }
}

// Get album by ID
export async function getAlbumById(id: string): Promise<Album | null> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const albums = await getAllAlbums();
    return albums.find(album => album.id === id) || null;
  } catch (error) {
    console.error('Error fetching album:', error);
    return null;
  }
}

// Add a new album
export async function addAlbum(album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase Firestore not initialized. Please check your Firebase configuration and ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set correctly.');
    }
    
    // Validate required fields
    if (!album.title?.trim()) {
      throw new Error('Album title is required');
    }
    if (!album.date?.trim()) {
      throw new Error('Album date is required');
    }
    if (!album.cover?.trim()) {
      throw new Error('Album cover image is required');
    }
    if (!album.images || album.images.length === 0) {
      throw new Error('Album must have at least one image');
    }
    
    console.log(`📝 Adding album "${album.title}" to Firestore...`);
    
    const now = Timestamp.now();
    
    // Remove undefined fields to avoid Firebase errors
    const cleanAlbum: Record<string, string | number | boolean | string[] | Timestamp> = {
      idx: album.idx || 0,
      title: album.title.trim(),
      date: album.date.trim(),
      cover: album.cover.trim(),
      images: album.images.filter(img => img?.trim()),
      createdAt: now,
      updatedAt: now
    };
    
    // Only add optional fields if they have values
    if (album.description?.trim()) cleanAlbum.description = album.description.trim();
    if (album.client?.trim()) cleanAlbum.client = album.client.trim();
    if (album.location?.trim()) cleanAlbum.location = album.location.trim();
    if (album.category?.trim()) cleanAlbum.category = album.category.trim();
    if (album.featured !== undefined) cleanAlbum.featured = album.featured;
    
    console.log(`🔄 Uploading album data to Firebase...`, cleanAlbum);
    
    const docRef = await addDoc(collection(db, ALBUMS_COLLECTION), cleanAlbum);
    console.log(`✅ Album "${album.title}" added successfully with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error: unknown) {
    console.error(`❌ Error adding album "${album.title}":`, error);
    
    // Provide more specific error messages based on the error type
    const errorObj = error as { code?: string; message?: string };
    
    if (errorObj.code === 'permission-denied') {
      throw new Error(`Permission denied: Please ensure you're authenticated and have admin permissions. Check your Firebase security rules.`);
    } else if (errorObj.code === 'failed-precondition') {
      throw new Error(`Firebase configuration issue: ${errorObj.message || 'Unknown configuration error'}`);
    } else if (errorObj.code === 'unavailable') {
      throw new Error(`Firebase service unavailable. Please check your internet connection and Firebase project status.`);
    } else if (errorObj.message?.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to Firebase. Please check your internet connection.`);
    } else if (errorObj.message?.includes('not initialized')) {
      throw new Error(`Firebase not initialized: ${errorObj.message}`);
    } else {
      const message = errorObj.message || (error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`Failed to add album "${album.title}": ${message}`);
    }
  }
}

// Update an album
export async function updateAlbum(id: string, album: Partial<Album>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const albumRef = doc(db, ALBUMS_COLLECTION, id);
    
    // Remove undefined fields to avoid Firebase errors
    const updateData: Record<string, string | number | boolean | string[] | Timestamp> = {
      updatedAt: Timestamp.now()
    };
    
    // Only add fields that have values
    if (album.idx !== undefined) updateData.idx = album.idx;
    if (album.title) updateData.title = album.title;
    if (album.date) updateData.date = album.date;
    if (album.cover) updateData.cover = album.cover;
    if (album.images) updateData.images = album.images;
    if (album.description) updateData.description = album.description;
    if (album.client) updateData.client = album.client;
    if (album.location) updateData.location = album.location;
    if (album.category) updateData.category = album.category;
    if (album.featured !== undefined) updateData.featured = album.featured;
    
    await updateDoc(albumRef, updateData);
  } catch (error) {
    console.error('Error updating album:', error);
    throw new Error('Failed to update album');
  }
}

// Delete an album
export async function deleteAlbum(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const albumRef = doc(db, ALBUMS_COLLECTION, id);
    await deleteDoc(albumRef);
  } catch (error) {
    console.error('Error deleting album:', error);
    throw new Error('Failed to delete album');
  }
}

// Get next available index for new album
export async function getNextAlbumIndex(): Promise<number> {
  try {
    const albums = await getAllAlbums();
    if (albums.length === 0) return 1;
    
    const maxIdx = Math.max(...albums.map(album => album.idx || 0));
    return maxIdx + 1;
  } catch (error) {
    console.error('Error getting next album index:', error);
    return 1;
  }
}