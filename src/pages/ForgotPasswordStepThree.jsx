import React, { useState } from 'react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import LoadingIndicator from '../components/LoadingIndicator';

const ForgotPasswordStepThree = () => {
  
  // inisialisasi data dari hook useForgotPassword
  const { resetNewPassword, loading, error } = useForgotPassword();

  // inisialisasi state
  const [password, setPassword] = useState('');
  const [password_confirmation, set_password_confirmation] = useState('');
  const [localError, setLocalError] = useState(null);

  // fungsi untuk mengirim data password baru ke API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    const otp = localStorage.getItem('otp');

    if (password !== password_confirmation) {
      setLocalError('Password dan konfirmasi password tidak cocok');
      return;
    }
    const success = await resetNewPassword(email, otp, password, password_confirmation);
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
          <h1 className="text-[40px] font-bold mb-2">Reset Password</h1>
            <input
              type="password"
              placeholder="Kata Sandi Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Ulangi Kata Sandi Baru"
              value={password_confirmation}
              onChange={(e) => set_password_confirmation(e.target.value)}
              className="w-full max-w-[400px] mt-2 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="mt-2 w-full max-w-[400px] bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu Sebentar...' : 'Ubah Kata Sandi'}
            </button>
          </form>
          {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

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

export default ForgotPasswordStepThree
