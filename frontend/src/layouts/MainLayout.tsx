import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Car, MapPin, Calendar, LayoutDashboard } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Vehicles', path: '/vehicles', icon: Car },
    { name: 'Find Parking', path: '/parking', icon: MapPin },
    { name: 'My Bookings', path: '/bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Car className="h-6 w-6" />
            <h1 className="text-xl font-bold">Smart Park</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Welcome, {user?.name || 'User'}
            </span>
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
