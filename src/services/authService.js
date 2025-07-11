import axios from 'axios';
import Cookies from 'js-cookie';
import { setAuth, isAuthenticated, checkTokenValidity, logout, initAuth } from '../utils/authUtils';

// Initialize axios instance
const api = axios.create({
    baseURL: 'https://easygo-api-production-d477.up.railway.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_header');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request headers:', config.headers); // Debug
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for 401 handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized request:', error.response.data);
            // Optionally clear token and redirect
            // logout();
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Login function
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.data && response.data.token) {
            setAuth(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Admin login function
export const adminLogin = async (email, password) => {
    try {
        const response = await api.post('/auth/admin-login', { email, password });
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
        if (response.data && response.data.token) {
            setAuth(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Forgot password function
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/password/forgot', { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// OTP validation function
export const validateOTP = async (email, otp) => {
    try {
        const response = await api.post('/auth/password/validate-otp', { email, otp });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Reset password function
export const resetPassword = async (email, otp, password, password_confirmation) => {
    try {
        const response = await api.post('/auth/password/reset', { email, otp, password, password_confirmation });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get current logged-in user
export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem("auth_header");
        if (!token || typeof token !== "string" || token.length < 10) {
            throw new Error("Invalid or missing auth token");
        }
        const response = await api.get('/auth/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return {
            userId: Number(response.data.user_id),
            data: response.data,
        };
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Export utility functions from authUtils
export { isAuthenticated, checkTokenValidity, logout, initAuth };

// Export axios instance
export default api;