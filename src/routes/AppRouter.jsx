import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/LoginPage";
import RegisterStepOne from "../pages/RegisterStepOne";
import RegisterStepTwo from "../pages/RegisterStepTwo";
import ForgotPasswordStepOne from "../pages/ForgotPasswordStepOne";
import ForgotPasswordStepTwo from "../pages/ForgotPasswordStepTwo";
import ForgotPasswordStepThree from "../pages/ForgotPasswordStepThree";
import Dashboard from "../pages/Dashboard";
import ChatPage from "../pages/ChatPage";
import AddPlace from "../pages/AddPlace";
import AddReview from "../pages/AddReview";
import Profile from "../pages/Profile";
import PlaceDetail from "../pages/PlaceDetail";
import Pedoman from "../pages/Pedoman";
import AllReview from "../pages/AllReview";
import AboutPage from "../pages/AboutPage";
import PrivateRoute from "../components/PrivateRoute";
import { checkTokenValidity } from "../utils/authUtils";
import { RegistrationProvider } from "../contexts/RegistrationContext";
import AnimatedPage from "../components/AnimatedPage"; // Sesuaikan path

// Fungsi untuk membungkus elemen dengan AnimatedPage
const withAnimatedPage = (element) => {
  return <AnimatedPage>{element}</AnimatedPage>;
};

export default function AppRouter() {
  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <RegistrationProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={withAnimatedPage(<Dashboard />)} />
            <Route path="/login" element={withAnimatedPage(<Login />)} />
            <Route
              path="/register-step-one"
              element={withAnimatedPage(<RegisterStepOne />)}
            />
            <Route
              path="/register-step-two"
              element={withAnimatedPage(<RegisterStepTwo />)}
            />
            <Route
              path="/forgot-password-step-one"
              element={withAnimatedPage(<ForgotPasswordStepOne />)}
            />
            <Route
              path="/forgot-password-step-two"
              element={withAnimatedPage(<ForgotPasswordStepTwo />)}
            />
            <Route
              path="/forgot-password-step-three"
              element={withAnimatedPage(<ForgotPasswordStepThree />)}
            />
            <Route
              path="/dashboard"
              element={withAnimatedPage(<Dashboard />)}
            />
            <Route
              path="/place-detail"
              element={withAnimatedPage(<PlaceDetail />)}
            />
            <Route 
              path="/pedoman" 
              element={<Pedoman />} 
            />
            <Route 
              path="/reviews" 
              element={<AllReview />} 
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>{withAnimatedPage(<Profile />)}</PrivateRoute>
              }
            />
            <Route
              path="/tambah-tempat"
              element={
                <PrivateRoute>{withAnimatedPage(<AddPlace />)}</PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>{withAnimatedPage(<ChatPage />)}</PrivateRoute>
              }
            />
            <Route
              path="/tambah-review"
              element={
                <PrivateRoute>{withAnimatedPage(<AddReview />)}</PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </RegistrationProvider>
  );
}
