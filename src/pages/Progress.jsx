import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts } from '../services/db';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Progress() {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, [currentUser]);

  async function loadWorkouts() {
    if (!currentUser) return;
    try {
      // Fetch all workouts
      const data = await getUserWorkouts(currentUser.uid);
      setWorkouts(data);
      
      // Automatically select the first unique exercise if available
      const uniqueExercises = [...new Set(data.map(w => w.exercise.toLowerCase().trim()))];
      if (uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
    } catch (error) {
      console.error("Error loading workouts for progress", error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique exercises for the dropdown
  const uniqueExercises = [...new Set(workouts.map(w => w.exercise.toLowerCase().trim()))];

  // Filter and format data for the selected exercise
  const chartData = workouts
    .filter(w => w.exercise.toLowerCase().trim() === selectedExercise)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ascending for chart
    .map(entry => ({
      ...entry,
      displayDate: format(new Date(entry.date), 'MMM dd'),
      weight: parseFloat(entry.weight) // Ensure weight is a number
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lift Progression</h1>
        <p className="text-gray-600 dark:text-gray-400">Track how much weight you are lifting over time</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div>
          </div>
        ) : uniqueExercises.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
                Progress for: 
              </h2>
              <select 
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white capitalize focus:ring-brand-500 focus:border-brand-500"
              >
                {uniqueExercises.map(ex => (
                  <option key={ex} value={ex} className="capitalize">{ex}</option>
                ))}
              </select>
            </div>

            <div className="h-80 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="displayDate" stroke="#6B7280" />
                    <YAxis domain={['auto', 'auto']} stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                      itemStyle={{ color: '#0ea5e9' }}
                      labelStyle={{ color: '#9CA3AF' }}
                      formatter={(value) => [`${value} kg`, 'Weight Lifted']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#0ea5e9" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: '#0ea5e9' }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Not enough data for this exercise.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium text-gray-900 dark:text-white">No Workouts Found</p>
            <p className="mt-2 text-center">Head over to the Workouts tab and log some exercises<br/>to see your progression charts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
