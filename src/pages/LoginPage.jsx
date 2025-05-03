import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock, AlertCircle, BrainCircuit } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-corndel-beige py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="mx-auto bg-white rounded-2xl w-24 h-24 flex items-center justify-center">
            <div className="h-16 w-16 bg-corndel-blue rounded-lg flex items-center justify-center text-white">
              <BrainCircuit size={42} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-corndel-blue">
            AITaskLens
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            AI-powered task analysis and classification
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
          >
            <AlertCircle className="mr-2 h-5 w-5 text-red-500 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-corndel-blue focus:border-corndel-blue focus:z-10"
                  placeholder="Enter password"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Demo password: "password"
              </p>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white 
              ${isLoading || !password.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-corndel-blue hover:bg-corndel-blue/90'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corndel-blue transition-colors`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className={`h-5 w-5 ${isLoading ? 'text-white/50' : 'text-corndel-blue/30'}`} />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>AITaskLens © 2025 - All rights reserved</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;