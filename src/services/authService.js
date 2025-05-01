import axios from 'axios';

// inisiasi API URL
const Login_API_URL = 'http://localhost:8000/api/auth/login'; 
const Register_API_URL = 'http://localhost:8000/api/auth/register';

// fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await axios.post(Login_API_URL, { email, password });
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
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};

// fungsi untuk cek login
export const checkLogin = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }
    const response = await axios.get('http://localhost:8000/api/auth/check-login', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};