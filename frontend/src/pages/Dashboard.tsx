import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Car, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your smart parking activities.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <Link to="/vehicles" className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
              <Car className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">My Vehicles</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Add, view, and manage your registered vehicles.</p>
          <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 mt-auto">
            Manage Vehicles <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
        
        {/* Card 2 */}
        <Link to="/parking" className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Find Parking</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Locate available parking lots and book slots in advance.</p>
          <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400 mt-auto">
            Search Lots <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>

        {/* Card 3 */}
        <Link to="/bookings" className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">My Bookings</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">View your active and past parking reservations.</p>
          <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 mt-auto">
            View Bookings <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
