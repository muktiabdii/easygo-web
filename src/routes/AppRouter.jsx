import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/LoginPage";
import RegisterStepOne from "../pages/RegisterStepOne";
import RegisterStepTwo from "../pages/RegisterStepTwo";
import ForgotPasswordStepOne from '../pages/ForgotPasswordStepOne'
import ForgotPasswordStepTwo from '../pages/ForgotPasswordStepTwo'
import Dashboard from '../pages/Dashboard'
import ChatPage from '../pages/ChatPage'
import Maps from "../pages/Maps";
import AddPlace from "../pages/AddPlace";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/tambah-tempat" element={<AddPlace />} />
      </Routes>
    </BrowserRouter>
  );
}
