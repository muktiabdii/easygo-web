import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/auth';

// fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// fungsi untuk register
export const register = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// fungsi untuk mengirim email untuk reset password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/forgot`, { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// fungsi untuk validasi OTP
export const validateOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/validate-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// fungsi untuk reset password
export const resetPassword = async (email, otp, password, password_confirmation) => {
  try {
    const response = await axios.post(`${BASE_URL}/password/reset`, {
      email,
      otp,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
