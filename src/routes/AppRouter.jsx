import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProfileEdit from "../pages/ProfileEdit";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/tambah-tempat" element={<AddPlace />} />
        <Route path="/tambah-review" element={<AddReview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/place-detail" element={<PlaceDetail />} />
        <Route path="/edit-profile" element={<ProfileEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
