import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import LoadingIndicator from '../components/LoadingIndicator';

const RegisterStepTwo = () => {

  // inisiasi data dari hook useRegister
  const { registerUser, loading, error } = useRegister();
  
  // inisiasi state
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  
  // mengambil data dari localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('registerData'));

    if (password !== password_confirmation) {
      setLocalError('Password dan konfirmasi password tidak cocok');
      return;
    }

    // mengirim data ke API register
    const success = await registerUser({
      name: storedData.name,
      number: storedData.number,
      country: storedData.country,
      province: storedData.province,
      city: storedData.city,
      email,
      password,
      password_confirmation
    });

    if (success) {
      navigate('/login');
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
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Daftar</h1>

          {/* form */}
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Kata Sandi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Konfirmasi Kata Sandi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password_confirmation}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? 'Tunggu sebentar...' : 'Daftar'}
            </button>
          </form>
          {localError && <p className="text-red-500 text-sm mt-4">{localError}</p>}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterStepTwo;
