import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Define API URL - will be set from environment variables in production
const API_URL = process.env.REACT_APP_API_URL || 'https://h3xw2v8987.execute-api.eu-west-2.amazonaws.com/prod';

// Create axios instance with default config
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
export const api = {
  // Auth
  login: async (password) => {
    try {
      const response = await instance.post('/auth', { password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  // Task Analysis
  analyzeTask: async (answers) => {
    try {
      const response = await instance.post('/analyze', { answers });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Analysis failed');
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const response = await instance.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('API service unavailable');
    }
  }
};

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Optional: Verify token with backend
          // For now, just consider having a token as authenticated
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // If token validation fails, clear it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to intended page after login
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      const from = location.state?.from || '/';
      navigate(from);
    }
  }, [isAuthenticated, location, navigate]);

  // Login function
  const login = async (password) => {
    try {
      setError(null);
      
      // Call the auth API endpoint
      const response = await api.login(password);
      
      if (response && response.success && response.token) {
        localStorage.setItem('token', response.token);
        setIsAuthenticated(true);
        
        // Navigate to home or intended page
        const from = location.state?.from?.pathname || '/';
        navigate(from);
        return true;
      } else {
        throw new Error(response?.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Clear error
  const clearError = () => setError(null);

  // Check if a route is protected
  const isProtectedRoute = (path) => {
    const publicRoutes = ['/login'];
    return !publicRoutes.includes(path);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    error,
    clearError,
    loading,
    isProtectedRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;