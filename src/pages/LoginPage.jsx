import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(password);
    } catch (err) {
      console.error('Login submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-corndel-beige">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="AITaskLens Logo"
            className="w-16 h-16 mb-4"
            onError={(e) => {
              // Fallback if the logo image doesn't exist
              e.target.onerror = null;
              e.target.style.display = "none";
              document.getElementById("fallback-logo").style.display = "flex";
            }}
          />
          <div 
            id="fallback-logo" 
            className="w-16 h-16 bg-corndel-purple rounded-full flex items-center justify-center mb-4"
            style={{ display: "none" }}
          >
            <span className="text-white text-2xl font-bold">AI</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            AITaskLens
          </h2>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-corndel-purple focus:border-corndel-purple focus:z-10"
                placeholder="Enter password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 text-center">
              Enter the app password provided by your administrator
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
              ${isLoading || !password.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-800 hover:bg-indigo-900'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corndel-purple transition-colors`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-300" />
              </span>
              {isLoading ? 'Signing in...' : 'Log In'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;