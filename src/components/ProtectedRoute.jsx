import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        // Jika Anda memiliki endpoint untuk memverifikasi token
        await checkLogin();
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    verifyAuth();
  }, [navigate]);

  // Jika tidak ada token, akan redirect ke login sebelum render children
  return localStorage.getItem('token') ? children : null;
};

export default ProtectedRoute;