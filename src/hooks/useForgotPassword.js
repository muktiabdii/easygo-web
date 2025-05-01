import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, validateOTP, resetPassword } from '../services/authService';

export const useForgotPassword = () => {
  
  // inisiasi navigasi
  const navigate = useNavigate();

  // inisiasi state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: fungsi untuk mengirim email ke API
  const sendForgotPasswordEmail = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email); 
      navigate('/forgot-password-step-two');
    } 
    
    catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengirim email');
    } 
    
    finally {
      setLoading(false);
    }
  };

  // Step 2: fungsi untuk verifikasi OTP
  const validateOTPCode = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      await validateOTP(email, otp);
      navigate('/forgot-password-step-three');
    } 
    
    catch (err) {
      setError(err.message || 'Kode OTP salah atau sudah expired');
    } 
    
    finally {
      setLoading(false);
    }
  };

  // Step 3: fungsi untuk reset password baru
  const resetNewPassword = async (email, otp, password, password_confirmation) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email, otp, password, password_confirmation);
      navigate('/login');
    } 
    
    catch (err) {
      setError(err.message || 'Gagal reset password');
    } 
    
    finally {
      setLoading(false);
    }
  };

  return {
    sendForgotPasswordEmail,
    validateOTPCode,
    resetNewPassword,
    loading,
    error
  };
}
