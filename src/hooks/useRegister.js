import { useState } from 'react';
import { register } from '../services/authService'; 

export const useRegister = () => {

  // inisiasi state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // fungsi untuk mengirim data registrasi ke API
  const registerUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(data);
      if (response) {
        setSuccess(true);
        return true;
      } 
      
      else {
        setError('Terjadi kesalahan saat registrasi');
        return false;
      }
    } 
    
    catch (err) {
      setError(err.message || 'Terjadi kesalahan saat registrasi');
      return false;
    } 
    
    finally {
      setLoading(false);
    }
  };

  return { registerUser, loading, error, success };
};
