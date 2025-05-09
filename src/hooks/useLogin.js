import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/authService';

export const useLogin = () => {
  // inisialisasi navigasi dan lokasi
  const navigate = useNavigate();
  const location = useLocation();

  // inisiasi state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // fungsi untuk mengirim data login ke API
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await login(email, password);
      
      if (data.token) {
        // navigasi ke halaman yang user coba akses sebelumnya
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
        return true;
      } else {
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