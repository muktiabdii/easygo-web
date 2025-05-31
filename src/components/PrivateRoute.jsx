// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, validateTokenWithBackend } from '../utils/authUtils';
import LoadingIndicator from './LoadingIndicator';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      const isAuth = isAuthenticated();
      
      if (isAuth) {
        try {
          // Verify token with backend
          const validToken = await validateTokenWithBackend();
          if (validToken) {
            // Check role for admin-only routes
            const userRole = localStorage.getItem('user_role');
            if (adminOnly && userRole !== 'admin') {
              setIsValid(false); // Deny access if not admin
            } else {
              setIsValid(true); // Allow access for authenticated users
            }
          } else {
            setIsValid(false);
          }
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
  }, [adminOnly]); // Add adminOnly to dependency array

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to={adminOnly ? '/dashboard' : '/login'} state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;