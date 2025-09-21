/**
 * API service for handling backend requests
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Define base URL for API requests  
const BASE_URL = process.env.VITE_API_URL || 'http://localhost:8081/api/v1';

// Track in-flight requests to prevent duplicates
const inFlightRequests = new Map<string, Promise<any>>();

/**
 * Generates a unique key for caching based on the request
 */
const generateRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method || 'get'}-${config.url}-${JSON.stringify(config.params || {})}`;
};

/**
 * Axios instance configured for API requests
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to prevent duplicate requests
api.interceptors.request.use((config) => {
  const requestKey = generateRequestKey(config);
  
  // If this request is already in-flight, cancel the new one
  if (inFlightRequests.has(requestKey) && config.method?.toLowerCase() === 'get') {
    console.log(`Preventing duplicate request: ${requestKey}`);
    // Return existing promise for this request
    return {
      ...config,
      // Flag this as a canceled request that should use the existing promise
      adapter: () => inFlightRequests.get(requestKey)
    };
  }
  
  return config;
});

// Response interceptor for error handling and cache management
api.interceptors.response.use(
  (response) => {
    try {
      // Clear the request from in-flight on success
      const requestKey = generateRequestKey(response.config);
      inFlightRequests.delete(requestKey);
    } catch (err) {
      console.warn("Error cleaning up request cache:", err);
    }
    return response;
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      // Request was canceled, typically means duplicate was prevented
      console.log('Request canceled due to duplicate:', error.message);
      return Promise.reject(error);
    }
    
    // Clear the request from in-flight on error
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      inFlightRequests.delete(requestKey);
    }
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of 2xx range
      if (error.response.status === 401) {
        // Handle unauthorized / token expired
        localStorage.removeItem('authToken');
        // You might want to redirect to login here or refresh token
      }
      
      const errorMessage = error.response.data?.message || error.response.statusText;
      console.error(`API Error (${error.response.status}): ${errorMessage}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Adds authentication token to requests
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

/**
 * Initializes token from localStorage if available
 */
const token = localStorage.getItem('authToken');
if (token) {
  setAuthToken(token);
}

export default api;