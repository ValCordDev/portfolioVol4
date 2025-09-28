import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

// Upload a single image to Firebase Storage
export async function uploadImage(
  file: File, 
  albumId: string, 
  fileName?: string
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  try {
    // Generate filename if not provided
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    
    // Create reference to storage location
    const imageRef = ref(storage, `albums/${albumId}/${finalFileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

// Upload multiple images
export async function uploadMultipleImages(
  files: File[], 
  albumId: string,
  onProgress?: (progress: number, fileIndex: number) => void
): Promise<string[]> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  const uploadPromises = files.map(async (file, index) => {
    try {
      const url = await uploadImage(file, albumId);
      onProgress?.(100, index);
      return url;
    } catch (error) {
      console.error(`Error uploading file ${index}:`, error);
      onProgress?.(0, index);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
}

// Delete an image from Firebase Storage
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  try {
    // Extract the path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for delete operations as it might not be critical
  }
}

// Generate a unique album ID
export function generateAlbumId(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
  
  const timestamp = Date.now();
  return `${cleanTitle}-${timestamp}`;
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File size too large. Maximum size is 10MB.' 
    };
  }

  return { valid: true };
}

// Resize image before upload (optional utility)
export function resizeImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}