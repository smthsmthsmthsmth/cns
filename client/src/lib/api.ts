import { useAuth } from '../contexts/AuthContext';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth headers
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

// Generic API call function with authentication
export const apiCall = async (
  endpoint: string, 
  options: RequestInit = {}, 
  token?: string
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check if body is FormData (for file uploads)
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    ...options,
    headers: {
      // Only set Content-Type for non-FormData requests
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  };

  // Add authorization header if token is provided
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message || errorData.error) {
          errorMessage = errorData.message || errorData.error;
        }
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authenticated API calls
export const authenticatedApiCall = async (
  endpoint: string, 
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return apiCall(endpoint, options, token);
};

// Specific API functions
export const loginUser = async (email: string, password: string) => {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async () => {
  return authenticatedApiCall('/api/auth/me');
};

// Helper function specifically for file uploads (optional, for clarity)
export const uploadFile = async (endpoint: string, formData: FormData) => {
  return authenticatedApiCall(endpoint, {
    method: 'POST',
    body: formData,
    // No Content-Type header - let browser set it automatically
  });
};