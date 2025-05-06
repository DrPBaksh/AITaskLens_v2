import axios from 'axios';

// Define API URL - will be set from environment variables in production
// Update this with your actual API Gateway URL
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

// Helper function to extract JSON from the error message if possible
const extractJsonFromErrorMessage = (errorMessage) => {
  try {
    // Check for JSON pattern with backticks and language identifier
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = errorMessage.match(jsonRegex);
    
    if (match && match[1]) {
      const jsonContent = match[1].trim();
      // Parse the extracted JSON
      const jsonData = JSON.parse(jsonContent);
      
      // Add unique ID if not present
      return {
        success: true,
        result: {
          ...jsonData,
          id: jsonData.id || `analysis-${Date.now()}` 
        }
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to extract JSON from error message:', e);
    return null;
  }
};

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
  analyzeTask: async (data) => {
    try {
      const response = await instance.post('/analyze', data);
      return response.data;
    } catch (error) {
      console.log('Analysis error:', error);
      
      // Check response data for error with JSON content in the message
      if (error.response?.data?.message && 
          error.response.data.message.includes('Failed to parse JSON response:')) {
        
        // Try to extract JSON from the error message
        const extractedData = extractJsonFromErrorMessage(error.response.data.message);
        if (extractedData) {
          console.log('Successfully extracted data from error message', extractedData);
          return extractedData;
        }
      }
      
      // If extraction failed or it's a different error, throw
      throw new Error(error.response?.data?.message || error.message || 'Analysis failed');
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

export default api;