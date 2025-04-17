import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import RegisterStepOne from "../pages/RegisterStepOne";
import RegisterStepTwo from "../pages/RegisterStepTwo";
import ForgotPassword from '../pages/ForgotPassword';
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/tambah-tempat" element={<AddPlace />} />
      </Routes>
    </BrowserRouter>
  );
}
