// authService.js
import axios from 'axios';

// Initialize API URLs
const Login_API_URL = 'http://localhost:8000/api/auth/login'; 
const Register_API_URL = 'http://localhost:8000/api/auth/register';
const ForgotPassword_API_URL = 'http://localhost:8000/api/auth/password/forgot';
const validateOTP_API_URL = 'http://localhost:8000/api/auth/password/validate-otp';
const ResetPassword_API_URL = 'http://localhost:8000/api/auth/password/reset';

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(Login_API_URL, 
      { email, password }, 
      { withCredentials: true } 
    );
    
    // Store auth state - we rely on HttpOnly cookies for the actual token
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// Register function
export const register = async (data) => {
  try {
    const response = await axios.post(Register_API_URL, 
      data, 
      { withCredentials: true } 
    );
    
    // Store auth state if auto-login after registration
    if (response.data && response.data.token) {
      setAuth(response.data.token);
    }
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// Send email for password reset
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(ForgotPassword_API_URL, { email });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// OTP validation function
export const validateOTP = async (email, otp) => {
  try {
    const response = await axios.post(validateOTP_API_URL, { email, otp });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// Reset password function
export const resetPassword = async (email, otp, password, password_confirmation) => {
  try {
    const response = await axios.post(ResetPassword_API_URL, { email, otp, password, password_confirmation });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};