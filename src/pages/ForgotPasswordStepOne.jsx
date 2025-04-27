import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import LoadingIndicator from '../components/LoadingIndicator';

const ForgotPasswordStepOne = () => {

  // inisialisasi data dari hook useForgotPassword
  const { sendForgotPasswordEmail, loading, error } = useForgotPassword();

  // inisialisasi state
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // fungsi untuk mengirim data email ke API
  const onSubmit = async (e) => {
    e.preventDefault();
    const success =  await sendForgotPasswordEmail(email);
    localStorage.setItem('email', email);

    if (success) {
      navigate('/forgot-password-step-two');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat" style={{ backgroundPosition: '-30px 0px' }}>
      
      {/* loading indikator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <LoadingIndicator /> 
        </div>
      )}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full min-w-[540px] p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <form className="flex flex-col items-center space-y-4 text-center" onSubmit={onSubmit}>
            <h1 className="text-2xl font-bold mb-2">Lupa Password?</h1>
            <p className="max-w-[416px] mb-2 text-[16px]">
              Masukkan email yang terdaftar untuk menerima kode OTP reset password
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="mt-2 w-full max-w-[400px] bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
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
  );
};

export default ForgotPasswordStepOne;
