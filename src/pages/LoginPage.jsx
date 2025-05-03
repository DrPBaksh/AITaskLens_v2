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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mb-4">
            <BrainCircuit size={36} className="text-white" />
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
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:z-10"
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
            <p className="mt-2 text-xs text-gray-500">
              Enter the app password provided by your administrator
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
              ${isLoading || !password.trim() ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-purple-200" />
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