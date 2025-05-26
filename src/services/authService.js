// src/services/authService.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { setAuth, isAuthenticated, checkTokenValidity, logout, initAuth } from '../utils/authUtils';

// Initialize axios instance
const api = axios.create({
    baseURL: 'https://easygo-api-production.up.railway.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

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

// Export utility functions from authUtils
export { isAuthenticated, checkTokenValidity, logout, initAuth };

export default api;