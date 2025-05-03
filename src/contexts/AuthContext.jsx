import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { api } from '../services/api';

// Create context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (password) => {
    try {
      setError(null);
      
      // For now, simple password check - this will be replaced with API call
      if (password === 'password') {
        // Mock token
        const token = 'mock-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        navigate('/');
        return true;
      } else {
        throw new Error('Invalid password');
      }
      
      // This will be implemented later
      // const response = await api.login(password);
      // localStorage.setItem('token', response.token);
      // setIsAuthenticated(true);
      // navigate('/');
      // return true;
    } catch (err) {
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

  const value = {
    isAuthenticated,
    login,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
