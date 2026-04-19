import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts, addWorkout, deleteWorkout, updateWorkout } from '../services/db';
import WorkoutCard from '../components/WorkoutCard';
import { PlusCircle, X } from 'lucide-react';

export default function Workouts() {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadWorkouts();
  }, [currentUser]);

  async function loadWorkouts() {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserWorkouts(currentUser.uid);
      setWorkouts(data);
    } catch (error) {
      console.error("Error loading workouts", error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateWorkout(editingId, formData);
      } else {
        await addWorkout(currentUser.uid, formData);
      }
      closeModal();
      loadWorkouts(); // Refresh list
    } catch (error) {
      console.error("Error saving workout", error);
      alert("Failed to save: " + error.message + "\n\n(Did you remember to start your Firestore Database in 'Test Mode'?)");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id);
        setWorkouts(workouts.filter(w => w.id !== id));
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  const openEditModal = (workout) => {
    setFormData({
      exercise: workout.exercise,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      date: workout.date
    });
    setEditingId(workout.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workout Log</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your exercises and sets</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Log Workout</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div></div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <DumbbellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No workouts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new workout log.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl relative border border-gray-200 dark:border-gray-700">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingId ? 'Edit Workout' : 'Log New Workout'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercise Name</label>
                <input required type="text" name="exercise" value={formData.exercise} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="e.g., Bench Press" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sets</label>
                  <input required type="number" name="sets" value={formData.sets} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reps</label>
                  <input required type="number" name="reps" value={formData.reps} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" min="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                  <input required type="number" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" min="0" step="0.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  {editingId ? 'Save Changes' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple helper icon for empty state
function DumbbellIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  )
}
