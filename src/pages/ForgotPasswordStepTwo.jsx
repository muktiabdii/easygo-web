import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import LoadingIndicator from '../components/LoadingIndicator';

const ForgotPasswordStepTwo = () => {

  // inisialisasi data dari hook useForgotPassword
  const { validateOTPCode, loading, error } = useForgotPassword();

  // inisialisasi state
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  
  // fungsi untuk mengirim data OTP ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email'); 
    localStorage.setItem('otp', otp);
    const success = await validateOTPCode(email, otp);

    if (success) {
      navigate('/forgot-password-step-three');
    }
  };

  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>

      {/* loading indikator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator /> 
        </div>
      )}

      {/* form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full min-w-[540px] p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
        <form className="flex flex-col items-center space-y-4 text-center" onSubmit={handleSubmit}>
          <h1 className="text-[40px] font-bold mb-4">Masukkan Kode OTP</h1>
          <p className="max-w-[416px] mb-6 text-[16px]">Masukkan kode OTP yang telah anda terima</p>
            <input
              type="number"
              placeholder="Kode OTP"
              value ={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="mt-2 w-full max-w-[400px] bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu Sebentar...' : 'Submit Kode OTP'}
            </button>
          </form>

          <p className="text-sm mt-4">
            Ingat kata sandi?{' '}
            <a href="/login" className="font-semibold hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordStepTwo
