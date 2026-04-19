import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  const formattedDate = workout.date 
    ? format(new Date(workout.date), 'MMM dd, yyyy')
    : 'Unknown date';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 mb-4 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{workout.exercise}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          {onEdit && (
            <button 
              onClick={() => onEdit(workout)}
              className="text-gray-400 hover:text-brand-500 transition-colors p-1"
              title="Edit workout"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(workout.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete workout"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sets</span>
          <span className="font-semibold text-gray-900 dark:text-white">{workout.sets}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reps</span>
          <span className="font-semibold text-gray-900 dark:text-white">{workout.reps}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-center">
          <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weight</span>
          <span className="font-semibold text-gray-900 dark:text-white">{workout.weight} <span className="text-xs font-normal">kg</span></span>
        </div>
      </div>
    </div>
  );
}
