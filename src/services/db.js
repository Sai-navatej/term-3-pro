import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

// Workout DB Functions
export const addWorkout = async (userId, workoutData) => {
  try {
    const docRef = await addDoc(collection(db, 'workouts'), {
      ...workoutData,
      userId,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding workout: ", error);
    throw error;
  }
};

export const getUserWorkouts = async (userId) => {
  try {
    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const workouts = [];
    querySnapshot.forEach((doc) => {
      workouts.push({ id: doc.id, ...doc.data() });
    });
    // Sort locally by date (descending) to avoid Firestore index requirement
    return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error getting workouts: ", error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    await deleteDoc(doc(db, 'workouts', workoutId));
  } catch (error) {
    console.error("Error deleting workout: ", error);
    throw error;
  }
};

export const updateWorkout = async (workoutId, updatedData) => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    await updateDoc(workoutRef, updatedData);
  } catch (error) {
    console.error("Error updating workout: ", error);
    throw error;
  }
};

// Progress DB Functions
export const logWeight = async (userId, weight, date) => {
  try {
    await addDoc(collection(db, 'progress'), {
      userId,
      weight: parseFloat(weight),
      date,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error logging weight: ", error);
    throw error;
  }
};

export const getUserProgress = async (userId) => {
  try {
    const q = query(
      collection(db, 'progress'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const progressLogs = [];
    querySnapshot.forEach((doc) => {
      progressLogs.push({ id: doc.id, ...doc.data() });
    });
    // Sort locally by date (ascending) to avoid Firestore index requirement
    return progressLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error("Error getting progress: ", error);
    throw error;
  }
};
