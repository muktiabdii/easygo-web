import axios from 'axios';

const Login_API_URL = 'http://localhost:8000/api/auth/login'; 

export const login = async (email, password) => {
  try {
    const response = await axios.post(Login_API_URL, { email, password });
    return response.data; 
  } 
  
  catch (error) {
    throw error.response ? error.response.data : error.message; 
  }
};
