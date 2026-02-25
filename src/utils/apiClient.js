/**
 * API Utility - Centralized API configuration and methods
 * This file manages all API calls with proper environment variable handling
 */

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export const apiCall = async (endpoint, options = {}) => {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'API Error',
        data: data,
      };
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.message === 'Failed to fetch' || error.message === 'NetworkError when attempting to fetch resource.') {
      throw {
        success: false,
        message: 'Network error. Make sure the backend is running.',
        original: error,
      };
    }
    
    throw {
      success: false,
      message: error.message || 'Connection error',
      original: error,
    };
  }
};

/**
 * Auth API Endpoints
 */
export const authApi = {
  signup: async (name, email, password) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiCall('/api/auth/logout', {
      method: 'POST',
    });
  },

  refreshToken: async (token) => {
    return apiCall('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

/**
 * Health check - useful for debugging
 */
export const healthCheck = async () => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
