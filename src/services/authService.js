import axios from 'axios';
import { setAuth } from '../utils/authUtils';

// inisiasi API URL
const Login_API_URL = 'http://localhost:8000/api/auth/login'; 
const Register_API_URL = 'http://localhost:8000/api/auth/register';
const ForgotPassword_API_URL = 'http://localhost:8000/api/auth/password/forgot';
const validateOTP_API_URL = 'http://localhost:8000/api/auth/password/validate-otp';
const ResetPassword_API_URL = 'http://localhost:8000/api/auth/password/reset';

// fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(Login_API_URL, { email, password });
    
    // Store token with timestamp
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk register
export const register = async (data) => {
  try {
    const response = await axios.post(Register_API_URL, data);
    
    // simpan token jika otomatis login setelah register
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk mengirim email untuk reset password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(ForgotPassword_API_URL, { email });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk validasi OTP
export const validateOTP = async (email, otp) => {
  try {
    const response = await axios.post(validateOTP_API_URL, { email, otp });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk reset password
export const resetPassword = async (email, otp, password, password_confirmation) => {
  try {
    const response = await axios.post(ResetPassword_API_URL, { email, otp, password, password_confirmation });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenTimestamp');
  
  delete axios.defaults.headers.common['Authorization'];
};