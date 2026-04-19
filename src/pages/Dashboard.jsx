import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts } from '../services/db';
import { Activity, Calendar, Trophy } from 'lucide-react';
import WorkoutCard from '../components/WorkoutCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        try {
          const data = await getUserWorkouts(currentUser.uid);
          setWorkouts(data);
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [currentUser]);

  // Calculate simple stats
  const totalWorkouts = workouts.length;
  const recentWorkouts = workouts.slice(0, 3); // Get 3 most recent
  
  // Calculate streak (simple logic: workouts in the last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekCount = workouts.filter(w => new Date(w.date) >= oneWeekAgo).length;

  if (loading) {
    return <div className="flex justify-center mt-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your progress overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Workouts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkouts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">This Week</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{thisWeekCount} <span className="text-sm font-normal text-gray-500">sessions</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Consistency</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {thisWeekCount >= 3 ? "Great job!" : "Keep pushing!"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Workouts</h2>
          <Link to="/workouts" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 text-sm font-medium">
            View All
          </Link>
        </div>

        {recentWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorkouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't logged any workouts yet.</p>
            <Link to="/workouts" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              Log Your First Workout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
