import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Dumbbell, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-brand-500" />
              <span className="font-bold text-xl text-gray-900 dark:text-white">FitTrack</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-brand-500 px-3 py-2 rounded-md font-medium">Dashboard</Link>
                <Link to="/workouts" className="text-gray-700 dark:text-gray-300 hover:text-brand-500 px-3 py-2 rounded-md font-medium">Workouts</Link>
                <Link to="/progress" className="text-gray-700 dark:text-gray-300 hover:text-brand-500 px-3 py-2 rounded-md font-medium">Progress</Link>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-500 px-3 py-2 rounded-md font-medium"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
             <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</Link>
                <Link to="/workouts" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700">Workouts</Link>
                <Link to="/progress" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700">Progress</Link>
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-gray-50 dark:hover:bg-gray-700">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
