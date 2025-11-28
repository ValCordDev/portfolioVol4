import { db } from "@/lib/firebase";
import { collection, getDocs, setDoc, deleteDoc, doc } from "firebase/firestore";

export interface Availability {
  date: string; // YYYY-MM-DD (also used as doc id)
  startTime?: string; // "08:00"
  endTime?: string;   // "17:00"
  location?: string;
}

const col = collection(db, "availability");

export const getAllAvailability = async (): Promise<Availability[]> => {
  try {
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => {
      const data = d.data() as Partial<Availability>;
      return {
        date: d.id,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
      } as Availability;
    });
  } catch (err) {
    console.error("getAllAvailability error:", err);
    return [];
  }
};

/**
 * Add or update availability.
 * Accepts either a date string (YYYY-MM-DD) or an Availability object.
 * Removes undefined fields before calling setDoc (Firestore forbids undefined).
 */
export const addAvailableDate = async (availability: Availability | string): Promise<void> => {
  try {
    if (typeof availability === "string") {
      const date = availability;
      // write minimal doc with just the date (no undefined fields)
      await setDoc(doc(db, "availability", date), {});
      return;
    }

    const { date, startTime, endTime, location } = availability;
    const payload: Partial<Availability> = {};

    if (startTime !== undefined && startTime !== null && startTime !== "") {
      payload.startTime = startTime;
    }
    if (endTime !== undefined && endTime !== null && endTime !== "") {
      payload.endTime = endTime;
    }
    if (location !== undefined && location !== null && location !== "") {
      payload.location = location;
    }

    // setDoc with typed payload (doc id is the date)
    await setDoc(doc(db, "availability", date), payload);
  } catch (err) {
    console.error("addAvailableDate error:", err);
    throw err;
  }
};

export const removeAvailableDate = async (date: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "availability", date));
  } catch (err) {
    console.error("removeAvailableDate error:", err);
    throw err;
  }
};
