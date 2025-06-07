// authUtils.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Token expiration time (24 hours)
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

// Initialize axios instance
const api = axios.create({
  baseURL: 'http://easygo-api-production-d477.up.railway.app/api',
  withCredentials: true, // Always include credentials
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('auth_session');
};

// Check token validity
export const checkTokenValidity = () => {
  const authSession = Cookies.get('auth_session');
  
  if (authSession) {
    const tokenTimestamp = Cookies.get('auth_timestamp');
    
    if (tokenTimestamp) {
      const currentTime = new Date().getTime();
      const tokenTime = parseInt(tokenTimestamp);

      if (currentTime - tokenTime > TOKEN_EXPIRATION) {
        logout();
        return false;
      }
      return true;
    }
    return true;
  }
  
  return false;
};

// Set authentication data
export const setAuth = (token) => {
  Cookies.set('auth_session', 'true', { sameSite: 'lax', path: '/' });
  Cookies.set('auth_timestamp', new Date().getTime().toString(), { sameSite: 'lax', path: '/' });
  
  // Set authorization header for current session
  if (token) {
    localStorage.setItem('auth_header', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Initialize auth from stored data (call this on app startup)
export const initAuth = () => {
  const authSession = Cookies.get('auth_session');
  const storedToken = localStorage.getItem('auth_header');
  
  if (authSession && storedToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    return true;
  }
  
  return false;
};

// Remove authentication data
// src/utils/authUtils.js
export const logout = async () => {
    try {
        const token = localStorage.getItem('auth_header');
        if (token) {
            await api.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
    } finally {
        Cookies.remove('auth_session', { path: '/' });
        Cookies.remove('auth_timestamp', { path: '/' });
        localStorage.removeItem('auth_header');
        localStorage.removeItem('user_role');
        delete api.defaults.headers.common['Authorization'];
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/' && 
            window.location.pathname !== '/register-step-one' &&
            !window.location.pathname.includes('/forgot-password')) {
            window.location.href = '/login';
        }
    }
};
// Response interceptor to handle errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401 && isAuthenticated()) {
      logout();
    }
    return Promise.reject(error);
  }
);

// Validate token with backend
export const validateTokenWithBackend = async () => {
  if (!isAuthenticated()) return false;
  
  try {
    // Ensure Authorization header is set from localStorage
    const storedToken = localStorage.getItem('auth_header');
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    // Endpoint to validate token
    const response = await api.get('/auth/validate-token');
    return response.data.valid === true;
  } catch (error) {
    console.error('Token validation error:', error);
    logout();
    return false;
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Set client-side auth state
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// Register function
export const register = async (data) => {
  try {
    const response = await api.post('/auth/register', data);
    
    // Set client-side auth state
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

export default api;