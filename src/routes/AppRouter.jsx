import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/LoginPage";
import RegisterStepOne from "../pages/RegisterStepOne";
import RegisterStepTwo from "../pages/RegisterStepTwo";
import ForgotPasswordStepOne from '../pages/ForgotPasswordStepOne'
import ForgotPasswordStepTwo from '../pages/ForgotPasswordStepTwo'
import ForgotPasswordStepThree from '../pages/ForgotPasswordStepThree';
import Dashboard from '../pages/Dashboard'
import ChatPage from '../pages/ChatPage'
import AddPlace from "../pages/AddPlace";
import AddReview from "../pages/AddReview";
import Profile from "../pages/Profile";
import PlaceDetail from "../pages/PlaceDetail";
import PrivateRoute from '../components/PrivateRoute';
import { checkTokenValidity } from '../utils/authUtils';
import { RegistrationProvider } from '../contexts/RegistrationContext';
import ProfileEdit from "../pages/ProfileEdit";

export default function AppRouter() {
  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (

    <RegistrationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-step-one" element={<RegisterStepOne />} />
          <Route path="/register-step-two" element={<RegisterStepTwo />} />
          <Route path="/forgot-password-step-one" element={<ForgotPasswordStepOne />} />
          <Route path="/forgot-password-step-two" element={<ForgotPasswordStepTwo />} />
          <Route path="/forgot-password-step-three" element={<ForgotPasswordStepThree />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/place-detail" element={<PlaceDetail />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          {/* Protected routes */}
          <Route 
            path="/tambah-tempat" 
            element={
              <PrivateRoute>
                <AddPlace />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            } 
          />
          <Route path="/tambah-review" element={
            <PrivateRoute>
              <AddReview />
            </PrivateRoute>
            
            } />
          <Route path="/edit-profile" element={
            <PrivateRoute>
                   <ProfileEdit />
            </PrivateRoute>
            }
             />
        
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RegistrationProvider>

  );
}