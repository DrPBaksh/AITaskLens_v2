import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, Menu, X, LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/examples', icon: FileText, label: 'Examples' },
    { path: '/disclaimer', icon: AlertTriangle, label: 'Disclaimer' },
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop - more compact */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl z-10">
        <div className="p-4 border-b border-gray-100 flex flex-col items-center">
          <div className="h-14 w-14 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="AI Task Lens Logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = "none";
                document.getElementById("fallback-logo-desktop").style.display = "flex";
              }}
            />
            <div 
              id="fallback-logo-desktop" 
              className="h-12 w-12 bg-indigo-800 rounded-lg flex items-center justify-center text-white"
              style={{ display: "none" }}
            >
              <span className="text-lg font-bold">AI</span>
            </div>
          </div>
          <h1 className="mt-2 text-base font-bold text-gray-800 text-center">
            AI Task Lens
          </h1>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-indigo-900 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-900 hover:translate-x-1'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-white' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center px-4 py-2 w-full text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="font-medium">Logout</span>
          </motion.button>
          
          {/* Copyright notice */}
          <div className="mt-4 text-center text-xs text-gray-400">
            © PeterBaksh 2025
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMenu}
          className="bg-indigo-900 text-white p-4 rounded-full shadow-lg"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-800 bg-opacity-50 md:hidden z-40 backdrop-blur-sm"
          onClick={toggleMenu}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-72 bg-white shadow-2xl p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="h-14 w-14 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="AI Task Lens Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    e.target.style.display = "none";
                    document.getElementById("fallback-logo-mobile").style.display = "flex";
                  }}
                />
                <div 
                  id="fallback-logo-mobile" 
                  className="h-12 w-12 bg-indigo-800 rounded-lg flex items-center justify-center text-white"
                  style={{ display: "none" }}
                >
                  <span className="text-lg font-bold">AI</span>
                </div>
              </div>
              <h1 className="mt-2 text-xl font-bold text-gray-800">AI Task Lens</h1>
              <button 
                onClick={toggleMenu}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <nav className="mb-6">
              <ul className="space-y-1">
                {navItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-indigo-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-900'
                      }`}
                      onClick={toggleMenu}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-white' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile logout */}
            <div className="mt-auto">  
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex items-center px-4 py-3 w-full text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Logout</span>
              </motion.button>
              
              {/* Copyright notice for mobile */}
              <div className="mt-6 text-center text-xs text-gray-400">
                © AI Task Lens 2025
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
        
        {/* Footer copyright for main content area on mobile */}
        <div className="mt-12 text-center text-xs text-gray-400 md:hidden">
          © AI Task Lens 2025
        </div>
      </main>
    </div>
  );
};

export default Layout;