import axios from 'axios';

// Define API URL - will be set from environment variables in production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
