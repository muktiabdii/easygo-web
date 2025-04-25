import { useState } from 'react';
import { login } from '../services/authService';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const loginUser = async (email, password) => {
      setLoading(true);
      setError(null);
  
      try {
        const data = await login(email, password); 
        if (data.token) {
          localStorage.setItem('token', data.token);
          return true; 
        } 
        
        else {
          setError('Login gagal: token tidak ditemukan');
          return false;
        }
      } 
      
      catch (err) {
        setError(err.message || 'Terjadi kesalahan saat login');
        return false;
      } 
      
      finally {
        setLoading(false);
      }
    };
  
    return { loginUser, loading, error };
  };
  