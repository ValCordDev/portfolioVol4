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

export interface Event {
  id?: string;
  date: string; // ISO string
  title: string;
  company?: string;
  logo?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const EVENTS_COLLECTION = 'events';

// Get all events
export async function getAllEvents(): Promise<Event[]> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        ...data
      } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
}

// Add a new event
export async function addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const now = Timestamp.now();
    
    // Remove undefined fields to avoid Firebase errors
    const cleanEvent: Record<string, string | Timestamp> = {
      date: event.date,
      title: event.title,
      createdAt: now,
      updatedAt: now
    };
    
    // Only add optional fields if they have values
    if (event.company) {
      cleanEvent.company = event.company;
    }
    if (event.logo) {
      cleanEvent.logo = event.logo;
    }
    
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), cleanEvent);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw new Error('Failed to add event');
  }
}

// Update an event
export async function updateEvent(id: string, event: Partial<Event>): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    
    // Remove undefined fields to avoid Firebase errors
    const updateData: Record<string, string | Timestamp> = {
      updatedAt: Timestamp.now()
    };
    
    // Only add fields that have values
    if (event.date) updateData.date = event.date;
    if (event.title) updateData.title = event.title;
    if (event.company) updateData.company = event.company;
    if (event.logo) updateData.logo = event.logo;
    
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
}

// Delete an event
export async function deleteEvent(id: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized');
    }
    
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}

// Convert Event to match your existing Event type
export function convertFirebaseEvent(firebaseEvent: Event): Event {
  return {
    date: firebaseEvent.date,
    title: firebaseEvent.title,
    company: firebaseEvent.company,
    logo: firebaseEvent.logo,
    id: firebaseEvent.id
  };
}