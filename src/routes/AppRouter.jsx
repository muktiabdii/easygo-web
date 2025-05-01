import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import Login from "../pages/LoginPage";
import RegisterStepOne from "../pages/RegisterStepOne";
import RegisterStepTwo from "../pages/RegisterStepTwo";
import ForgotPasswordStepOne from '../pages/ForgotPasswordStepOne'
import ForgotPasswordStepTwo from '../pages/ForgotPasswordStepTwo'
import ForgotPasswordStepThree from '../pages/ForgotPasswordStepThree';
import Dashboard from '../pages/Dashboard'
import ChatPage from '../pages/ChatPage'
import AddPlace from "../pages/AddPlace";
import PlaceDetail from "../pages/PlaceDetail";
import Profile from "../pages/Profile";
import PlaceDetail from "../pages/PlaceDetail";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-step-one" element={<RegisterStepOne />} />
        <Route path="/register-step-two" element={<RegisterStepTwo />} />
        <Route path="/forgot-password-step-one" element={<ForgotPasswordStepOne />} />
        <Route path="/forgot-password-step-two" element={<ForgotPasswordStepTwo />} />
        <Route path="/forgot-password-step-three" element={<ForgotPasswordStepThree />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
          } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/tambah-tempat" element={
          <ProtectedRoute>
            <AddPlace />
          </ProtectedRoute>
        } />
        <Route path="/place-detail" element={
          <ProtectedRoute>
            <PlaceDetail />
          </ProtectedRoute>
          } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/place-detail" element={<PlaceDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
