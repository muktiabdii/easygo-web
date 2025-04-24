import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/login'; // Ganti dengan URL API yang sesuai

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    return response.data; // Mengembalikan data response dari backend
  } catch (error) {
    throw error.response ? error.response.data : error.message; // Menangani error
  }
};
