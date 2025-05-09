import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, validateTokenWithBackend } from '../utils/authUtils';
import LoadingIndicator from './LoadingIndicator';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // cek apakah user sudah login
      const isAuth = isAuthenticated();
      
      if (isAuth) {
        try {
          // verifikasi token
          const validToken = await validateTokenWithBackend();
          setIsValid(validToken);
        } catch (error) {
          console.error('Auth validation error:', error);
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;